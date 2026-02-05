// 회식 생존 테스트
import { useState, useCallback, useMemo } from 'react';
import { SEO, Button, ShareButtons, Recommendations } from '../../components';

interface Question {
  question: string;
  options: { text: string; score: number; type: string }[];
}

const questions: Question[] = [
  {
    question: '회식 공지가 떴다! 첫 반응은?',
    options: [
      { text: '오 맛집이면 좋겠다!', score: 3, type: 'active' },
      { text: '아... 집 가고 싶은데...', score: 0, type: 'avoid' },
      { text: '일단 분위기 보고 결정', score: 2, type: 'neutral' },
      { text: '핑계거리 찾기 시작', score: 1, type: 'avoid' },
    ],
  },
  {
    question: '회식 장소 도착! 자리는 어디에?',
    options: [
      { text: '당연히 사장님/팀장님 옆', score: 3, type: 'active' },
      { text: '최대한 멀리, 구석으로', score: 0, type: 'avoid' },
      { text: '친한 동료 옆에 착석', score: 2, type: 'neutral' },
      { text: '화장실 가까운 탈출구 근처', score: 1, type: 'escape' },
    ],
  },
  {
    question: '상사가 "한 잔 받아~" 할 때?',
    options: [
      { text: '감사합니다! (원샷)', score: 3, type: 'active' },
      { text: '저 오늘 약 먹어서요...', score: 1, type: 'avoid' },
      { text: '조금만 따라주세요~', score: 2, type: 'neutral' },
      { text: '이미 취한 척 연기 시작', score: 0, type: 'escape' },
    ],
  },
  {
    question: '갑자기 노래방 가자는 제안이!',
    options: [
      { text: '좋아요! 제가 첫 곡!', score: 3, type: 'active' },
      { text: '(숨죽이며 투명인간 모드)', score: 0, type: 'avoid' },
      { text: '한두 곡은 뭐...', score: 2, type: 'neutral' },
      { text: '막차 시간 핑계 준비', score: 1, type: 'escape' },
    ],
  },
  {
    question: '꼰대 상사의 무한 반복 무용담이 시작됐다!',
    options: [
      { text: '열심히 리액션 (와~ 대단하세요~)', score: 3, type: 'active' },
      { text: '화장실 다녀오겠습니다', score: 1, type: 'escape' },
      { text: '적당히 듣는 척하며 폰 확인', score: 2, type: 'neutral' },
      { text: '눈 마주침 피하고 조용히 음식에 집중', score: 0, type: 'avoid' },
    ],
  },
  {
    question: '2차 가자는 분위기가 형성되고 있다!',
    options: [
      { text: '저요! 어디로 가요?', score: 3, type: 'active' },
      { text: '죄송합니다 내일 일찍...', score: 0, type: 'avoid' },
      { text: '(눈치 보며 흐름에 맡김)', score: 2, type: 'neutral' },
      { text: '슬금슬금 조용히 이탈', score: 1, type: 'escape' },
    ],
  },
  {
    question: '회식 대화 주제로 선호하는 것은?',
    options: [
      { text: '회사 비전과 목표!', score: 3, type: 'active' },
      { text: '그냥 조용히 먹고 싶어요', score: 0, type: 'avoid' },
      { text: '맛집, 여행 같은 가벼운 주제', score: 2, type: 'neutral' },
      { text: '아무거나 듣고만 있을게요', score: 1, type: 'neutral' },
    ],
  },
  {
    question: '술자리에서 갑자기 내 얘기가 나왔다!',
    options: [
      { text: '(신나서 자기 PR 시작)', score: 3, type: 'active' },
      { text: '(얼굴 빨개지며) 아 그런 거 아니에요...', score: 0, type: 'avoid' },
      { text: '적당히 맞장구 치며 넘김', score: 2, type: 'neutral' },
      { text: '화제를 다른 사람에게 넘김', score: 1, type: 'escape' },
    ],
  },
];

interface Result {
  range: [number, number];
  title: string;
  emoji: string;
  description: string;
  skills: string[];
  weakness: string;
  tip: string;
  color: string;
}

