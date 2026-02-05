import { useState } from 'react';
import { SEO } from '../../components/SEO';
import { ShareButtons } from '../../components/ShareButtons';
import { Recommendations } from '../../components/Recommendations';

interface Question {
  id: number;
  question: string;
  options: { text: string; scores: { aggressive: number; stable: number; balanced: number; conservative: number } }[];
}

interface ResultType {
  type: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  portfolio: { name: string; ratio: number; color: string }[];
  advice: string[];
  color: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: '1000만원이 생겼습니다. 어떻게 하시겠어요?',
    options: [
      { text: '전액 주식/코인에 투자', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '절반은 주식, 절반은 예금', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '대부분 예금, 일부만 투자', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '전액 안전한 예금에 보관', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 2,
    question: '투자한 주식이 -30% 손실 중입니다.',
    options: [
      { text: '추가 매수하며 물타기', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '상황을 지켜보며 홀딩', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '손절하고 안전자산으로 이동', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '잠을 못 잘 정도로 스트레스', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 3,
    question: '"이 종목 10배 간다"는 정보를 들었습니다.',
    options: [
      { text: '바로 올인! 기회는 포착해야지', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '일부만 투자해보기', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '좀 더 분석해보고 결정', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '루머는 믿지 않아요', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 4,
    question: '목표 수익률은 얼마인가요?',
    options: [
      { text: '연 50% 이상 (대박 아니면 쪽박)', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '연 15~30% (시장 수익률 이상)', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '연 5~10% (안정적인 수익)', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '물가상승률만 커버하면 OK', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 5,
    question: '투자 결정은 주로 어떻게 하시나요?',
    options: [
      { text: '차트, 감으로 빠르게 결정', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '기업 분석 후 신중하게', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '전문가 의견 참고', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '은행/증권사 추천 상품 위주', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 6,
    question: '투자 기간은 보통 얼마나 생각하시나요?',
    options: [
      { text: '단기 (1주일~1개월)', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '중기 (6개월~1년)', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '장기 (3년~5년)', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '초장기 (10년 이상)', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 7,
    question: '레버리지 ETF나 옵션에 대해 어떻게 생각하시나요?',
    options: [
      { text: '수익 극대화의 필수 도구!', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '가끔 활용할 수 있음', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '위험해서 안 함', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '그게 뭔지 잘 모름', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
  {
    id: 8,
    question: '투자 실패 경험이 있다면?',
    options: [
      { text: '수업료라고 생각하고 더 공격적으로', scores: { aggressive: 3, stable: 0, balanced: 0, conservative: 0 } },
      { text: '원인 분석 후 전략 수정', scores: { aggressive: 0, stable: 0, balanced: 3, conservative: 0 } },
      { text: '더 안전한 투자로 전환', scores: { aggressive: 0, stable: 3, balanced: 0, conservative: 0 } },
      { text: '투자가 무서워졌음', scores: { aggressive: 0, stable: 0, balanced: 0, conservative: 3 } },
    ],
  },
];

const results: Record<string, ResultType> = {
  aggressive: {
    type: 'aggressive',
    emoji: '🚀',
    title: '공격형 투자자',
    subtitle: '하이 리스크, 하이 리턴!',
    description: '높은 수익을 위해 과감하게 투자하는 타입입니다. 변동성 있는 자산에 투자하며, 단기간에 큰 수익을 노립니다.',
    portfolio: [
      { name: '성장주/테마주', ratio: 50, color: 'bg-red-500' },
      { name: '코인/파생상품', ratio: 30, color: 'bg-orange-500' },
      { name: '해외주식', ratio: 15, color: 'bg-amber-500' },
      { name: '현금', ratio: 5, color: 'bg-gray-400' },
    ],
    advice: [
      '손절 라인을 미리 정해두세요',
      '전체 자산의 일부만 공격적으로 투자하세요',
      '분산 투자로 리스크를 관리하세요',
    ],
    color: 'from-red-500 to-orange-600',
  },
  balanced: {
    type: 'balanced',
    emoji: '⚖️',
    title: '균형형 투자자',
    subtitle: '위험과 안정 사이의 균형',
    description: '적절한 위험을 감수하며 균형 잡힌 포트폴리오를 추구합니다. 꾸준한 수익과 안정성을 동시에 노립니다.',
    portfolio: [
      { name: '우량주/ETF', ratio: 40, color: 'bg-blue-500' },
      { name: '채권/채권형 펀드', ratio: 25, color: 'bg-green-500' },
      { name: '예금/적금', ratio: 20, color: 'bg-emerald-500' },
      { name: '대체투자', ratio: 15, color: 'bg-purple-500' },
    ],
    advice: [
      '정기적으로 리밸런싱하세요',
      '시장 상황에 따라 비중을 조절하세요',
      '장기 투자 관점을 유지하세요',
    ],
    color: 'from-blue-500 to-indigo-600',
  },
  stable: {
    type: 'stable',
    emoji: '🛡️',
    title: '안정형 투자자',
    subtitle: '꾸준하고 안전하게',
    description: '원금 보존을 중시하며 안정적인 수익을 추구합니다. 장기적인 관점에서 꾸준히 자산을 키워갑니다.',
    portfolio: [
      { name: '배당주/우량주', ratio: 30, color: 'bg-green-500' },
      { name: '채권', ratio: 30, color: 'bg-teal-500' },
      { name: '예금/적금', ratio: 30, color: 'bg-emerald-500' },
      { name: '현금', ratio: 10, color: 'bg-gray-400' },
    ],
    advice: [
      '인플레이션에 대비한 투자도 고려하세요',
      '배당주로 꾸준한 현금흐름을 만드세요',
      '너무 보수적이면 기회비용이 발생할 수 있어요',
    ],
    color: 'from-green-500 to-teal-600',
  },
  conservative: {
    type: 'conservative',
    emoji: '🏦',
    title: '보수형 투자자',
    subtitle: '안전이 최우선!',
    description: '원금 손실을 극도로 회피하며, 확실한 이자 수익을 선호합니다. 투자보다는 저축에 가깝습니다.',
    portfolio: [
      { name: '예금/적금', ratio: 50, color: 'bg-emerald-500' },
      { name: '국채/채권', ratio: 30, color: 'bg-blue-500' },
      { name: '현금', ratio: 15, color: 'bg-gray-400' },
      { name: '금/안전자산', ratio: 5, color: 'bg-yellow-500' },
    ],
    advice: [
      '물가상승률을 고려해 일부 투자를 시작해보세요',
      '비과세 상품을 적극 활용하세요',
      '투자 공부를 하면 마음이 편해질 수 있어요',
    ],
    color: 'from-emerald-500 to-green-600',
  },
};

export default function InvestTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ aggressive: 0, stable: 0, balanced: 0, conservative: 0 });
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option: Question['options'][0]) => {
    const newScores = {
      aggressive: scores.aggressive + option.scores.aggressive,
      stable: scores.stable + option.scores.stable,
      balanced: scores.balanced + option.scores.balanced,
      conservative: scores.conservative + option.scores.conservative,
    };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = (): ResultType => {
    const maxScore = Math.max(scores.aggressive, scores.stable, scores.balanced, scores.conservative);
    if (scores.aggressive === maxScore) return results.aggressive;
    if (scores.balanced === maxScore) return results.balanced;
    if (scores.stable === maxScore) return results.stable;
    return results.conservative;
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScores({ aggressive: 0, stable: 0, balanced: 0, conservative: 0 });
    setShowResult(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const result = getResult();

  return (
    <>
      <SEO
        title="투자 성향 테스트"
        description="나의 투자 성향은? 공격형, 균형형, 안정형, 보수형 중 나에게 맞는 투자 스타일을 알아보세요."
        keywords="투자 성향 테스트, 투자 스타일, 투자 성격, 포트폴리오, 주식 투자 성향"
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            투자 성향 테스트
          </h1>
          <p className="text-gray-500">
            나에게 맞는 투자 스타일을 알아보세요
          </p>
        </div>

        {!showResult ? (
          /* 질문 */
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {/* 프로그레스 바 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>질문 {currentQuestion + 1} / {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 질문 */}
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {questions[currentQuestion].question}
            </h2>

            {/* 선택지 */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-violet-50 border-2 border-gray-200 hover:border-violet-400 rounded-xl transition-all active:scale-[0.98]"
                >
                  <span className="text-gray-800 font-medium">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 결과 */
          <div className="space-y-4 animate-fadeIn">
            {/* 결과 카드 */}
            <div id="invest-result" className={`bg-gradient-to-br ${result.color} rounded-2xl p-6 text-white shadow-xl`}>
              <div className="text-center">
                <span className="text-6xl mb-4 block">{result.emoji}</span>
                <h2 className="text-3xl font-bold mb-2">{result.title}</h2>
                <p className="text-white/80 text-lg mb-4">{result.subtitle}</p>
                <p className="text-white/90 text-sm leading-relaxed">
                  {result.description}
                </p>
              </div>
            </div>

            {/* 추천 포트폴리오 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">💼</span>
                추천 포트폴리오
              </h3>

              <div className="space-y-3">
                {result.portfolio.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`} />
                    <span className="flex-1 text-gray-700">{item.name}</span>
                    <span className="font-bold text-gray-900">{item.ratio}%</span>
                  </div>
                ))}
              </div>

              {/* 포트폴리오 바 */}
              <div className="mt-4 h-4 rounded-full overflow-hidden flex">
                {result.portfolio.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.color} h-full`}
                    style={{ width: `${item.ratio}%` }}
                  />
                ))}
              </div>
            </div>

            {/* 투자 조언 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">💡</span>
                투자 조언
              </h3>
              <ul className="space-y-3">
                {result.advice.map((advice, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-violet-500 mt-1">•</span>
                    <span className="text-gray-700">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">결과 공유하기</h3>
              <ShareButtons
                title={`나의 투자 성향: ${result.title}`}
                description={result.subtitle}
                captureElementId="invest-result"
                captureFileName="invest-test-result"
              />
            </div>

            {/* 다시하기 */}
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
              다시 테스트하기
            </button>
          </div>
        )}

        {/* 추천 */}
        {showResult && <Recommendations currentPath="/invest-test" maxItems={3} />}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
