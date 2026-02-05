import { useState, useEffect, useCallback } from 'react';

const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';

export interface RankingEntry {
  id: string;
  nickname: string;
  score: number;
  result?: string;
  timestamp: number;
}

export interface RankingData {
  rankings: RankingEntry[];
  myRank: number | null;
  isLoading: boolean;
  error: string | null;
}

// 랭킹 타입 정의
export type RankingType = 'color-test' | 'reaction-test' | 'emoji-quiz';

// 랭킹 설정 (점수 정렬 방식)
const rankingConfig: Record<RankingType, { sortOrder: 'asc' | 'desc'; label: string }> = {
  'color-test': { sortOrder: 'desc', label: '색감 테스트' }, // 점수 높을수록 좋음
  'reaction-test': { sortOrder: 'asc', label: '반응속도 테스트' }, // ms 낮을수록 좋음
  'emoji-quiz': { sortOrder: 'desc', label: '이모지 퀴즈' }, // 점수 높을수록 좋음
};

// 랭킹 제출
export async function submitRanking(
  testType: RankingType,
  nickname: string,
  score: number,
  result?: string
): Promise<{ success: boolean; rank?: number }> {
  try {
    const entry: Omit<RankingEntry, 'id'> = {
      nickname,
      score,
      result,
      timestamp: Date.now(),
    };

    // Firebase에 저장
    const response = await fetch(`${FIREBASE_DB_URL}/rankings/${testType}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (!response.ok) throw new Error('Failed to submit ranking');

    // 현재 순위 계산
    const rankingsRes = await fetch(`${FIREBASE_DB_URL}/rankings/${testType}.json`);
    const data = await rankingsRes.json();

    if (data) {
      const config = rankingConfig[testType];
      const entries = Object.entries(data).map(([id, val]) => ({
        id,
        ...(val as Omit<RankingEntry, 'id'>),
      }));

      // 정렬
      entries.sort((a, b) => {
        if (config.sortOrder === 'asc') {
          return a.score - b.score;
        }
        return b.score - a.score;
      });

      // 내 순위 찾기 (같은 점수 중 가장 최근 것)
      const myIndex = entries.findIndex(
        e => e.nickname === nickname && e.score === score
      );

      return { success: true, rank: myIndex + 1 };
    }

    return { success: true, rank: 1 };
  } catch (error) {
    console.error('Failed to submit ranking:', error);
    return { success: false };
  }
}

// 랭킹 조회 훅
export function useRanking(testType: RankingType, myNickname?: string): RankingData {
  const [data, setData] = useState<RankingData>({
    rankings: [],
    myRank: null,
    isLoading: true,
    error: null,
  });

  const fetchRankings = useCallback(async () => {
    try {
      const response = await fetch(`${FIREBASE_DB_URL}/rankings/${testType}.json`);
      const rawData = await response.json();

      if (!rawData) {
        setData({ rankings: [], myRank: null, isLoading: false, error: null });
        return;
      }

      const config = rankingConfig[testType];
      const entries: RankingEntry[] = Object.entries(rawData).map(([id, val]) => ({
        id,
        ...(val as Omit<RankingEntry, 'id'>),
      }));

      // 정렬
      entries.sort((a, b) => {
        if (config.sortOrder === 'asc') {
          return a.score - b.score;
        }
        return b.score - a.score;
      });

      // TOP 100만 유지
      const top100 = entries.slice(0, 100);

      // 내 순위 찾기
      let myRank: number | null = null;
      if (myNickname) {
        const myIndex = entries.findIndex(e => e.nickname === myNickname);
        if (myIndex !== -1) {
          myRank = myIndex + 1;
        }
      }

      setData({
        rankings: top100,
        myRank,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load rankings',
      }));
    }
  }, [testType, myNickname]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return data;
}

// 랭킹 설정 가져오기
export function getRankingConfig(testType: RankingType) {
  return rankingConfig[testType];
}

// 점수 포맷팅
export function formatScore(testType: RankingType, score: number): string {
  if (testType === 'reaction-test') {
    return `${score}ms`;
  }
  return `${score}점`;
}
