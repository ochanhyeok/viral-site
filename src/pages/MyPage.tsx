import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components';
import { useUserData } from '../hooks/useLocalStorage';
import { useBadges } from '../hooks/useBadges';
import { rarityColors, rarityNames } from '../data/badges';

type Tab = 'records' | 'badges' | 'stats';

export function MyPage() {
  const { userData, setProfile, resetData } = useUserData();
  const { earnedBadges, lockedBadges, progress, checkBadges } = useBadges();
  const [activeTab, setActiveTab] = useState<Tab>('records');
  const [nickname, setNickname] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 페이지 로드 시 뱃지 체크
  useEffect(() => {
    checkBadges();
  }, []);

  const handleSetNickname = () => {
    if (nickname.trim()) {
      setProfile(nickname.trim());
    }
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const testNames: Record<string, string> = {
    'color-test': '색감 테스트',
    'reaction-test': '반응속도 테스트',
    'emoji-quiz': '이모지 퀴즈',
    'work-mbti': '직장인 MBTI',
    'spending-quiz': '소비성향 테스트',
    'stress-test': '스트레스 테스트',
    'kkondae-test': '꼰대력 테스트',
  };

  return (
    <>
      <SEO
        title="마이페이지 - 내 기록 & 뱃지"
        description="나의 테스트 기록과 획득한 뱃지를 확인하세요!"
      />

      <div className="max-w-lg mx-auto space-y-6">
        {/* 프로필 섹션 */}
        <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 text-white shadow-xl">
          {userData.profile ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 font-bold">
                {earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1].emoji : userData.profile?.nickname?.charAt(0) || '?'}
              </div>
              <h1 className="text-2xl font-bold mb-1">{userData.profile.nickname}</h1>
              <p className="text-white/70 text-sm">
                총 {userData.profile.totalTests}회 테스트 완료
              </p>
              <div className="mt-4 flex justify-center gap-4 text-center">
                <div className="bg-white/20 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold">{earnedBadges.length}</p>
                  <p className="text-xs text-white/70">뱃지</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2">
                  <p className="text-2xl font-bold">{userData.records.length}</p>
                  <p className="text-xs text-white/70">기록</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 font-bold">
                ?
              </div>
              <h2 className="text-lg font-bold mb-3">닉네임을 설정하세요</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임 입력"
                  maxLength={10}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/20 placeholder-white/50 text-white border border-white/30 focus:outline-none focus:border-white"
                />
                <button
                  onClick={handleSetNickname}
                  className="px-4 py-2 bg-white text-purple-600 rounded-xl font-bold hover:bg-white/90 transition-all"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'records' as Tab, label: '기록' },
            { id: 'badges' as Tab, label: '뱃지' },
            { id: 'stats' as Tab, label: '통계' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-violet-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 기록 탭 */}
        {activeTab === 'records' && (
          <div className="space-y-3">
            {userData.records.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center text-gray-400 text-xl">—</div>
                <p className="text-gray-500 mb-4">아직 기록이 없어요</p>
                <Link
                  to="/"
                  className="inline-block px-6 py-2 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-all"
                >
                  테스트 하러 가기
                </Link>
              </div>
            ) : (
              userData.records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-4"
                >
                  <span className="text-3xl">{record.resultEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {testNames[record.testType] || record.testName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{record.result}</p>
                  </div>
                  <div className="text-right">
                    {record.score !== undefined && (
                      <p className="font-bold text-violet-600">{record.score}점</p>
                    )}
                    <p className="text-xs text-gray-400">{formatDate(record.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 뱃지 탭 */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* 진행률 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">뱃지 수집</span>
                <span className="text-sm text-gray-500">
                  {progress.earned}/{progress.total} ({progress.percentage}%)
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* 획득한 뱃지 */}
            {earnedBadges.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">획득한 뱃지</h3>
                <div className="grid grid-cols-3 gap-3">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`relative bg-gradient-to-br ${rarityColors[badge.rarity].gradient} rounded-2xl p-4 text-center text-white shadow-lg`}
                    >
                      <span className="text-3xl">{badge.emoji}</span>
                      <p className="text-xs font-bold mt-1 truncate">{badge.name}</p>
                      <span className="absolute top-2 right-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                        {rarityNames[badge.rarity]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 미획득 뱃지 */}
            <div>
              <h3 className="font-bold text-gray-500 mb-3">미획득 뱃지</h3>
              <div className="grid grid-cols-3 gap-3">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gray-100 rounded-2xl p-4 text-center relative opacity-60"
                  >
                    <span className="text-2xl text-gray-400">?</span>
                    <p className="text-xs font-bold mt-1 text-gray-500 truncate">{badge.name}</p>
                    <span className={`absolute top-2 right-2 text-[10px] ${rarityColors[badge.rarity].text} ${rarityColors[badge.rarity].bg} px-1.5 py-0.5 rounded-full`}>
                      {rarityNames[badge.rarity]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 통계 탭 */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {Object.keys(userData.stats).length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center text-gray-400 text-xl">—</div>
                <p className="text-gray-500 mb-4">아직 통계가 없어요</p>
                <Link
                  to="/"
                  className="inline-block px-6 py-2 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-all"
                >
                  테스트 하러 가기
                </Link>
              </div>
            ) : (
              Object.entries(userData.stats).map(([testType, stats]) => (
                <div
                  key={testType}
                  className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
                >
                  <h3 className="font-bold text-gray-900 mb-3">
                    {testNames[testType] || testType}
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 rounded-xl p-2">
                      <p className="text-lg font-bold text-violet-600">{stats.totalAttempts}</p>
                      <p className="text-xs text-gray-500">플레이</p>
                    </div>
                    {stats.bestScore !== undefined && (
                      <div className="bg-gray-50 rounded-xl p-2">
                        <p className="text-lg font-bold text-green-600">{stats.bestScore}</p>
                        <p className="text-xs text-gray-500">최고점</p>
                      </div>
                    )}
                    {stats.avgScore !== undefined && (
                      <div className="bg-gray-50 rounded-xl p-2">
                        <p className="text-lg font-bold text-blue-600">{stats.avgScore}</p>
                        <p className="text-xs text-gray-500">평균</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 데이터 초기화 */}
        <div className="pt-4">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 text-red-500 text-sm hover:bg-red-50 rounded-xl transition-all"
          >
            데이터 초기화
          </button>
        </div>

        {/* 초기화 확인 모달 */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">정말 초기화할까요?</h3>
              <p className="text-gray-500 text-sm mb-4">
                모든 기록과 뱃지가 삭제됩니다. 이 작업은 되돌릴 수 없어요.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
