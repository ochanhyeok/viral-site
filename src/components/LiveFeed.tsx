// 실시간 활동 피드 (가짜 실시간 느낌)
import { useState, useEffect } from 'react';

interface FeedItem {
  emoji: string;
  text: string;
  time: string;
}

// 랜덤 피드 생성
const feedTemplates = [
  { emoji: '💰', texts: ['연봉 {salary}만원 계산함', '연봉 실수령액 확인함', '세금 보고 현타 옴'] },
  { emoji: '🏦', texts: ['퇴직금 {amount}만원 나옴', '3년차 퇴직금 계산함', '퇴직금 보고 아직 멀었다 생각함'] },
  { emoji: '💸', texts: ['소비성향 테스트 완료', '플렉스형 결과 나옴', '짠돌이형 판정받음'] },
  { emoji: '👔', texts: ['직장인 MBTI 결과 확인', 'ENFP 결과 나옴', 'ISTJ 판정받음'] },
  { emoji: '🧠', texts: ['스트레스 지수 측정함', '스트레스 80% 나옴 ㄷㄷ', '힐링이 필요하대요'] },
  { emoji: '👴', texts: ['꼰대력 테스트 함', 'MZ세대 판정!', '꼰대 기질 30% 나옴'] },
  { emoji: '🎨', texts: ['색감 테스트 통과', '색 구분 능력 상위 10%', '색맹 아니래요 다행'] },
  { emoji: '⚡', texts: ['반응속도 0.2초 나옴', '반응속도 테스트 완료', '프로게이머급 반사신경!'] },
  { emoji: '🚢', texts: ['배틀쉽 승리!', '배틀쉽 5연승 달성', '배틀쉽에서 침몰당함 ㅋㅋ'] },
];

const salaries = ['3000', '4000', '5000', '6000', '7000', '8000', '9000', '1억'];
const amounts = ['500', '800', '1000', '1500', '2000', '3000', '5000'];
const times = ['방금', '1분 전', '2분 전', '3분 전', '5분 전'];

function generateRandomFeed(): FeedItem {
  const template = feedTemplates[Math.floor(Math.random() * feedTemplates.length)];
  let text = template.texts[Math.floor(Math.random() * template.texts.length)];

  // 변수 치환
  text = text.replace('{salary}', salaries[Math.floor(Math.random() * salaries.length)]);
  text = text.replace('{amount}', amounts[Math.floor(Math.random() * amounts.length)]);

  return {
    emoji: template.emoji,
    text,
    time: times[Math.floor(Math.random() * times.length)],
  };
}

export function LiveFeed() {
  const [feeds, setFeeds] = useState<FeedItem[]>(() =>
    Array.from({ length: 3 }, generateRandomFeed)
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 3-8초마다 새 피드 추가
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setFeeds(prev => {
          const newFeed = generateRandomFeed();
          newFeed.time = '방금';
          return [newFeed, ...prev.slice(0, 2)];
        });
        setIsVisible(true);
      }, 300);
    }, 3000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

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
        {feeds.map((feed, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 text-sm transition-all duration-300 ${
              index === 0 && isVisible ? 'animate-slideIn' : ''
            } ${index === 0 ? 'text-gray-800' : 'text-gray-500'}`}
          >
            <span>{feed.emoji}</span>
            <span className="flex-1 truncate">누군가 {feed.text}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{feed.time}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// 토스트 스타일 실시간 알림
export function LiveToast() {
  const [toast, setToast] = useState<FeedItem | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 5-15초마다 토스트 표시
    const showToast = () => {
      const feed = generateRandomFeed();
      feed.time = '방금';
      setToast(feed);
      setShow(true);

      setTimeout(() => setShow(false), 3000);
    };

    // 처음 3초 후 시작
    const initialTimeout = setTimeout(showToast, 3000);

    const interval = setInterval(showToast, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-72 z-50 transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg">
          {toast.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            누군가 {toast.text}
          </p>
          <p className="text-xs text-gray-400">{toast.time}</p>
        </div>
      </div>
    </div>
  );
}
