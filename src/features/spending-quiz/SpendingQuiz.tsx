import { useState } from 'react';
import { SEO, Card, Button, ShareButtons } from '../../components';
import { quizQuestions, calculateResult } from './quizData';
import type { SpendingType } from './quizData';

type QuizState = 'intro' | 'quiz' | 'result';

export function SpendingQuiz() {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SpendingType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

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

    setTimeout(() => {
      const newAnswers = [...answers, optionIndex];
      setAnswers(newAnswers);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        const calculatedResult = calculateResult(newAnswers);
        setResult(calculatedResult);
        setState('result');
      }
      setIsAnimating(false);
    }, 400);
  };

  const handleRestart = () => {
    setState('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setSelectedOption(null);
  };

  const question = quizQuestions[currentQuestion];

  return (
    <>
      <SEO
        title="나의 소비성향 테스트"
        description="당신은 플렉스형? 짠돌이형? 12개의 질문으로 알아보는 나의 진짜 소비 유형!"
        keywords="소비성향테스트,소비유형,소비습관,심리테스트"
      />

      <div className="space-y-6">
        {state === 'intro' && (
          <div className="text-center">
            <div className="text-6xl mb-6">💸</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              나의 소비성향 테스트
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              당신은 어떤 유형의 소비자일까요?<br />
              12개의 상황으로 알아보는 진짜 내 소비 스타일!
            </p>

            <Card className="mb-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="text-gray-700">현실적인 상황 기반 질문</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-gray-700">약 2-3분 소요</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <span className="text-gray-700">6가지 소비 유형 분석</span>
                </div>
              </div>
            </Card>

            <Button onClick={handleStart} size="lg" className="px-12">
              테스트 시작하기
            </Button>
          </div>
        )}

        {state === 'quiz' && (
          <div className="space-y-6">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {currentQuestion + 1} / {quizQuestions.length}
              </p>
            </div>

            <Card className="overflow-hidden">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {question.situation && (
                  <div className="bg-blue-50 -mx-6 -mt-6 px-6 py-4 mb-6 border-b border-blue-100">
                    <p className="text-blue-700 font-medium">{question.situation}</p>
                  </div>
                )}

                <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={isAnimating}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-blue-500 bg-blue-50 scale-[0.98]'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="text-gray-700 leading-relaxed">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {state === 'result' && result && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{result.emoji}</div>
              <p className="text-gray-500 mb-1">당신의 소비 유형은</p>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {result.name}
              </h1>
              <p className="text-lg text-gray-600">{result.title}</p>
            </div>

            <Card className={`bg-gradient-to-br ${result.color} text-white`}>
              <p className="text-lg leading-relaxed">{result.description}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>✨</span> 이런 특징이 있어요
              </h3>
              <ul className="space-y-3">
                {result.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span className="text-gray-700">{char}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-yellow-50 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <span>💡</span> 한마디 조언
              </h3>
              <p className="text-yellow-700 leading-relaxed">{result.advice}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                친구에게 공유하기
              </h3>
              <ShareButtons
                title="나의 소비성향 테스트"
                description={`나는 ${result.name}! ${result.title}`}
              />
            </Card>

            <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
