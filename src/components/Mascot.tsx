// 월급루팡 마스코트 캐릭터
import { useState, useEffect } from 'react';

export type MascotMood = 'normal' | 'happy' | 'sad' | 'shocked' | 'thinking' | 'tired' | 'excited';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

// 표정별 얼굴
const faces: Record<MascotMood, { eyes: string; mouth: string; extra?: string }> = {
  normal: { eyes: '• •', mouth: '‿', extra: '' },
  happy: { eyes: '^ ^', mouth: '▽', extra: '✨' },
  sad: { eyes: '• •', mouth: '︵', extra: '💧' },
  shocked: { eyes: '◉ ◉', mouth: '○', extra: '!' },
  thinking: { eyes: '• •', mouth: '～', extra: '💭' },
  tired: { eyes: '－ －', mouth: '︿', extra: '💤' },
  excited: { eyes: '★ ★', mouth: '▽', extra: '🔥' },
};

const sizeClasses = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-20 h-20 text-base',
};

export function Mascot({ mood = 'normal', message, size = 'md', animate = true }: MascotProps) {
  const face = faces[mood];

  return (
    <div className="flex items-start gap-3">
      {/* 캐릭터 */}
      <div className={`relative flex-shrink-0 ${animate ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }}>
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-amber-400 relative`}>
          {/* 머리카락 */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-gray-800 rounded-t-full" />

          {/* 눈 */}
          <div className="font-mono font-bold text-gray-800 tracking-wider mt-1">
            {face.eyes}
          </div>

          {/* 입 */}
          <div className="font-mono text-gray-800 -mt-1">
            {face.mouth}
          </div>

          {/* 넥타이 */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-blue-500" />
        </div>

        {/* 이모지 효과 */}
        {face.extra && (
          <span className="absolute -top-1 -right-1 text-sm animate-pulse">
            {face.extra}
          </span>
        )}
      </div>

      {/* 말풍선 */}
      {message && (
        <div className="relative bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-100 max-w-xs">
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {message}
          </p>
          {/* 말풍선 꼬리 */}
          <div className="absolute left-0 top-3 -translate-x-1/2 w-3 h-3 bg-white border-l border-b border-gray-100 rotate-45" />
        </div>
      )}
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
    }, 30);

    return () => clearInterval(timer);
  }, [message]);

  return (
    <Mascot
      mood={mood}
      message={displayedMessage + (isTyping ? '▌' : '')}
      size={size}
      animate={!isTyping}
    />
  );
}

// 랜덤 인사말
const greetings = [
  { mood: 'tired' as MascotMood, message: '오늘도 출근했구나... 고생이 많다' },
  { mood: 'normal' as MascotMood, message: '어서와~ 뭐 계산해볼까?' },
  { mood: 'thinking' as MascotMood, message: '오늘은 뭘 도와줄까?' },
  { mood: 'happy' as MascotMood, message: '반가워! 오늘도 파이팅!' },
];

export function MascotGreeting() {
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  return <MascotWithTyping mood={greeting.mood} message={greeting.message} size="md" />;
}

// 결과에 따른 코멘트 생성기
export const mascotComments = {
  salary: {
    high: [
      { mood: 'shocked' as MascotMood, message: '헐... 부럽다 진짜. 나도 이직할까?' },
      { mood: 'excited' as MascotMood, message: '와 대박! 오늘 점심은 네가 쏴라~' },
      { mood: 'happy' as MascotMood, message: '이 정도면 퇴사 안 해도 되겠는데?' },
    ],
    medium: [
      { mood: 'normal' as MascotMood, message: '평균이야 평균! 나쁘지 않아~' },
      { mood: 'thinking' as MascotMood, message: '음... 이직하면 더 받을 수 있을지도?' },
      { mood: 'normal' as MascotMood, message: '세금 떼가는 거 보면 좀 억울하지?' },
    ],
    low: [
      { mood: 'sad' as MascotMood, message: '힘내... 언젠간 좋아질 거야...' },
      { mood: 'tired' as MascotMood, message: '야근은 많이 하지 말고... 건강이 최고야' },
      { mood: 'thinking' as MascotMood, message: '이력서 업데이트 해둘까...?' },
    ],
  },
  retirement: {
    high: [
      { mood: 'excited' as MascotMood, message: '오 꽤 모았네! 이 정도면 퇴사 가능?' },
      { mood: 'happy' as MascotMood, message: '와~ 열심히 일한 보람이 있다!' },
    ],
    medium: [
      { mood: 'normal' as MascotMood, message: '조금만 더 버텨보자... 아자아자!' },
      { mood: 'thinking' as MascotMood, message: '음, 1년만 더 다니면 더 받을 수 있어' },
    ],
    low: [
      { mood: 'sad' as MascotMood, message: '아직은... 좀 더 버텨야 할 듯' },
      { mood: 'tired' as MascotMood, message: '퇴사는 다음 기회에...' },
    ],
  },
  quiz: {
    start: [
      { mood: 'excited' as MascotMood, message: '자, 시작해볼까? 솔직하게 답해!' },
      { mood: 'happy' as MascotMood, message: '재밌을 거야~ 고민하지 말고 바로 골라!' },
    ],
    end: [
      { mood: 'happy' as MascotMood, message: '오~ 결과 나왔다! 어때, 맞아?' },
      { mood: 'excited' as MascotMood, message: '친구한테 공유해서 비교해봐!' },
    ],
  },
  battleship: {
    win: [
      { mood: 'excited' as MascotMood, message: '축하해!! 해군 제독 재질이시네~' },
      { mood: 'happy' as MascotMood, message: '역시 천재! 한 판 더?' },
    ],
    lose: [
      { mood: 'sad' as MascotMood, message: '아쉽다... 복수전 가자!' },
      { mood: 'tired' as MascotMood, message: '운이 없었어... 다시 해보자!' },
    ],
    attack: {
      hit: { mood: 'excited' as MascotMood, message: '명중!! 좋았어!' },
      miss: { mood: 'thinking' as MascotMood, message: '에잇, 빗나갔네~' },
      sunk: { mood: 'happy' as MascotMood, message: '침몰!! 이대로 밀어붙여!' },
    },
  },
};

// 랜덤 코멘트 선택
export function getRandomComment(comments: { mood: MascotMood; message: string }[]) {
  return comments[Math.floor(Math.random() * comments.length)];
}
