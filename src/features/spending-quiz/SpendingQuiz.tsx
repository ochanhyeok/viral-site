import { useState, useEffect, useRef, useMemo } from 'react';
import { SEO, Button, ShareButtons, AgeGroupSelect, ageGroupLabels, Recommendations, FAQ, spendingFAQ, MascotWithTyping, mascotComments, getRandomComment } from '../../components';
import type { MascotMood } from '../../components';
import { quizQuestions, calculateResult } from './quizData';
import type { SpendingType } from './quizData';
import { saveTestResult, useTestStats, calculatePercentage, useTotalParticipants } from '../../hooks/useTestStats';
import { fireConfetti } from '../../hooks/useConfetti';
import { getRarityInfo, getFirstParticipantInfo } from '../../utils/rarityMessage';

type QuizState = 'intro' | 'ageSelect' | 'quiz' | 'result';

export function SpendingQuiz() {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<SpendingType | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [resultSaved, setResultSaved] = useState(false);
  const confettiFired = useRef(false);

  const { myAgeGroupStats, ageGroupCount } = useTestStats('spending', ageGroup);
  const { totalCount: totalParticipants } = useTotalParticipants('spending');

  // 결과 나올 때 폭죽 발사
  useEffect(() => {
    if (state === 'result' && result && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [state, result]);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  // 결과 저장
  useEffect(() => {
    if (result && ageGroup && !resultSaved) {
      saveTestResult('spending', result.id, ageGroup);
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

  const question = quizQuestions[currentQuestion];

  // 나이대 비교 데이터
  const myPercentage = result ? calculatePercentage(myAgeGroupStats, result.id) : 0;

  // 희소성 정보
  const rarityInfo = ageGroup && ageGroupCount > 1
    ? getRarityInfo(myPercentage, ageGroupLabels[ageGroup], ageGroupCount)
    : ageGroup
    ? getFirstParticipantInfo(ageGroupLabels[ageGroup])
    : null;

  // 마스코트 코멘트
  const mascotComment = useMemo(() => {
    if (state === 'result' && result) {
      return getRandomComment(mascotComments.quiz.end);
    }
    return null;
  }, [state, result]);

  return (
    <>
      <SEO
        title="나의 소비성향 테스트"
        description="당신은 플렉스형? 짠돌이형? 가치소비형? 12개의 질문으로 알아보는 나의 진짜 소비 유형! 무료 소비습관 심리테스트."
        keywords="소비성향테스트,소비유형,소비습관,심리테스트,돈관리테스트,재테크성향"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          name: '소비성향 테스트',
          description: '12개의 상황 질문으로 알아보는 나의 소비 유형 심리테스트',
          url: 'https://viral-site-opal.vercel.app/spending-quiz',
          educationalLevel: 'beginner',
          about: {
            '@type': 'Thing',
            name: '소비 습관'
          }
        }}
      />

      <div className="space-y-6">
        {state === 'intro' && (
          <div className="text-center animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/30">
              <span className="text-5xl">💸</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
              소비성향 테스트
            </h1>
            <p className="text-gray-500 mb-8">
              12개의 상황으로 알아보는<br />
              나의 진짜 소비 스타일!
            </p>

            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-around text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-gray-500">12문항</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-gray-500">2-3분</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-gray-500">나이대 비교</div>
                </div>
              </div>
            </div>

            {/* 참여자 수 */}
            {totalParticipants > 0 && (
              <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-gray-500">
                  <span className="font-bold text-purple-600">{totalParticipants.toLocaleString()}</span>명이 테스트 완료
                </span>
              </div>
            )}

            <Button onClick={handleStart} size="lg" className="w-full max-w-xs">
              테스트 시작하기
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
                <span>{currentQuestion + 1} / {quizQuestions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
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
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
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
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-purple-500 bg-purple-50 scale-[0.98]'
                          : 'border-gray-100 hover:border-purple-200 hover:bg-purple-50/50'
                      } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
                    >
                      <span className="text-gray-700 leading-relaxed">{option.text}</span>
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
              {/* 희소성 뱃지 */}
              {rarityInfo && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${rarityInfo.badgeColor} text-white text-sm font-bold mb-3 shadow-lg`}>
                  <span>{rarityInfo.badge}</span>
                  <span className="text-white/80">|</span>
                  <span>{rarityInfo.message}</span>
                </div>
              )}
              <p className="text-gray-400 text-sm mb-1">당신의 소비 유형은</p>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {result.name}
              </h1>
              <p className="text-lg text-gray-600">{result.title}</p>
            </div>

            {/* 나이대 비교 */}
            {ageGroup && rarityInfo && (
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span> {ageGroupLabels[ageGroup]} 비교
                </h3>
                {ageGroupCount > 1 ? (
                  <>
                    <p className="text-purple-100 text-sm mb-3">
                      {ageGroupLabels[ageGroup]} 참여자 {ageGroupCount.toLocaleString()}명 중
                    </p>
                    <div className="bg-white/20 rounded-2xl p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityInfo.badgeColor} text-xs font-bold`}>
                          {rarityInfo.badge}
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {myPercentage}%가 같은 유형
                      </p>
                      <p className="text-purple-100 text-sm mt-2">
                        {rarityInfo.subMessage}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/20 rounded-2xl p-4">
                    <p className="text-xl font-bold mb-1">{rarityInfo.badge}</p>
                    <p className="text-purple-100 text-sm">
                      {rarityInfo.subMessage}<br />
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

            {/* 마스코트 코멘트 */}
            {mascotComment && (
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <MascotWithTyping
                  mood={mascotComment.mood as MascotMood}
                  message={mascotComment.message}
                  size="md"
                />
              </div>
            )}

            {/* 특징 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span> 이런 특징이 있어요
              </h3>
              <ul className="space-y-3">
                {result.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 조언 */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-6 border border-amber-100">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span> 한마디 조언
              </h3>
              <p className="text-amber-700 leading-relaxed">{result.advice}</p>
            </div>

            {/* 이미지 저장용 카드 - 프리미엄 디자인 */}
            <div
              id="spending-result-capture"
              className={`rounded-3xl overflow-hidden bg-gradient-to-br ${result.color} relative`}
            >
              {/* 배경 장식 */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              </div>

              <div className="relative p-8 text-white">
                {/* 상단 뱃지 */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium">소비성향 테스트</span>
                  </div>
                  {rarityInfo && (
                    <div className={`bg-gradient-to-r ${rarityInfo.badgeColor} px-3 py-1 rounded-full shadow-lg`}>
                      <span className="text-xs font-bold">{rarityInfo.badge}</span>
                    </div>
                  )}
                </div>

                {/* 메인 콘텐츠 */}
                <div className="text-center">
                  {/* 이모지 */}
                  <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg border border-white/30">
                    <span className="text-5xl">{result.emoji}</span>
                  </div>

                  {/* 유형명 */}
                  <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">My Type</p>
                  <h2 className="text-4xl font-black mb-2 drop-shadow-lg">{result.name}</h2>
                  <p className="text-xl font-semibold text-white/90 mb-4">{result.title}</p>

                  {/* 구분선 */}
                  <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-4" />

                  {/* 특징 3개 */}
                  <div className="flex justify-center gap-2 flex-wrap mb-4">
                    {result.characteristics.slice(0, 3).map((char, idx) => (
                      <span key={idx} className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                        {char.length > 15 ? char.slice(0, 15) + '...' : char}
                      </span>
                    ))}
                  </div>

                  {/* 통계 */}
                  {ageGroup && ageGroupCount > 1 && myPercentage && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-4 border border-white/20">
                      <p className="text-sm">
                        <span className="font-bold">{ageGroupLabels[ageGroup]}</span> 중{' '}
                        <span className="text-2xl font-black">{myPercentage}%</span>가 같은 유형
                      </p>
                    </div>
                  )}
                </div>

                {/* 하단 브랜딩 */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/20">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="text-white/60 text-xs font-medium">viral-site-opal.vercel.app</span>
                </div>
              </div>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                친구에게 공유하기
              </h3>
              <ShareButtons
                title="소비성향 테스트"
                description={`나는 ${result.name}! ${result.title}`}
                captureElementId="spending-result-capture"
                captureFileName="spending-result"
              />
            </div>

            <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>

            {/* 다른 테스트 추천 */}
            <Recommendations currentPath="/spending-quiz" />

            {/* FAQ */}
            <FAQ items={spendingFAQ} />
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
