// 실시간 활동 피드 - Firebase 실제 데이터
import { useActivityFeed, formatTimeAgo } from '../hooks/useActivityFeed';

export function LiveFeed() {
  const { activities, isLoading } = useActivityFeed(5);

  // 활동이 없으면 표시하지 않음
  if (isLoading || activities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-medium text-gray-500">실시간</span>
      </div>

      <div className="space-y-2">
        {activities.slice(0, 3).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <span>{activity.emoji}</span>
            <span className="flex-1 truncate">누군가 {activity.message}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {formatTimeAgo(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 토스트는 일단 비활성화 (나중에 필요하면 사용)
export function LiveToast() {
  return null;
}
