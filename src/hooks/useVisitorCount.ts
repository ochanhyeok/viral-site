import { useState, useEffect } from 'react';

const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';

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
    const hasVisited = sessionStorage.getItem('hasVisited');

    const updateCount = async () => {
      try {
        if (!hasVisited) {
          // 첫 방문: 카운트 증가
          const response = await fetch(`${FIREBASE_DB_URL}/visitors.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ '.sv': { 'increment': 1 } }),
          });

          // increment가 안되면 직접 증가
          if (!response.ok) {
            const getRes = await fetch(`${FIREBASE_DB_URL}/visitors.json`);
            const current = await getRes.json() || 0;
            await fetch(`${FIREBASE_DB_URL}/visitors.json`, {
              method: 'PUT',
              body: JSON.stringify(current + 1),
            });
          }

          sessionStorage.setItem('hasVisited', 'true');
        }

        // 현재 카운트 조회
        const response = await fetch(`${FIREBASE_DB_URL}/visitors.json`);
        const count = await response.json() || 0;

        setState({ count, isLoading: false });
      } catch (error) {
        console.error('Counter error:', error);
        // 에러 시 기본값 표시
        setState({ count: 100000, isLoading: false });
      }
    };

    updateCount();
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
