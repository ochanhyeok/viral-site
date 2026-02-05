import { useState } from 'react';
import { SEO } from '../components';
import type { RankingType } from '../hooks/useRanking';
import { useRanking, formatScore } from '../hooks/useRanking';
import { useUserData } from '../hooks/useLocalStorage';

interface TabConfig {
  id: RankingType;
  label: string;
  emoji: string;
  gradient: string;
  scoreLabel: string;
}

const tabs: TabConfig[] = [
  {
    id: 'color-test',
    label: '색감',
    emoji: '●',
    gradient: 'from-violet-500 to-fuchsia-500',
    scoreLabel: '점수',
  },
  {
    id: 'reaction-test',
    label: '반응속도',
    emoji: '◇',
    gradient: 'from-yellow-400 to-orange-500',
    scoreLabel: '기록',
  },
  {
    id: 'emoji-quiz',
    label: '퀴즈',
    emoji: '▣',
    gradient: 'from-pink-500 to-orange-500',
    scoreLabel: '점수',
  },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <span className="text-2xl">🥇</span>;
  }
  if (rank === 2) {
    return <span className="text-2xl">🥈</span>;
  }
  if (rank === 3) {
    return <span className="text-2xl">🥉</span>;
  }
  return (
    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
      {rank}
    </span>
  );
}

export function RankingPage() {
  const [activeTab, setActiveTab] = useState<RankingType>('color-test');
  const { userData } = useUserData();
  const nickname = userData.profile?.nickname;

  const { rankings, myRank, isLoading } = useRanking(activeTab, nickname);

  const activeConfig = tabs.find(t => t.id === activeTab)!;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <>
      <SEO
        title="랭킹 - 테스트 순위"
        description="색감 테스트, 반응속도 테스트, 이모지 퀴즈 랭킹을 확인하세요!"
      />

      <div className="max-w-lg mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-black text-gray-900">랭킹</h1>
          <p className="text-gray-500 text-sm mt-1">실시간 TOP 100</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.emoji}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 내 순위 */}
        {nickname && myRank && (
          <div className={`bg-gradient-to-r ${activeConfig.gradient} rounded-2xl p-4 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {myRank}
                </div>
                <div>
                  <p className="font-bold">{nickname}</p>
                  <p className="text-white/70 text-sm">나의 순위</p>
                </div>
              </div>
              {myRank <= 3 && (
                <span className="text-3xl">
                  {myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : '🥉'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 닉네임 미설정 안내 */}
        {!nickname && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-700 text-sm">
              랭킹에 등록하려면 <a href="/my" className="font-bold underline">마이페이지</a>에서 닉네임을 설정하세요!
            </p>
          </div>
        )}

        {/* 랭킹 목록 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
            <span className="w-12 text-center">순위</span>
            <span className="flex-1">닉네임</span>
            <span className="w-20 text-right">{activeConfig.scoreLabel}</span>
          </div>

          {/* 로딩 */}
          {isLoading && (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-sm">로딩 중...</p>
            </div>
          )}

          {/* 빈 상태 */}
          {!isLoading && rankings.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center text-gray-400 text-xl">—</div>
              <p className="text-gray-500">아직 기록이 없어요</p>
              <p className="text-gray-400 text-sm mt-1">첫 번째 도전자가 되어보세요!</p>
            </div>
          )}

          {/* 랭킹 리스트 */}
          {!isLoading && rankings.length > 0 && (
            <div className="divide-y divide-gray-100">
              {rankings.map((entry, index) => {
                const rank = index + 1;
                const isMe = nickname && entry.nickname === nickname;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center px-4 py-3 ${
                      isMe ? 'bg-violet-50' : rank <= 3 ? 'bg-amber-50/50' : ''
                    }`}
                  >
                    <div className="w-12 flex justify-center">
                      <RankBadge rank={rank} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isMe ? 'text-violet-600' : 'text-gray-900'}`}>
                        {entry.nickname}
                        {isMe && <span className="ml-1 text-xs">(나)</span>}
                      </p>
                      <p className="text-xs text-gray-400">{formatDate(entry.timestamp)}</p>
                    </div>
                    <div className="w-20 text-right">
                      <span className={`font-bold ${
                        rank === 1 ? 'text-amber-500' :
                        rank === 2 ? 'text-gray-500' :
                        rank === 3 ? 'text-amber-700' :
                        'text-gray-700'
                      }`}>
                        {formatScore(activeTab, entry.score)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 안내 */}
        <p className="text-center text-xs text-gray-400">
          테스트 완료 시 자동으로 랭킹에 등록됩니다
        </p>
      </div>
    </>
  );
}
