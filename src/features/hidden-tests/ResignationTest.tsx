// 진짜 퇴사 확률 테스트
import { useState } from 'react';
import { SEO, Button, ShareButtons, Recommendations } from '../../components';

interface Question {
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    question: '월요일 아침, 알람이 울렸을 때 첫 생각은?',
    options: [
      { text: '오늘도 화이팅!', score: 0 },
      { text: '에휴... 일어나야지', score: 1 },
      { text: '5분만... 아니 10분만...', score: 2 },
      { text: '진지하게 병가 낼까 고민', score: 3 },
    ],
  },
  {
    question: '회사에서 점심 먹을 때 주로 하는 생각은?',
    options: [
      { text: '오후 업무 계획', score: 0 },
      { text: '그냥 밥에 집중', score: 1 },
      { text: '퇴근 시간까지 몇 시간 남았지', score: 2 },
      { text: '이직 사이트 구경', score: 3 },
    ],
  },
  {
    question: '상사가 "잠깐 얘기 좀 하자"고 할 때?',
    options: [
      { text: '무슨 일인지 궁금해함', score: 0 },
      { text: '약간 긴장됨', score: 1 },
      { text: '또 뭐라고 하려고...', score: 2 },
      { text: '퇴사 얘기 꺼내볼까 진지하게 고민', score: 3 },
    ],
  },
  {
    question: '업무 중 갑자기 추가 업무가 들어오면?',
    options: [
      { text: '일단 해봐야지!', score: 0 },
      { text: '음... 일정 조정해야겠다', score: 1 },
      { text: '하... 또야?', score: 2 },
      { text: '이러려고 회사 다니나 싶음', score: 3 },
    ],
  },
  {
    question: '금요일 퇴근할 때 기분은?',
    options: [
      { text: '이번 주도 알찼다!', score: 0 },
      { text: '드디어 주말이다~', score: 1 },
      { text: '살았다... 진짜 살았다...', score: 2 },
      { text: '월요일 생각하면 벌써 우울', score: 3 },
    ],
  },
  {
    question: '회사 동료들과의 관계는?',
    options: [
      { text: '친하고 재밌음', score: 0 },
      { text: '업무적으로는 OK', score: 1 },
      { text: '그냥 그럭저럭', score: 2 },
      { text: '되도록 안 마주치고 싶음', score: 3 },
    ],
  },
  {
    question: '최근 이력서를 업데이트한 게 언제?',
    options: [
      { text: '업데이트할 생각 없음', score: 0 },
      { text: '1년 넘었음', score: 1 },
      { text: '최근 몇 달 내', score: 2 },
      { text: '지난주에 했음', score: 3 },
    ],
  },
  {
    question: '회사 회식 공지가 떴을 때?',
    options: [
      { text: '오 뭐 먹지?', score: 0 },
      { text: '참석은 해야지', score: 1 },
      { text: '빠질 수 있으면 빠지고 싶다', score: 2 },
      { text: '진심으로 싫다', score: 3 },
    ],
  },
];

interface Result {
  range: [number, number];
  title: string;
  probability: string;
  emoji: string;
  description: string;
  advice: string;
  color: string;
}

const results: Result[] = [
  {
    range: [0, 5],
    title: '회사사랑꾼',
    probability: '5%',
    emoji: '💼❤️',
    description: '당신은 진정한 회사사랑꾼! 일이 재밌고 동료도 좋고 모든 게 만족스러운 상태입니다.',
    advice: '이 마음 오래오래 유지하세요. 근데 가끔은 쉬어도 돼요!',
    color: 'from-green-500 to-emerald-600',
  },
  {
    range: [6, 10],
    title: '무난한 직장인',
    probability: '25%',
    emoji: '😌',
    description: '나쁘지 않아요! 큰 불만 없이 회사생활 중. 가끔 힘들지만 버틸만합니다.',
    advice: '스트레스 관리만 잘 하면 오래 다닐 수 있어요!',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    range: [11, 16],
    title: '슬슬 지치는 중',
    probability: '55%',
    emoji: '😮‍💨',
    description: '솔직히 좀 지쳤죠? 퇴사 생각이 스멀스멀 올라오는 단계입니다.',
    advice: '휴가 쓰세요. 진지하게. 리프레시가 필요해요!',
    color: 'from-amber-500 to-orange-600',
  },
  {
    range: [17, 20],
    title: '퇴사 임박',
    probability: '80%',
    emoji: '🚨',
    description: '위험! 퇴사 욕구가 매우 높은 상태. 이력서 업데이트 하고 계시죠?',
    advice: '무리하지 마세요. 건강이 최우선입니다.',
    color: 'from-red-500 to-rose-600',
  },
  {
    range: [21, 24],
    title: '이미 마음은 퇴사',
    probability: '99%',
    emoji: '🏃💨',
    description: '몸만 출근하는 상태... 마음은 이미 퇴사했습니다.',
    advice: '진지하게 다음 스텝을 준비하세요. 화이팅!',
    color: 'from-purple-500 to-pink-600',
  },
];

export function ResignationTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (score: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newAnswers = [...answers, score];

    setTimeout(() => {
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // 결과 계산
        const totalScore = newAnswers.reduce((a, b) => a + b, 0);
        const matchedResult = results.find(
          r => totalScore >= r.range[0] && totalScore <= r.range[1]
        ) || results[results.length - 1];
        setResult(matchedResult);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <SEO
        title="진짜 퇴사 확률 테스트"
        description="당신의 퇴사 확률은 몇 %? 8개의 질문으로 알아보는 나의 퇴사 욕구 지수!"
        keywords="퇴사테스트,퇴사확률,직장인테스트,번아웃테스트"
      />

      <div className="space-y-6">
        {!result ? (
          <>
            {/* 헤더 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">🚪</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">진짜 퇴사 확률 테스트</h1>
              <p className="text-gray-500 text-sm">🔓 히든 테스트</p>
            </div>

            {/* 프로그레스 */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Q{currentQuestion + 1}</span>
                <span>{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 질문 */}
            <div className={`bg-white rounded-3xl p-6 shadow-lg transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-red-300 hover:bg-red-50/50 transition-all active:scale-[0.98]"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 */}
            <div className={`bg-gradient-to-br ${result.color} rounded-3xl p-6 text-white shadow-xl text-center`}>
              <p className="text-white/70 text-sm mb-2">당신의 퇴사 확률</p>
              <div className="text-6xl font-black mb-2">{result.probability}</div>
              <div className="text-3xl mb-2">{result.emoji}</div>
              <h2 className="text-2xl font-bold">{result.title}</h2>
            </div>

            {/* 설명 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">{result.description}</p>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-amber-800">
                  <span className="font-bold">💡 조언:</span> {result.advice}
                </p>
              </div>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">결과 공유하기</h3>
              <ShareButtons
                title="퇴사 확률 테스트"
                description={`나의 퇴사 확률: ${result.probability} - ${result.title}`}
              />
            </div>

            <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>

            <Recommendations currentPath="/resignation-test" />
          </div>
        )}
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
