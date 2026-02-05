import { useState, useEffect } from 'react';

const NAMESPACE = 'viral-site-opal';
const KEY = 'visitors';

interface CounterState {
  count: number;
  isLoading: boolean;
  error: boolean;
}

export function useVisitorCount(): CounterState {
  const [state, setState] = useState<CounterState>({
    count: 0,
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');

    const fetchCount = async () => {
      try {
        // 첫 방문이면 hit (카운트 증가), 아니면 get (조회만)
        const endpoint = hasVisited ? 'get' : 'hit';
        const response = await fetch(
          `https://api.countapi.xyz/${endpoint}/${NAMESPACE}/${KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        // 첫 방문 표시
        if (!hasVisited) {
          sessionStorage.setItem('hasVisited', 'true');
        }

        setState({
          count: data.value || 0,
          isLoading: false,
          error: false,
        });
      } catch {
        // API 실패 시 로컬스토리지 기반 폴백
        const fallbackCount = parseInt(localStorage.getItem('visitorCount') || '100000');
        const newCount = hasVisited ? fallbackCount : fallbackCount + 1;

        if (!hasVisited) {
          localStorage.setItem('visitorCount', String(newCount));
          sessionStorage.setItem('hasVisited', 'true');
        }

        setState({
          count: newCount,
          isLoading: false,
          error: true,
        });
      }
    };

    fetchCount();
  }, []);

  return state;
}

export function formatCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`;
  }
  return count.toLocaleString();
}
