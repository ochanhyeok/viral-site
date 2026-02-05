// 실시간 활동 피드 - Firebase 실제 데이터
import { useActivityFeed, formatTimeAgo } from '../hooks/useActivityFeed';

export function LiveFeed() {
  const { activities, isLoading } = useActivityFeed(5);

  // 활동이 없으면 표시하지 않음
  if (isLoading || activities.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl p-4 shadow-lg shadow-gray-100/50 border border-gray-100/80">
      {/* 배경 그라데이션 장식 */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-green-400 to-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-gray-600 tracking-wide">실시간 활동</span>
          <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">LIVE</span>
        </div>

        <div className="space-y-2.5">
          {activities.slice(0, 3).map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-center gap-3 text-sm p-2.5 rounded-xl transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-violet-50/80 to-purple-50/50 border border-violet-100/50'
                  : 'hover:bg-gray-50/80'
              }`}
            >
              <span className="text-lg flex-shrink-0">{activity.emoji}</span>
              <span className={`flex-1 truncate ${index === 0 ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
                누군가 {activity.message}
              </span>
              <span className={`text-xs flex-shrink-0 ${index === 0 ? 'text-violet-500 font-medium' : 'text-gray-400'}`}>
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 토스트는 일단 비활성화 (나중에 필요하면 사용)
export function LiveToast() {
  return null;
}
