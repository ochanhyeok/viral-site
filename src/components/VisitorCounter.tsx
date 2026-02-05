import { useVisitorCount, formatCount } from '../hooks/useVisitorCount';

export function VisitorCounter() {
  const { count, isLoading } = useVisitorCount();

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      {isLoading ? (
        <span className="animate-pulse">불러오는 중...</span>
      ) : (
        <span>
          <strong className="text-gray-700">{formatCount(count)}명</strong>이 이용했어요
        </span>
      )}
    </div>
  );
}
