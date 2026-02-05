import { useState } from 'react';
import { SEO, Button, ShareButtons } from '../../components';
import { mbtiQuestions, calculateMbti, getMbtiResult } from './mbtiData';
import type { WorkMbtiType } from './mbtiData';

type QuizState = 'intro' | 'quiz' | 'result';

export function WorkMbti() {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<WorkMbtiType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;

  const handleStart = () => {
    setState('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnimating) return;

    setSelectedOption(optionIndex);
    setIsAnimating(true);

    const question = mbtiQuestions[currentQuestion];
    const selectedType = question.options[optionIndex].type;

    setTimeout(() => {
      const newAnswers = [...answers, selectedType];
      setAnswers(newAnswers);

      if (currentQuestion < mbtiQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        const mbtiType = calculateMbti(newAnswers);
        const mbtiResult = getMbtiResult(mbtiType);
        setResult(mbtiResult);
        setState('result');
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleRestart = () => {
    setState('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSelectedOption(null);
  };

  const question = mbtiQuestions[currentQuestion];

  return (
    <>
      <SEO
        title="직장인 MBTI 테스트"
        description="회사에서 나는 어떤 유형? 12가지 질문으로 알아보는 직장인 성격 유형 테스트!"
        keywords="직장인MBTI,회사MBTI,직장성격테스트,업무스타일"
      />

      <div className="space-y-6">
        {state === 'intro' && (
          <div className="text-center animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30">
              <span className="text-5xl">💼</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
              직장인 MBTI
            </h1>
            <p className="text-gray-500 mb-8">
              회사에서 나는 어떤 유형?<br />
              업무 스타일로 알아보는 성격 유형!
            </p>

            <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-around text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="text-gray-500">직장 상황</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-gray-500">2분</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-gray-500">16가지 유형</div>
                </div>
              </div>
            </div>

            <Button onClick={handleStart} size="lg" className="w-full max-w-xs">
              테스트 시작하기
            </Button>
          </div>
        )}

        {state === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 프로그레스 바 */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Q{currentQuestion + 1}</span>
                <span>{currentQuestion + 1} / {mbtiQuestions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 질문 카드 */}
            <div
              className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {question.situation && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                  <p className="text-white font-medium">{question.situation}</p>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={isAnimating}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-orange-500 bg-orange-50 scale-[0.98]'
                          : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                      } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
                    >
                      <span className="text-gray-700 leading-relaxed text-lg">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {state === 'result' && result && (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 헤더 */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${result.color} rounded-3xl flex items-center justify-center shadow-xl`}>
                <span className="text-5xl">{result.emoji}</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">당신의 직장인 MBTI는</p>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
                {result.type}
              </h1>
              <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
                {result.name}
              </p>
              <p className="text-gray-600">{result.title}</p>
            </div>

            {/* 설명 카드 */}
            <div className={`bg-gradient-to-br ${result.color} rounded-3xl p-6 text-white shadow-xl`}>
              <p className="text-lg leading-relaxed">{result.description}</p>
            </div>

            {/* 강점 & 성장 포인트 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">💪</span> 강점
              </h3>
              <ul className="space-y-2 mb-6">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-600">{strength}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> 성장 포인트
              </h3>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span className="text-gray-600">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 팀워크 팁 */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100">
              <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <span className="text-xl">🤝</span> 팀워크 TIP
              </h3>
              <p className="text-indigo-700 leading-relaxed">{result.teamTip}</p>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                친구에게 공유하기
              </h3>
              <ShareButtons
                title="직장인 MBTI 테스트"
                description={`나의 직장인 MBTI는 ${result.type} - ${result.name}!`}
              />
            </div>

            <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>
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
