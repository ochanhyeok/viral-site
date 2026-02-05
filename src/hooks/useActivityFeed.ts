// 실시간 활동 피드 - Firebase 연동
import { useState, useEffect } from 'react';

const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';

export interface Activity {
  id: string;
  type: 'salary' | 'retirement' | 'spending' | 'mbti' | 'stress' | 'kkondae' | 'color' | 'reaction' | 'emoji' | 'battleship';
  message: string;
  emoji: string;
  timestamp: number;
}

const activityEmojis: Record<Activity['type'], string> = {
  salary: '💰',
  retirement: '🏦',
  spending: '💸',
  mbti: '👔',
  stress: '🧠',
  kkondae: '👴',
  color: '🎨',
  reaction: '⚡',
  emoji: '🧩',
  battleship: '🚢',
};

const activityLabels: Record<Activity['type'], string> = {
  salary: '연봉 계산',
  retirement: '퇴직금 계산',
  spending: '소비성향 테스트',
  mbti: '직장인 MBTI',
  stress: '스트레스 테스트',
  kkondae: '꼰대력 테스트',
  color: '색감 테스트',
  reaction: '반응속도 테스트',
  emoji: '이모지 퀴즈',
  battleship: '배틀쉽',
};

// 활동 기록
export async function logActivity(
  type: Activity['type'],
  detail?: string
): Promise<void> {
  try {
    const message = detail || `${activityLabels[type]} 완료`;

    const activity = {
      type,
      message,
      emoji: activityEmojis[type],
      timestamp: Date.now(),
    };

    await fetch(`${FIREBASE_DB_URL}/activities.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

// 최근 활동 가져오기
export function useActivityFeed(limit: number = 5) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // 최근 활동 가져오기 (orderBy + limitToLast)
        const response = await fetch(
          `${FIREBASE_DB_URL}/activities.json?orderBy="timestamp"&limitToLast=${limit}`
        );
        const data = await response.json();

        if (data) {
          const activityList: Activity[] = Object.entries(data)
            .map(([id, activity]) => ({
              id,
              ...(activity as Omit<Activity, 'id'>),
            }))
            .sort((a, b) => b.timestamp - a.timestamp);

          setActivities(activityList);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    // 30초마다 새로고침
    const interval = setInterval(fetchActivities, 30000);

    return () => clearInterval(interval);
  }, [limit]);

  return { activities, isLoading };
}

// 시간 포맷
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return '방금';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  return `${Math.floor(seconds / 86400)}일 전`;
}
