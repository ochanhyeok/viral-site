import { useState, useEffect, useRef } from 'react';
import { SEO, Button, ShareButtons, AgeGroupSelect, ageGroupLabels } from '../../components';
import { kkondaeQuestions, calculateKkondaeResult } from './kkondaeData';
import type { KkondaeResult } from './kkondaeData';
import { saveTestResult, useTestStats, calculatePercentage } from '../../hooks/useTestStats';
import { fireConfetti } from '../../hooks/useConfetti';

type QuizState = 'intro' | 'ageSelect' | 'quiz' | 'result';

export function KkondaeTest() {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<KkondaeResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [resultSaved, setResultSaved] = useState(false);
  const confettiFired = useRef(false);

  const { myAgeGroupStats, ageGroupCount } = useTestStats('kkondae', ageGroup);

  // 결과 나올 때 폭죽 발사
  useEffect(() => {
    if (state === 'result' && result && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [state, result]);

  const progress = ((currentQuestion + 1) / kkondaeQuestions.length) * 100;

  // 결과 저장
  useEffect(() => {
    if (result && ageGroup && !resultSaved) {
      saveTestResult('kkondae', result.id, ageGroup);
      setResultSaved(true);
    }
  }, [result, ageGroup, resultSaved]);

  const handleStart = () => {
    setState('ageSelect');
  };

  const handleAgeSelect = (selectedAge: string) => {
    setAgeGroup(selectedAge);
    setState('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnimating) return;

    setSelectedOption(optionIndex);
    setIsAnimating(true);

    const question = kkondaeQuestions[currentQuestion];
    const score = question.options[optionIndex].score;

    setTimeout(() => {
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);

      if (currentQuestion < kkondaeQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        const kkondaeResult = calculateKkondaeResult(newAnswers);
        setResult(kkondaeResult);
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
    setAgeGroup(null);
    setResultSaved(false);
    confettiFired.current = false;
  };

  const question = kkondaeQuestions[currentQuestion];

  // 나이대 비교 데이터
  const myPercentage = result ? calculatePercentage(myAgeGroupStats, result.id) : 0;

  return (
    <>
      <SEO
        title="꼰대력 테스트"
        description="나는 MZ? 아니면 꼰대? 12가지 직장 상황으로 알아보는 나의 꼰대 지수! 재미로 보는 꼰대력 심리테스트"
        keywords="꼰대테스트,꼰대력,MZ테스트,직장인테스트,세대차이테스트,꼰대심리테스트,라떼테스트"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          name: '꼰대력 테스트',
          description: '12개의 직장 상황 질문으로 알아보는 나의 꼰대 지수 심리테스트',
          url: 'https://viral-site-opal.vercel.app/kkondae-test',
          educationalLevel: 'beginner',
          about: {
            '@type': 'Thing',
            name: '꼰대력 측정'
          }
        }}
      />

      <div className="space-y-6">
        {state === 'intro' && (
          <div className="text-center animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-500/30">
              <span className="text-5xl">👴</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
              꼰대력 테스트
            </h1>
            <p className="text-gray-500 mb-8">
              나는 MZ? 아니면 숨겨진 꼰대?<br />
              12가지 상황으로 알아보자!
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
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-gray-500">나이대 비교</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-8 border border-amber-100">
              <p className="text-amber-700 text-sm">
                <span className="font-bold">주의!</span> 결과가 충격적일 수 있습니다 😱
              </p>
            </div>

            <Button onClick={handleStart} size="lg" className="w-full max-w-xs">
              내 꼰대력 측정하기
            </Button>
          </div>
        )}

        {/* 나이대 선택 */}
        {state === 'ageSelect' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <AgeGroupSelect onSelect={handleAgeSelect} />
            </div>
          </div>
        )}

        {state === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 프로그레스 바 */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Q{currentQuestion + 1}</span>
                <span>{currentQuestion + 1} / {kkondaeQuestions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-500 ease-out"
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
                <div className="bg-gradient-to-r from-slate-600 to-slate-800 px-6 py-4">
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
                          ? 'border-slate-600 bg-slate-50 scale-[0.98]'
                          : 'border-gray-100 hover:border-slate-300 hover:bg-slate-50/50'
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
              <p className="text-gray-400 text-sm mb-1">당신의 꼰대력은</p>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
                {result.level}
              </h1>
              <p className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-1">
                {result.title}
              </p>
              <p className="text-gray-500 text-sm">꼰대 지수 {result.percentage}</p>
            </div>

            {/* 나이대 비교 */}
            {ageGroup && (
              <div className="bg-gradient-to-br from-slate-600 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span> {ageGroupLabels[ageGroup]} 비교
                </h3>
                {ageGroupCount > 1 ? (
                  <>
                    <p className="text-slate-200 text-sm mb-3">
                      {ageGroupLabels[ageGroup]} 참여자 {ageGroupCount}명 중
                    </p>
                    <div className="bg-white/20 rounded-2xl p-4">
                      <p className="text-2xl font-bold">
                        {myPercentage}%가 같은 유형
                      </p>
                      <p className="text-slate-200 text-sm mt-1">
                        {myPercentage >= 25
                          ? `${ageGroupLabels[ageGroup]}에서 많이 나오는 유형이에요!`
                          : myPercentage >= 10
                          ? `${ageGroupLabels[ageGroup]} 평균 수준이에요`
                          : `${ageGroupLabels[ageGroup]}에서는 드문 유형이에요!`}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/20 rounded-2xl p-4">
                    <p className="text-xl font-bold mb-1">🎉 첫 번째 참여자!</p>
                    <p className="text-slate-200 text-sm">
                      {ageGroupLabels[ageGroup]}에서 처음으로 테스트했어요.<br />
                      공유해서 친구들과 비교해보세요!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 설명 카드 */}
            <div className={`bg-gradient-to-br ${result.color} rounded-3xl p-6 text-white shadow-xl`}>
              <p className="text-lg leading-relaxed">{result.description}</p>
            </div>

            {/* 특징 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🔍</span> 이런 특징이 있어요
              </h3>
              <ul className="space-y-3">
                {result.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 꼰대 탈출 팁 */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span> 꼰대 탈출 TIP
              </h3>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span className="text-emerald-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                친구에게 공유하기
              </h3>
              <ShareButtons
                title="꼰대력 테스트"
                description={`나의 꼰대력은 ${result.level}! ${result.title}`}
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
