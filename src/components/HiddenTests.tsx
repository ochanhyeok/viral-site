// 숨겨진 테스트 해금 시스템
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HiddenTest {
  id: string;
  path: string;
  emoji: string;
  title: string;
  description: string;
  hint: string;
  unlockCondition: () => boolean;
  conditionText: string;
  gradient: string;
}

// 로컬스토리지에서 완료한 테스트 확인
function getCompletedTests(): string[] {
  try {
    const userData = localStorage.getItem('viralSiteUserData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return Object.keys(parsed.stats || {});
    }
  } catch {
    // ignore
  }
  return [];
}

function getTotalTestCount(): number {
  try {
    const userData = localStorage.getItem('viralSiteUserData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.profile?.totalTests || 0;
    }
  } catch {
    // ignore
  }
  return 0;
}

function getBadgeCount(): number {
  try {
    const userData = localStorage.getItem('viralSiteUserData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return (parsed.badges || []).length;
    }
  } catch {
    // ignore
  }
  return 0;
}

// 숨겨진 테스트 목록
const hiddenTests: HiddenTest[] = [
  {
    id: 'resignation-probability',
    path: '/resignation-test',
    emoji: '🚪',
    title: '진짜 퇴사 확률 테스트',
    description: '당신의 퇴사 확률은 몇 %?',
    hint: '테스트를 3개 이상 완료하면 해금!',
    conditionText: '테스트 3개 완료',
    gradient: 'from-red-500 to-orange-500',
    unlockCondition: () => getCompletedTests().length >= 3,
  },
  {
    id: 'boss-type',
    path: '/boss-type-test',
    emoji: '👔',
    title: '상사 유형 분석',
    description: '당신의 상사는 어떤 타입?',
    hint: '뱃지 3개 획득 시 해금!',
    conditionText: '뱃지 3개 획득',
    gradient: 'from-indigo-500 to-blue-500',
    unlockCondition: () => getBadgeCount() >= 3,
  },
  {
    id: 'work-style',
    path: '/work-style-test',
    emoji: '⚙️',
    title: '업무 스타일 진단',
    description: '나만의 일하는 방식은?',
    hint: '테스트 총 10회 완료 시 해금!',
    conditionText: '테스트 10회 완료',
    gradient: 'from-emerald-500 to-teal-500',
    unlockCondition: () => getTotalTestCount() >= 10,
  },
];

export function HiddenTests() {
  const [unlockedTests, setUnlockedTests] = useState<string[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  useEffect(() => {
    // 저장된 해금 상태 로드
    const saved = localStorage.getItem('unlockedHiddenTests');
    const savedList = saved ? JSON.parse(saved) : [];

    // 새로 해금된 테스트 확인
    const newUnlocks: string[] = [];
    hiddenTests.forEach(test => {
      if (test.unlockCondition() && !savedList.includes(test.id)) {
        newUnlocks.push(test.id);
      }
    });

    if (newUnlocks.length > 0) {
      const allUnlocked = [...savedList, ...newUnlocks];
      localStorage.setItem('unlockedHiddenTests', JSON.stringify(allUnlocked));
      setUnlockedTests(allUnlocked);
      setNewlyUnlocked(newUnlocks[0]); // 첫 번째 해금된 것 알림

      // 3초 후 알림 닫기
      setTimeout(() => setNewlyUnlocked(null), 4000);
    } else {
      setUnlockedTests(savedList);
    }
  }, []);

  const isUnlocked = (testId: string) => unlockedTests.includes(testId) || hiddenTests.find(t => t.id === testId)?.unlockCondition();

  // 모두 잠겨있으면 표시 안 함
  const hasAnyVisible = hiddenTests.some(test => isUnlocked(test.id) || !isUnlocked(test.id));

  if (!hasAnyVisible) return null;

  return (
    <>
      {/* 해금 알림 */}
      {newlyUnlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNewlyUnlocked(null)} />
          <div className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-2xl max-w-sm w-full animate-bounce-in">
            <div className="text-center">
              <div className="text-5xl mb-3">🔓</div>
              <h2 className="text-2xl font-black mb-2">테스트 해금!</h2>
              <p className="text-lg font-bold mb-1">
                {hiddenTests.find(t => t.id === newlyUnlocked)?.title}
              </p>
              <p className="text-white/80 text-sm mb-4">
                조건을 달성해서 새 테스트가 열렸어요!
              </p>
              <button
                onClick={() => setNewlyUnlocked(null)}
                className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 숨겨진 테스트 섹션 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-yellow-500 to-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">히든 테스트</h2>
          <span className="text-sm text-gray-400">조건 달성 시 해금</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hiddenTests.map((test) => {
            const unlocked = isUnlocked(test.id);

            if (unlocked) {
              // 해금된 테스트
              return (
                <Link
                  key={test.id}
                  to={test.path}
                  className={`group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${test.gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                    NEW
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{test.emoji}</span>
                    <div>
                      <h3 className="font-bold">{test.title}</h3>
                      <p className="text-sm text-white/80">{test.description}</p>
                    </div>
                  </div>
                </Link>
              );
            } else {
              // 잠긴 테스트
              return (
                <div
                  key={test.id}
                  className="relative overflow-hidden rounded-2xl p-5 bg-gray-100 border-2 border-dashed border-gray-300"
                >
                  <div className="flex items-center gap-3 opacity-50">
                    <span className="text-3xl grayscale">🔒</span>
                    <div>
                      <h3 className="font-bold text-gray-600">???</h3>
                      <p className="text-sm text-gray-500">{test.hint}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="text-xs text-gray-400">{test.conditionText}</span>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
