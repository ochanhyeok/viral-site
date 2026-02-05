// 번아웃 위험도 테스트
import { useState, useCallback, useMemo } from 'react';
import { SEO, Button, ShareButtons, Recommendations } from '../../components';

interface Question {
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    question: '아침에 눈 떴을 때 "출근하기 싫다"는 생각이 드는 빈도는?',
    options: [
      { text: '거의 없음', score: 0 },
      { text: '가끔 (주 1-2회)', score: 1 },
      { text: '자주 (주 3-4회)', score: 2 },
      { text: '매일', score: 3 },
    ],
  },
  {
    question: '업무 중 집중이 잘 안 되고 멍해지는 경험은?',
    options: [
      { text: '거의 없음', score: 0 },
      { text: '가끔 있음', score: 1 },
      { text: '자주 있음', score: 2 },
      { text: '하루 종일 그런 상태', score: 3 },
    ],
  },
  {
    question: '퇴근 후나 주말에 충분히 쉬어도 피로가 풀리지 않는다면?',
    options: [
      { text: '아니요, 잘 회복됨', score: 0 },
      { text: '가끔 그런 편', score: 1 },
      { text: '대부분 그런 편', score: 2 },
      { text: '쉬어도 전혀 회복 안 됨', score: 3 },
    ],
  },
  {
    question: '업무에 대한 성취감이나 보람을 느끼나요?',
    options: [
      { text: '자주 느낌', score: 0 },
      { text: '가끔 느낌', score: 1 },
      { text: '거의 못 느낌', score: 2 },
      { text: '전혀 못 느끼고 허무함', score: 3 },
    ],
  },
  {
    question: '최근 짜증이 늘거나 감정 조절이 어려워진 적 있나요?',
    options: [
      { text: '아니요', score: 0 },
      { text: '가끔 있음', score: 1 },
      { text: '자주 있음', score: 2 },
      { text: '거의 매일', score: 3 },
    ],
  },
  {
    question: '수면의 질은 어떤가요?',
    options: [
      { text: '잘 자고 개운함', score: 0 },
      { text: '가끔 뒤척임', score: 1 },
      { text: '자주 잠들기 어려움', score: 2 },
      { text: '불면증 or 악몽', score: 3 },
    ],
  },
  {
    question: '일에 대한 냉소적인 생각이 드나요? (어차피 뭘 해도...)',
    options: [
      { text: '아니요', score: 0 },
      { text: '가끔 그런 생각이 듦', score: 1 },
      { text: '자주 그렇게 생각함', score: 2 },
      { text: '항상 그런 상태', score: 3 },
    ],
  },
  {
    question: '두통, 소화불량 등 원인 모를 신체 증상이 있나요?',
    options: [
      { text: '없음', score: 0 },
      { text: '가끔 있음', score: 1 },
      { text: '자주 있음', score: 2 },
      { text: '만성적으로 있음', score: 3 },
    ],
  },
  {
    question: '예전에 좋아하던 취미나 활동에 대한 흥미는?',
    options: [
      { text: '여전히 즐거움', score: 0 },
      { text: '예전보단 덜 즐거움', score: 1 },
      { text: '거의 흥미 없음', score: 2 },
      { text: '아무것도 하기 싫음', score: 3 },
    ],
  },
  {
    question: '현재 업무량에 대해 어떻게 느끼나요?',
    options: [
      { text: '적절함', score: 0 },
      { text: '조금 많은 편', score: 1 },
      { text: '많이 버거움', score: 2 },
      { text: '완전히 과부하', score: 3 },
    ],
  },
];

interface Result {
  range: [number, number];
  level: string;
  title: string;
  emoji: string;
  description: string;
  advice: string[];
  color: string;
}

const results: Result[] = [
  {
    range: [0, 7],
    level: '안전',
    title: '건강한 직장인',
    emoji: '💚',
    description: '현재 번아웃 위험이 낮은 상태입니다. 업무와 삶의 균형을 잘 유지하고 계시네요!',
    advice: [
      '현재 상태를 유지하세요',
      '정기적인 휴식과 취미 활동 지속',
      '동료들과 좋은 관계 유지',
    ],
    color: 'from-green-500 to-emerald-600',
  },
  {
    range: [8, 14],
    level: '주의',
    title: '피로 누적 단계',
    emoji: '💛',
    description: '약간의 피로가 쌓이고 있습니다. 지금부터 관리하면 충분히 회복할 수 있어요.',
    advice: [
      '충분한 수면 시간 확보하기',
      '업무 중 짧은 휴식 취하기',
      '주말에는 완전한 휴식 시간 갖기',
      '가벼운 운동으로 스트레스 해소',
    ],
    color: 'from-yellow-500 to-amber-600',
  },
  {
    range: [15, 21],
    level: '경고',
    title: '번아웃 진행 중',
    emoji: '🧡',
    description: '번아웃이 진행되고 있는 상태입니다. 적극적인 회복 조치가 필요해요.',
    advice: [
      '연차 사용해서 충분히 쉬기',
      '업무량 조절에 대해 상사와 상담',
      '전문 상담 고려해보기',
      '운동, 명상 등 스트레스 관리',
      '퇴근 후 업무 연락 차단',
    ],
    color: 'from-orange-500 to-red-500',
  },
  {
    range: [22, 30],
    level: '위험',
    title: '심각한 번아웃',
    emoji: '❤️‍🔥',
    description: '심각한 번아웃 상태입니다. 당장의 휴식과 전문적인 도움이 필요해요.',
    advice: [
      '즉시 충분한 휴식 취하기',
      '전문 상담사나 정신건강의학과 방문 권장',
      '업무 환경 변화 심각하게 고려',
      '혼자 해결하려 하지 말고 주변에 도움 요청',
      '건강이 최우선입니다',
    ],
    color: 'from-red-500 to-rose-600',
  },
];

export function BurnoutTest() {
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
        title="번아웃 위험도 테스트"
        description="10개의 질문으로 알아보는 나의 번아웃 상태! 직장인 필수 자가진단 테스트"
        keywords="번아웃테스트,번아웃자가진단,직장인번아웃,스트레스테스트,멘탈헬스"
      />

      <div className="space-y-6">
        {!result ? (
          <>
            {/* 헤더 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">🔥</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">번아웃 위험도 테스트</h1>
              <p className="text-gray-500 text-sm">나의 번아웃 상태를 체크해보세요</p>
            </div>

            {/* 프로그레스 */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Q{currentQuestion + 1}</span>
                <span>{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
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
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/50 transition-all active:scale-[0.98]"
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
              <p className="text-white/70 text-sm mb-2">나의 번아웃 위험도</p>
              <div className="text-5xl mb-2">{result.emoji}</div>
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-bold mb-2">
                {result.level}
              </div>
              <h2 className="text-2xl font-bold">{result.title}</h2>
              <p className="text-white/80 text-sm mt-2">총점: {totalScore}/30</p>
            </div>

            {/* 설명 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">{result.description}</p>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span>💡</span> 추천 조치
                </h3>
                <ul className="space-y-2">
                  {result.advice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-800">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-amber-800 text-sm">
                <span className="font-bold">⚠️ 참고:</span> 이 테스트는 자가진단용이며 전문적인 의학 진단을 대체할 수 없습니다.
                심각한 증상이 지속되면 전문가 상담을 권장드립니다.
              </p>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">결과 공유하기</h3>
              <ShareButtons
                title="번아웃 위험도 테스트"
                description={`나의 번아웃 상태: ${result.title} (${result.level})`}
              />
            </div>

            <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>

            <Recommendations currentPath="/burnout-test" />
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
