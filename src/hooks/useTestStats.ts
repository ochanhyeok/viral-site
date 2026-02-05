import { useState, useEffect } from 'react';

const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';

interface TestResult {
  resultType: string;
  score?: number;
  ageGroup: string;
  timestamp: number;
}

interface AgeGroupStats {
  [resultType: string]: number;
}

interface StatsState {
  myAgeGroupStats: AgeGroupStats | null;
  totalCount: number;
  ageGroupCount: number;
  isLoading: boolean;
}

export type TestType = 'spending' | 'mbti' | 'stress' | 'kkondae' | 'color-test' | 'reaction-test';

// 결과 저장
export async function saveTestResult(
  testType: TestType,
  resultType: string,
  ageGroup: string,
  score?: number
): Promise<void> {
  try {
    const result: TestResult = {
      resultType,
      score,
      ageGroup,
      timestamp: Date.now(),
    };

    // 결과 저장
    await fetch(`${FIREBASE_DB_URL}/results/${testType}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });

    // 통계 업데이트 (나이대별 결과 카운트)
    const statsPath = `${FIREBASE_DB_URL}/stats/${testType}/${ageGroup}/${resultType}.json`;
    const currentRes = await fetch(statsPath);
    const current = await currentRes.json() || 0;

    await fetch(statsPath, {
      method: 'PUT',
      body: JSON.stringify(current + 1),
    });
  } catch (error) {
    console.error('Failed to save result:', error);
  }
}

// 나이대별 통계 조회
export function useTestStats(
  testType: TestType,
  ageGroup: string | null
): StatsState {
  const [state, setState] = useState<StatsState>({
    myAgeGroupStats: null,
    totalCount: 0,
    ageGroupCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    if (!ageGroup) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchStats = async () => {
      try {
        // 나이대별 통계
        const ageGroupRes = await fetch(
          `${FIREBASE_DB_URL}/stats/${testType}/${ageGroup}.json`
        );
        const ageGroupData = await ageGroupRes.json();

        // 전체 통계
        const allStatsRes = await fetch(
          `${FIREBASE_DB_URL}/stats/${testType}.json`
        );
        const allStatsData = await allStatsRes.json();

        // 전체 참여자 수 계산
        let totalCount = 0;
        let ageGroupCount = 0;

        if (allStatsData) {
          Object.values(allStatsData).forEach((ageData: unknown) => {
            if (ageData && typeof ageData === 'object') {
              Object.values(ageData as Record<string, number>).forEach((count) => {
                totalCount += count;
              });
            }
          });
        }

        if (ageGroupData) {
          Object.values(ageGroupData as Record<string, number>).forEach((count) => {
            ageGroupCount += count;
          });
        }

        setState({
          myAgeGroupStats: ageGroupData || {},
          totalCount,
          ageGroupCount,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, [testType, ageGroup]);

  return state;
}

// 나이대별 결과 비율 계산
export function calculatePercentage(
  stats: AgeGroupStats | null,
  resultType: string
): number {
  if (!stats) return 0;

  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;

  return Math.round((stats[resultType] || 0) / total * 100);
}

// 테스트별 총 참여자 수 조회 (인트로 화면용)
export function useTotalParticipants(
  testType: TestType
): { totalCount: number; isLoading: boolean } {
  const [state, setState] = useState<{ totalCount: number; isLoading: boolean }>({
    totalCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const response = await fetch(
          `${FIREBASE_DB_URL}/stats/${testType}.json`
        );
        const data = await response.json();

        let totalCount = 0;
        if (data) {
          Object.values(data).forEach((ageData: unknown) => {
            if (ageData && typeof ageData === 'object') {
              Object.values(ageData as Record<string, number>).forEach((count) => {
                totalCount += count;
              });
            }
          });
        }

        setState({ totalCount, isLoading: false });
      } catch (error) {
        console.error('Failed to fetch total count:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchTotalCount();
  }, [testType]);

  return state;
}

// 색감 테스트용 간단한 통계 (나이대 없음)
export function useColorTestStats() {
  const [stats, setStats] = useState<{
    count: number;
    totalCount: number;
    percentage: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const submitResult = async (resultType: string) => {
    try {
      // 결과 카운트 증가
      const statsPath = `${FIREBASE_DB_URL}/stats/color-test/${resultType}.json`;
      const currentRes = await fetch(statsPath);
      const current = await currentRes.json() || 0;

      await fetch(statsPath, {
        method: 'PUT',
        body: JSON.stringify(current + 1),
      });
    } catch (error) {
      console.error('Failed to save color test result:', error);
    }
  };

  const getStats = async (resultType: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${FIREBASE_DB_URL}/stats/color-test.json`);
      const data = await response.json();

      let totalCount = 0;
      let myCount = 0;

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          const count = value as number;
          totalCount += count;
          if (key === resultType) {
            myCount = count;
          }
        });
      }

      const percentage = totalCount > 0 ? Math.round((myCount / totalCount) * 100) : 0;

      setStats({
        count: myCount,
        totalCount,
        percentage,
      });
    } catch (error) {
      console.error('Failed to fetch color test stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, submitResult, getStats };
}
