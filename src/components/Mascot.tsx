// 월급루팡 마스코트 - 퇴사 꿈꾸는 햄스터
import { useState, useEffect } from 'react';

export type MascotMood = 'normal' | 'happy' | 'sad' | 'shocked' | 'thinking' | 'tired' | 'excited' | 'dead';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const sizeClasses = {
  sm: 'text-3xl',
  md: 'text-4xl',
  lg: 'text-5xl',
};

// 표정별 이모지 (햄스터/동물 느낌)
const moodEmojis: Record<MascotMood, string> = {
  normal: '🐹',
  happy: '🐹✨',
  sad: '😿',
  shocked: '🙀',
  thinking: '🐹💭',
  tired: '😵‍💫',
  excited: '🐹🔥',
  dead: '💀',
};

export function Mascot({ mood = 'normal', message, size = 'md', animate = true }: MascotProps) {
  return (
    <div className="flex items-start gap-3">
      {/* 캐릭터 */}
      <div className={`relative flex-shrink-0 ${animate ? 'animate-wiggle' : ''}`}>
        <div className="relative">
          {/* 메인 이모지 */}
          <span className={`${sizeClasses[size]} filter drop-shadow-md`}>
            {moodEmojis[mood]}
          </span>

          {/* 넥타이 (직장인 느낌) */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs">👔</span>
        </div>
      </div>

      {/* 말풍선 */}
      {message && (
        <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-yellow-200 max-w-xs">
          <p className="text-gray-800 text-sm leading-relaxed font-medium">
            {message}
          </p>
          {/* 말풍선 꼬리 */}
          <div className="absolute left-0 top-3 -translate-x-1/2 w-3 h-3 bg-yellow-50 border-l border-b border-yellow-200 rotate-45" />
        </div>
      )}

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// 타이핑 효과가 있는 마스코트
export function MascotWithTyping({ mood = 'normal', message, size = 'md' }: MascotProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!message) return;

    setDisplayedMessage('');
    setIsTyping(true);

    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedMessage(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [message]);

  return (
    <Mascot
      mood={mood}
      message={displayedMessage + (isTyping ? '|' : '')}
      size={size}
      animate={!isTyping}
    />
  );
}

// 랜덤 인사말 - 어이없는 버전
const greetings = [
  { mood: 'tired' as MascotMood, message: '아 또 월요일이야...? 아 아니구나 ㅋㅋ' },
  { mood: 'dead' as MascotMood, message: '출근하셨군요... 저도요... (먼산)' },
  { mood: 'thinking' as MascotMood, message: '오늘 로또 당첨되면 바로 퇴사각' },
  { mood: 'normal' as MascotMood, message: '어서오세요~ 저는 5년차 월급루팡입니다 ㅎ' },
  { mood: 'excited' as MascotMood, message: '반가워요! 연봉 계산하러 왔죠? ㅋㅋ 다 알아' },
  { mood: 'sad' as MascotMood, message: '퇴사하고 싶다... 아 손님 오셨네 안녕하세요~' },
  { mood: 'happy' as MascotMood, message: '오 손님이다! 오늘 첫 손님...은 아니고 ㅎ' },
];

export function MascotGreeting() {
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  return <MascotWithTyping mood={greeting.mood} message={greeting.message} size="md" />;
}

// 결과에 따른 코멘트 - 어이없는 현실 공감 버전
export const mascotComments = {
  salary: {
    high: [
      { mood: 'shocked' as MascotMood, message: '헐... 사장님이세요? 저 월급 좀 올려주세요 ㅠㅠ' },
      { mood: 'dead' as MascotMood, message: '세상에... 저 연봉의 3배네요 (현타)' },
      { mood: 'excited' as MascotMood, message: 'ㅋㅋㅋㅋ 부럽다 진심으로... 이직 어케 하셨어요?' },
      { mood: 'happy' as MascotMood, message: '와 대박 ㅋㅋ 오늘 점심은 제가... 아니 님이 쏘세요' },
    ],
    medium: [
      { mood: 'normal' as MascotMood, message: '오 평균이시네요! 근데 세금 보니까 좀 억울하죠? ㅋㅋ' },
      { mood: 'thinking' as MascotMood, message: '음... 이 정도면 치킨은 시켜먹을 수 있겠네요 (진지)' },
      { mood: 'tired' as MascotMood, message: '세금 떼니까 진짜 현타오죠? 저도요... ㅎ' },
      { mood: 'normal' as MascotMood, message: '나쁘지 않아요! 근데 집값 보면 눈물나죠 알아요 ㅋㅋ' },
    ],
    low: [
      { mood: 'sad' as MascotMood, message: '힘내세요... 저도 처음엔 그랬어요 (지금도 그럼)' },
      { mood: 'dead' as MascotMood, message: '아... 이력서 같이 쓸래요? ㅋㅋㅋ (진지 70%)' },
      { mood: 'thinking' as MascotMood, message: '음... 투잡 생각해보신 적 있으세요? (귓속말)' },
      { mood: 'tired' as MascotMood, message: '세금 떼고 나면 진짜 뭐가 남죠? ㅋㅋㅋ 눈물' },
    ],
  },
  retirement: {
    high: [
      { mood: 'shocked' as MascotMood, message: '헐 이 정도면 퇴사 가능하신 거 아니에요?! 부럽...' },
      { mood: 'excited' as MascotMood, message: 'ㅋㅋㅋ 오래 버티셨네요 존경합니다 진심' },
      { mood: 'happy' as MascotMood, message: '와 대박 ㅋㅋ 저도 이만큼 모으려면 몇 년 더 버텨야...' },
    ],
    medium: [
      { mood: 'normal' as MascotMood, message: '오 나쁘지 않네요! 근데 좀만 더 버티면 더 받아요 (악마의 속삭임)' },
      { mood: 'thinking' as MascotMood, message: '음... 1년만 더 다니면... 아 근데 멘탈이 버틸까? ㅋㅋ' },
      { mood: 'tired' as MascotMood, message: '이 정도면 6개월은 쉴 수 있겠네요 (희망회로)' },
    ],
    low: [
      { mood: 'sad' as MascotMood, message: '아직은... 조금만 더 버텨요 우리... (동료애)' },
      { mood: 'dead' as MascotMood, message: '퇴사는 다음 기회에... 화이팅... (먼산)' },
      { mood: 'thinking' as MascotMood, message: '음... 그래도 없는 것보단 낫죠? ㅎㅎ... 하핫...' },
    ],
  },
  quiz: {
    start: [
      { mood: 'excited' as MascotMood, message: '오 테스트 하러 왔어요? ㅋㅋ 솔직하게 답하세요 아시죠?' },
      { mood: 'happy' as MascotMood, message: '재밌을 거예요! 저도 해봤는데 결과 보고 현타왔어요 ㅋㅋ' },
    ],
    end: [
      { mood: 'excited' as MascotMood, message: '오 결과 나왔다! 어때요 찔리죠? ㅋㅋㅋ' },
      { mood: 'happy' as MascotMood, message: '친구한테 공유해서 비교해봐요! 싸우지만 말고 ㅋㅋ' },
      { mood: 'thinking' as MascotMood, message: '음... 맞아요? 아니면 말고~ 재미로 봐요 ㅎㅎ' },
      { mood: 'normal' as MascotMood, message: '결과 캡쳐해서 단톡방에 올려봐요 반응 개꿀잼 ㅋㅋ' },
    ],
  },
  battleship: {
    win: [
      { mood: 'excited' as MascotMood, message: '우와 이기셨어요?! 해군 출신이세요? ㅋㅋㅋ' },
      { mood: 'happy' as MascotMood, message: '축하해요!! 한 판 더? 지면 치킨 내기 ㄱㄱ' },
    ],
    lose: [
      { mood: 'sad' as MascotMood, message: '아쉽... 근데 이건 운이에요 운! (위로)' },
      { mood: 'dead' as MascotMood, message: '지셨군요... 복수전 하세요 복수전! ㅋㅋ' },
    ],
    attack: {
      hit: { mood: 'excited' as MascotMood, message: '오 명중!! ㅋㅋㅋ 좋았어!' },
      miss: { mood: 'thinking' as MascotMood, message: '에잇 빗나갔네~ 다음엔 맞출 듯!' },
      sunk: { mood: 'happy' as MascotMood, message: '침몰!! 개이득 ㅋㅋㅋ' },
    },
  },
};

// 랜덤 코멘트 선택
export function getRandomComment(comments: { mood: MascotMood; message: string }[]) {
  return comments[Math.floor(Math.random() * comments.length)];
}