const results: Result[] = [
  {
    range: [0, 6],
    title: '회식 탈출의 달인',
    emoji: '🏃💨',
    description: '회식? 그게 뭐죠? 당신은 타고난 탈출 전문가! 회식 알림이 뜨면 이미 핑계를 3개쯤 준비해둔 상태.',
    skills: ['투명인간 스킬 MAX', '자연스러운 이탈 기술', '핑계 생성 능력'],
    weakness: '가끔은 참석해야 할 때도...',
    tip: '가끔은 얼굴 도장이라도 찍어두세요. 존재감은 필요합니다!',
    color: 'from-slate-600 to-gray-700',
  },
  {
    range: [7, 12],
    title: '눈치 백단 서바이버',
    emoji: '👀',
    description: '필요할 때만 나타나고 위기를 감지하면 바로 사라지는 생존 전문가. 적당한 처세술의 소유자!',
    skills: ['상황 판단력', '적절한 이탈 타이밍', '애매한 대답의 기술'],
    weakness: '너무 눈치만 보다가 기회를 놓칠 수도',
    tip: '가끔은 적극적으로 나서는 것도 좋아요!',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    range: [13, 18],
    title: '무난한 참석자',
    emoji: '😌',
    description: '회식에서 크게 튀지도, 숨지도 않는 밸런스형. 적당히 즐기고 적당히 피하는 현명한 직장인!',
    skills: ['적당한 리액션', '분위기 파악력', '적절한 음주량 조절'],
    weakness: '특별한 인상을 남기기 어려울 수도',
    tip: '이 밸런스 그대로 유지하세요! 최고의 생존 전략이에요.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    range: [19, 24],
    title: '회식 분위기 메이커',
    emoji: '🎉',
    description: '회식의 꽃! 당신이 있으면 분위기가 살고, 없으면 뭔가 허전한 그런 존재. 인싸력 MAX!',
    skills: ['분위기 띄우기', '사회성 만렙', '술자리 장악력'],
    weakness: '가끔 너무 열심히 해서 피곤할 수도',
    tip: '몸 관리 잘 하세요! 건강이 최고입니다.',
    color: 'from-amber-500 to-orange-600',
  },
];

export function HoesikTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = useCallback((score: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newAnswers = [...answers, score];

    setTimeout(() => {
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const totalScore = newAnswers.reduce((a, b) => a + b, 0);
        const matchedResult = results.find(
          r => totalScore >= r.range[0] && totalScore <= r.range[1]
        ) || results[results.length - 1];
        setResult(matchedResult);
      }
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, answers, currentQuestion]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const progress = useMemo(() =>
    ((currentQuestion + 1) / questions.length) * 100,
    [currentQuestion]
  );

  const totalScore = useMemo(() =>
    answers.reduce((a, b) => a + b, 0),
    [answers]
  );

  return (
    <>
      <SEO
        title="회식 생존 테스트"
        description="당신의 회식 생존력은? 8개의 질문으로 알아보는 나의 회식 스타일!"
        keywords="회식테스트,직장인테스트,회식생존,술자리테스트,회식유형"
      />

      <div className="space-y-6">
        {!result ? (
          <>
            {/* 헤더 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">🍻</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">회식 생존 테스트</h1>
              <p className="text-gray-500 text-sm">나의 회식 생존력은 몇 점?</p>
            </div>

            {/* 프로그레스 */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Q{currentQuestion + 1}</span>
                <span>{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
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
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (() => {
          const maxScore = questions.length * 3;
          const scorePercent = Math.round((totalScore / maxScore) * 100);

          return (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 카드 - 이미지 캡처용 */}
            <div
              id="hoesik-result"
              className={`relative overflow-hidden bg-gradient-to-br ${result.color} rounded-3xl p-6 text-white shadow-2xl`}
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/4 left-6 w-3 h-3 bg-white/30 rounded-full" />
              <div className="absolute top-1/3 right-10 w-2 h-2 bg-white/40 rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-white/20 rounded-full" />
              <div className="absolute top-8 left-1/4 text-white/20 text-2xl">🍻</div>
              <div className="absolute bottom-16 right-6 text-white/20 text-xl">🎤</div>

              <div className="relative text-center space-y-4">
                {/* 유형 뱃지 */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                  <span className="text-white/80 text-sm font-medium">회식 유형</span>
                </div>

                {/* 메인 이모지 */}
                <div className="text-6xl drop-shadow-lg">{result.emoji}</div>

                {/* 타이틀 */}
                <h2 className="text-3xl font-black drop-shadow-md">{result.title}</h2>
                <p className="text-white/90 text-sm px-4">{result.description}</p>

                {/* 회식력 점수 */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mx-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/70">회식 생존력</span>
                    <span className="text-2xl font-black">{scorePercent}%</span>
                  </div>
                  <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>

                {/* 보유 스킬 */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {result.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* 워터마크 */}
                <p className="text-xs text-white/40 pt-2">viral-site-opal.vercel.app</p>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              {/* 약점 */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-red-800 text-sm">
                  <span className="font-bold">⚠️ 약점:</span> {result.weakness}
                </p>
              </div>

              {/* 팁 */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-green-800 text-sm">
                  <span className="font-bold">💡 TIP:</span> {result.tip}
                </p>
              </div>
            </div>

            {/* 공유 */}
            <ShareButtons
              title="회식 생존 테스트"
              description={`나의 회식 유형: ${result.title} ${result.emoji}`}
              captureElementId="hoesik-result"
              captureFileName="hoesik-result"
            />

            <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>

            <Recommendations currentPath="/hoesik-test" />
          </div>
        );
        })()}
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
