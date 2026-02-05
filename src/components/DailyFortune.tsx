// 오늘의 직장인 운세
import { useState, useEffect } from 'react';

interface Fortune {
  emoji: string;
  title: string;
  message: string;
  tip: string;
  luck: number; // 1-5
}

const fortunes: Fortune[] = [
  { emoji: '🌟', title: '대박 운세', message: '오늘 로또 사도 될 듯? 농담이고 월급은 안 오름', tip: '점심에 국밥 먹으면 좋은 일 생김', luck: 5 },
  { emoji: '☀️', title: '좋은 하루', message: '오늘은 상사가 일찍 퇴근할 것 같은 기운', tip: '커피 한 잔의 여유를 가져보세요', luck: 4 },
  { emoji: '🌤️', title: '무난한 하루', message: '특별한 일 없이 무탈하게 흘러갈 예정', tip: '오늘 회의는 존버가 답', luck: 3 },
  { emoji: '🌥️', title: '조심하세요', message: '메일함에 뭔가 안 좋은 게 기다리고 있을지도', tip: '갑자기 부르면 일단 화장실 간다고 하세요', luck: 2 },
  { emoji: '🌧️', title: '힘든 하루', message: '야근 확률 87%... 버텨요 동지', tip: '퇴근 후 치킨으로 보상하세요', luck: 1 },
  { emoji: '🔥', title: '불타는 의지', message: '오늘 일 엄청 잘 될 것 같은 느낌!', tip: '이 기운으로 밀린 업무 처리 ㄱㄱ', luck: 5 },
  { emoji: '💤', title: '졸린 하루', message: '점심 먹고 졸음과의 전쟁 예상', tip: '아아 샷 추가 필수', luck: 2 },
  { emoji: '💼', title: '업무 운 상승', message: '오늘 보고서 잘 될 거예요 아마도', tip: '저장 자주 하세요 (진심)', luck: 4 },
  { emoji: '🎯', title: '집중력 상승', message: '존 쉬운 일에 존 집중할 수 있는 날', tip: '이메일 알림 끄고 일하세요', luck: 4 },
  { emoji: '🍀', title: '행운의 하루', message: '연차 승인 확률 상승! 지금이 기회', tip: '상사 기분 좋을 때 슬쩍 내세요', luck: 5 },
  { emoji: '😴', title: '휴식 필요', message: '몸이 쉬고 싶다고 신호를 보내는 중', tip: '점심시간에 10분만 눈 붙이세요', luck: 2 },
  { emoji: '🎉', title: '축하 받을 일', message: '오늘 뭔가 좋은 소식이 올지도?', tip: '핸드폰 충전 100% 유지하세요', luck: 5 },
  { emoji: '📈', title: '성장하는 날', message: '오늘 배우는 게 나중에 쓸모 있을 듯', tip: '새로운 거 하나 배워보세요', luck: 4 },
  { emoji: '🤝', title: '인간관계 운', message: '동료와 좋은 일이 있을 예감', tip: '먼저 말 걸어보세요', luck: 4 },
  { emoji: '⚡', title: '스피드한 날', message: '일이 생각보다 빨리 끝날 수도!', tip: '속도전으로 밀어붙이세요', luck: 4 },
];

// 날짜 기반 시드로 랜덤 선택 (같은 날 같은 결과)
function getDailyFortune(): Fortune {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % fortunes.length;
  return fortunes[index];
}

export function DailyFortune() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFortune(getDailyFortune());
  }, []);

  if (!fortune) return null;

  return (
    <>
      {/* 운세 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{fortune.emoji}</span>
            <div className="text-left">
              <p className="text-xs text-white/70">오늘의 직장인 운세</p>
              <p className="font-bold">{fortune.title}</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < fortune.luck ? 'text-yellow-300' : 'text-white/30'}>
                ★
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* 운세 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl max-w-sm w-full animate-fadeIn">
            {/* 배경 효과 */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative text-center">
              {/* 이모지 */}
              <div className="text-6xl mb-4 animate-bounce">{fortune.emoji}</div>

              {/* 타이틀 */}
              <p className="text-sm text-white/70 mb-1">오늘의 직장인 운세</p>
              <h2 className="text-2xl font-black mb-2">{fortune.title}</h2>

              {/* 별점 */}
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xl ${i < fortune.luck ? 'text-yellow-300' : 'text-white/30'}`}>
                    ★
                  </span>
                ))}
              </div>

              {/* 메시지 */}
              <div className="bg-white/15 backdrop-blur rounded-2xl p-4 mb-4">
                <p className="text-lg leading-relaxed">{fortune.message}</p>
              </div>

              {/* 팁 */}
              <div className="bg-yellow-400/20 rounded-xl p-3 mb-4">
                <p className="text-sm">
                  <span className="font-bold">💡 오늘의 팁:</span> {fortune.tip}
                </p>
              </div>

              {/* 닫기 */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all"
              >
                오늘도 화이팅! 💪
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
