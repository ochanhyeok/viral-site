import { useState, useCallback } from 'react';
import { stressQuestions } from '../../data/stressQuestions';
import type { Answer, StressResult, CategoryScore } from '../../types/stressTest';
import { ProgressBar } from './ProgressBar';
import { Question } from './Question';
import { Result, getStressLevel } from './Result';
import { SEO, Card } from '../index';

type TestPhase = 'intro' | 'questions' | 'result';

export function StressTest() {
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<StressResult | null>(null);

  const currentQuestion = stressQuestions[currentIndex];
  const selectedScore = answers.find(
    (a) => a.questionId === currentQuestion?.id
  )?.score ?? null;

  const handleStart = () => {
    setPhase('questions');
  };

  const handleAnswer = useCallback((score: number) => {
    const questionId = stressQuestions[currentIndex].id;

    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, score };
        return updated;
      }
      return [...prev, { questionId, score }];
    });

    // 자동으로 다음 문항으로 이동 (마지막 문항이 아닌 경우)
    setTimeout(() => {
      if (currentIndex < stressQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 300);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stressQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);

    // 카테고리별 점수 계산
    const categoryMap = new Map<string, number>();
    answers.forEach((answer) => {
      const question = stressQuestions.find((q) => q.id === answer.questionId);
      if (question) {
        const current = categoryMap.get(question.category) || 0;
        categoryMap.set(question.category, current + answer.score);
      }
    });

    const categoryScores: CategoryScore[] = Array.from(categoryMap.entries()).map(
      ([category, score]) => ({
        category,
        score,
        maxScore: 5, // 각 카테고리당 1문항, 최대 5점
      })
    );

    const level = getStressLevel(totalScore);

    setResult({
      totalScore,
      level,
      categoryScores,
    });
    setPhase('result');
  };

  const handleRetry = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
  };

  const allAnswered = answers.length === stressQuestions.length;

  return (
    <>
      <SEO
        title="스트레스 지수 테스트"
        description="간단한 10개의 질문으로 현재 나의 스트레스 수준을 측정해보세요. 스트레스 관리 팁도 제공됩니다."
        keywords="스트레스테스트,스트레스지수,스트레스측정,심리테스트,멘탈헬스"
      />

      <div className="max-w-lg mx-auto">
        {/* 인트로 */}
        {phase === 'intro' && (
          <Card className="text-center animate-fadeIn">
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              스트레스 지수 테스트
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              간단한 10개의 질문을 통해
              <br />
              현재 당신의 스트레스 수준을 측정해보세요.
            </p>
            <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-purple-800 font-medium mb-2">
                📋 테스트 안내
              </p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 총 10문항으로 구성되어 있습니다</li>
                <li>• 각 문항은 5점 척도로 응답합니다</li>
                <li>• 솔직하게 답변할수록 정확한 결과가 나옵니다</li>
              </ul>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
            >
              테스트 시작하기
            </button>
          </Card>
        )}

        {/* 질문 */}
        {phase === 'questions' && currentQuestion && (
          <Card>
            <ProgressBar
              current={currentIndex + 1}
              total={stressQuestions.length}
            />

            <div className="mt-8">
              <Question
                key={currentQuestion.id}
                question={currentQuestion}
                selectedScore={selectedScore}
                onAnswer={handleAnswer}
              />
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>

              {currentIndex < stressQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={selectedScore === null}
                  className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  결과 보기
                </button>
              )}
            </div>
          </Card>
        )}

        {/* 결과 */}
        {phase === 'result' && result && (
          <Result result={result} onRetry={handleRetry} />
        )}
      </div>
    </>
  );
}
