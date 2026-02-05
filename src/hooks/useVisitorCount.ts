import { useState, useEffect } from 'react';

// 시작 날짜와 기본 카운트
const BASE_DATE = new Date('2025-01-01').getTime();
const BASE_COUNT = 100000;
const DAILY_GROWTH = 500; // 하루 평균 증가량

interface CounterState {
  count: number;
  isLoading: boolean;
}

export function useVisitorCount(): CounterState {
  const [state, setState] = useState<CounterState>({
    count: 0,
    isLoading: true,
  });

  useEffect(() => {
    // 현재 날짜 기준으로 카운트 계산
    const now = Date.now();
    const daysPassed = Math.floor((now - BASE_DATE) / (1000 * 60 * 60 * 24));

    // 기본 카운트 + 일별 증가량 + 랜덤 변동
    const baseGrowth = daysPassed * DAILY_GROWTH;
    const randomVariation = Math.floor(Math.random() * 1000);
    const totalCount = BASE_COUNT + baseGrowth + randomVariation;

    // 약간의 로딩 딜레이 (자연스러움)
    setTimeout(() => {
      setState({
        count: totalCount,
        isLoading: false,
      });
    }, 300);
  }, []);

  return state;
}

export function formatCount(count: number): string {
  if (count >= 10000) {
    const man = count / 10000;
    return man >= 10 ? `${Math.floor(man)}만` : `${man.toFixed(1)}만`;
  }
  return count.toLocaleString();
}
