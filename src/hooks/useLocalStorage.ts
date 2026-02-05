import { useState, useCallback } from 'react';

// 로컬 스토리지 훅
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// 테스트 결과 타입
export interface TestRecord {
  id: string;
  testType: string;
  testName: string;
  result: string;
  resultEmoji: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  details?: Record<string, unknown>;
  timestamp: number;
}

// 유저 프로필
export interface UserProfile {
  nickname: string;
  createdAt: number;
  totalTests: number;
  badges: string[];
}

// 뱃지 정의
export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
}

// 전체 유저 데이터
export interface UserData {
  profile: UserProfile | null;
  records: TestRecord[];
  badges: Badge[];
  stats: {
    [testType: string]: {
      totalAttempts: number;
      bestScore?: number;
      bestResult?: string;
      avgScore?: number;
      lastPlayedAt?: number;
    };
  };
}

const DEFAULT_USER_DATA: UserData = {
  profile: null,
  records: [],
  badges: [],
  stats: {},
};

// 유저 데이터 훅
export function useUserData() {
  const [userData, setUserData] = useLocalStorage<UserData>('viral-site-user-data', DEFAULT_USER_DATA);

  // 프로필 설정
  const setProfile = useCallback((nickname: string) => {
    setUserData(prev => ({
      ...prev,
      profile: {
        nickname,
        createdAt: Date.now(),
        totalTests: prev.profile?.totalTests || 0,
        badges: prev.profile?.badges || [],
      },
    }));
  }, [setUserData]);

  // 테스트 결과 저장
  const saveRecord = useCallback((record: Omit<TestRecord, 'id' | 'timestamp'>) => {
    const newRecord: TestRecord = {
      ...record,
      id: `${record.testType}-${Date.now()}`,
      timestamp: Date.now(),
    };

    setUserData(prev => {
      // 기존 기록에 추가 (최대 100개 유지)
      const newRecords = [newRecord, ...prev.records].slice(0, 100);

      // 통계 업데이트
      const testStats = prev.stats[record.testType] || {
        totalAttempts: 0,
        bestScore: undefined,
        avgScore: undefined,
      };

      const newTotalAttempts = testStats.totalAttempts + 1;
      const newBestScore = record.score !== undefined
        ? Math.max(testStats.bestScore || 0, record.score)
        : testStats.bestScore;

      // 평균 점수 계산
      const allScores = newRecords
        .filter(r => r.testType === record.testType && r.score !== undefined)
        .map(r => r.score!);
      const newAvgScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : undefined;

      return {
        ...prev,
        records: newRecords,
        profile: prev.profile ? {
          ...prev.profile,
          totalTests: prev.profile.totalTests + 1,
        } : null,
        stats: {
          ...prev.stats,
          [record.testType]: {
            totalAttempts: newTotalAttempts,
            bestScore: newBestScore,
            bestResult: record.result,
            avgScore: newAvgScore,
            lastPlayedAt: Date.now(),
          },
        },
      };
    });

    return newRecord;
  }, [setUserData]);

  // 뱃지 추가
  const addBadge = useCallback((badge: Omit<Badge, 'unlockedAt'>) => {
    setUserData(prev => {
      // 이미 있는 뱃지면 무시
      if (prev.badges.some(b => b.id === badge.id)) return prev;

      return {
        ...prev,
        badges: [...prev.badges, { ...badge, unlockedAt: Date.now() }],
        profile: prev.profile ? {
          ...prev.profile,
          badges: [...prev.profile.badges, badge.id],
        } : null,
      };
    });
  }, [setUserData]);

  // 특정 테스트의 기록 가져오기
  const getRecordsByTest = useCallback((testType: string) => {
    return userData.records.filter(r => r.testType === testType);
  }, [userData.records]);

  // 최근 기록 가져오기
  const getRecentRecords = useCallback((limit: number = 10) => {
    return userData.records.slice(0, limit);
  }, [userData.records]);

  // 통계 가져오기
  const getStats = useCallback((testType: string) => {
    return userData.stats[testType] || null;
  }, [userData.stats]);

  // 데이터 초기화
  const resetData = useCallback(() => {
    setUserData(DEFAULT_USER_DATA);
  }, [setUserData]);

  return {
    userData,
    setProfile,
    saveRecord,
    addBadge,
    getRecordsByTest,
    getRecentRecords,
    getStats,
    resetData,
  };
}
