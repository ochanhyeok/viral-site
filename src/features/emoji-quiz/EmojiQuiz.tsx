import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SEO, ShareButtons, Recommendations, FAQ, BadgeNotification } from '../../components';
import type { QuizQuestion } from './emojiQuizData';
import {
  getRandomQuestions,
  getGradeByPercent,
  categoryNames,
  emojiQuizFAQ,
  QUESTIONS_PER_ROUND,
  TIME_PER_QUESTION,
} from './emojiQuizData';
import { useUserData } from '../../hooks/useLocalStorage';
import { useBadges } from '../../hooks/useBadges';
import { submitRanking } from '../../hooks/useRanking';

type GamePhase = 'intro' | 'playing' | 'result' | 'final';

interface QuestionResult {
  question: QuizQuestion;
  selectedAnswer: string | null;
  correct: boolean;
  timeMs: number;
  usedHint: boolean;
  score: number;
}

export function EmojiQuiz() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { userData, saveRecord } = useUserData();
  const { checkBadges, newBadge, dismissNewBadge } = useBadges();
  const [_myRank, setMyRank] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 게임 시작
  const startGame = () => {
    const newQuestions = getRandomQuestions(QUESTIONS_PER_ROUND, selectedCategory);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setResults([]);
    setSelectedAnswer(null);
    setShowHint(false);
    setPhase('playing');
    startTimeRef.current = Date.now();
    setTimeLeft(TIME_PER_QUESTION);
  };

  // 타이머
  useEffect(() => {
    if (phase === 'playing' && !selectedAnswer) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, TIME_PER_QUESTION - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0) {
          // 시간 초과
          handleAnswer(null);
        }
      }, 100);
    }

    return () => clearTimer();
  }, [phase, selectedAnswer, currentIndex]);

  // 답 선택
  const handleAnswer = (answer: string | null) => {
    if (selectedAnswer !== null) return;

    clearTimer();
    const timeMs = Date.now() - startTimeRef.current;
    const isCorrect = answer === currentQuestion.answer;

    // 점수 계산
    let score = 0;
    if (isCorrect) {
      const baseScore = showHint ? 50 : 100; // 힌트 사용 시 절반
      const speedBonus = Math.max(0, Math.floor((1 - timeMs / TIME_PER_QUESTION) * 50));
      score = baseScore + (showHint ? Math.floor(speedBonus / 2) : speedBonus);
    }

    const result: QuestionResult = {
      question: currentQuestion,
      selectedAnswer: answer,
      correct: isCorrect,
      timeMs,
      usedHint: showHint,
      score,
    };

    setResults(prev => [...prev, result]);
    setSelectedAnswer(answer);
    setPhase('result');
  };

  // 다음 문제
  const handleNext = () => {
    if (isLastQuestion) {
      setPhase('final');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setPhase('playing');
      startTimeRef.current = Date.now();
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  // 최종 결과 계산
  const getFinalResults = () => {
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const correctCount = results.filter(r => r.correct).length;
    const percent = Math.round((correctCount / results.length) * 100);
    const grade = getGradeByPercent(percent);
    const maxScore = results.length * 150; // 최대 점수

    return { totalScore, maxScore, correctCount, percent, grade };
  };

  // 최종 결과 시 confetti 및 로컬 저장
  useEffect(() => {
    if (phase === 'final') {
      const finalResults = getFinalResults();

      // 로컬에 기록 저장
      saveRecord({
        testType: 'emoji-quiz',
        testName: '이모지 퀴즈',
        result: finalResults.grade.title,
        resultEmoji: finalResults.grade.emoji,
        score: finalResults.totalScore,
        maxScore: finalResults.maxScore,
        percentage: finalResults.percent,
      });

      // 랭킹 등록 (닉네임이 있는 경우)
      if (userData.profile?.nickname) {
        submitRanking('emoji-quiz', userData.profile.nickname, finalResults.totalScore, finalResults.grade.title)
          .then(res => {
            if (res.rank) setMyRank(res.rank);
          });
      }

      // 뱃지 체크
      setTimeout(() => checkBadges(), 500);

      if (finalResults.percent >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#d97706'],
        });
      }
    }
  }, [phase]);

  // 재시작
  const restart = () => {
    setPhase('intro');
    setQuestions([]);
    setCurrentIndex(0);
    setResults([]);
    setSelectedAnswer(null);
    setShowHint(false);
  };

  const timePercent = (timeLeft / TIME_PER_QUESTION) * 100;
  const timeColor = timePercent > 50 ? 'bg-green-500' : timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <>
      <SEO
        title="이모지 퀴즈 - 이모지로 맞춰봐!"
        description="🦁👑 이게 뭘까? 이모지만 보고 영화, 드라마, 노래, 음식을 맞춰보세요! 재미있는 이모지 퀴즈 게임!"
        keywords="이모지퀴즈,이모지게임,퀴즈게임,영화퀴즈,무료게임,초성퀴즈"
      />

      <div className="max-w-lg mx-auto">
        {/* 인트로 화면 */}
        {phase === 'intro' && (
          <div className="text-center space-y-6 animate-fadeIn">
            {/* 메인 비주얼 */}
            <div className="relative py-8">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-yellow-200 to-cyan-200 rounded-3xl opacity-50 blur-xl" />
              <div className="relative">
                <div className="text-6xl mb-4 flex justify-center gap-2">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🎬</span>
                  <span className="animate-bounce" style={{ animationDelay: '100ms' }}>🎵</span>
                  <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🍔</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">이모지 퀴즈</h1>
                <p className="text-lg text-gray-600">이모지만 보고 맞춰봐!</p>
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">카테고리 선택</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🎲 전체
                </button>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* 설명 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left space-y-3">
              <h2 className="font-bold text-gray-900 text-lg">게임 방법</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 이모지를 보고 정답을 맞춰주세요</p>
                <p>• 문제당 <span className="font-bold text-gray-900">15초</span> 시간 제한</p>
                <p>• 빠르게 맞출수록 높은 점수!</p>
                <p>• 힌트 사용 시 점수 절반</p>
              </div>
            </div>

            {/* 예시 */}
            <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">예시</p>
              <p className="text-4xl mb-2">🦁👑</p>
              <p className="text-gray-700 font-medium">= 라이온킹</p>
            </div>

            {/* 테스트 안내 정보성 텍스트 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 text-left shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">테스트 안내</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 총 {QUESTIONS_PER_ROUND}문제 출제</li>
                <li>• 문제당 {TIME_PER_QUESTION / 1000}초 시간 제한</li>
                <li>• 빠르게 맞출수록 높은 점수!</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                이 퀴즈는 이모지 조합을 보고 영화, 드라마, 노래, 음식 등을 맞추는 게임입니다.
                창의력과 연상력, 문화 콘텐츠에 대한 지식을 테스트할 수 있습니다.
                힌트를 사용하면 정답을 맞추기 쉬워지지만 점수가 절반으로 줄어듭니다.
                카테고리를 선택하여 관심 분야만 집중적으로 도전해보세요!
              </p>
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={startGame}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              시작하기
            </button>
          </div>
        )}

        {/* 게임 화면 */}
        {(phase === 'playing' || phase === 'result') && currentQuestion && (
          <div className="space-y-4 animate-fadeIn">
            {/* 상단 정보 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">문제</span>
                  <span className="text-xl font-bold text-gray-900">{currentIndex + 1}/{questions.length}</span>
                </div>
                <div className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {categoryNames[currentQuestion.category]}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">점수</span>
                  <span className="text-xl font-bold text-pink-500">
                    {results.reduce((sum, r) => sum + r.score, 0)}
                  </span>
                </div>
              </div>

              {/* 타이머 */}
              {phase === 'playing' && (
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${timeColor} transition-all duration-100`}
                    style={{ width: `${timePercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* 이모지 문제 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <p className="text-6xl mb-6 leading-relaxed">{currentQuestion.emoji}</p>

              {/* 힌트 */}
              {showHint && phase === 'playing' && (
                <div className="mb-4 text-sm text-amber-600 bg-amber-50 rounded-lg py-2 px-4 inline-block">
                  💡 힌트: {currentQuestion.hint}
                </div>
              )}

              {/* 결과 표시 */}
              {phase === 'result' && (
                <div className={`mb-4 py-3 px-4 rounded-xl font-bold ${
                  selectedAnswer === currentQuestion.answer
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedAnswer === currentQuestion.answer ? (
                    <span>정답! +{results[results.length - 1]?.score}점 🎉</span>
                  ) : selectedAnswer === null ? (
                    <span>시간 초과! 😅</span>
                  ) : (
                    <span>오답! 정답은 "{currentQuestion.answer}" 😢</span>
                  )}
                </div>
              )}
            </div>

            {/* 선택지 */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.answer;
                const showResult = phase === 'result';

                let buttonClass = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-400 hover:bg-pink-50';

                if (showResult) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-100 border-2 border-green-500 text-green-700';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-100 border-2 border-red-500 text-red-700';
                  } else {
                    buttonClass = 'bg-gray-100 border-2 border-gray-200 text-gray-400';
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => phase === 'playing' && handleAnswer(option)}
                    disabled={phase === 'result'}
                    className={`py-4 px-4 rounded-xl font-medium transition-all ${buttonClass} ${
                      phase === 'playing' ? 'active:scale-95' : ''
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* 힌트 버튼 / 다음 버튼 */}
            {phase === 'playing' ? (
              <button
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                  showHint
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {showHint ? '힌트 사용됨 (점수 절반)' : '💡 힌트 보기 (점수 절반)'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isLastQuestion ? '결과 보기' : '다음 문제'}
              </button>
            )}
          </div>
        )}

        {/* 최종 결과 화면 */}
        {phase === 'final' && (() => {
          const finalResults = getFinalResults();
          const avgTimeMs = Math.round(results.reduce((sum, r) => sum + r.timeMs, 0) / results.length);
          const hintsUsed = results.filter(r => r.usedHint).length;

          return (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 카드 */}
            <div
              id="emoji-quiz-result"
              className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${finalResults.grade.bgGradient} text-white shadow-2xl`}
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/4 left-4 w-3 h-3 bg-white/30 rounded-full" />
              <div className="absolute top-1/3 right-8 w-2 h-2 bg-white/40 rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-white/20 rounded-full" />
              <div className="absolute top-8 left-1/4 text-white/20 text-2xl">✨</div>
              <div className="absolute bottom-12 right-6 text-white/20 text-xl">🎯</div>

              <div className="relative text-center space-y-4">
                {/* 레벨 뱃지 */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                  <span className="text-white/80 text-sm font-medium">정답률</span>
                  <span className="text-white font-bold text-lg">{finalResults.percent}%</span>
                </div>

                {/* 메인 이모지 */}
                <div className="text-7xl drop-shadow-lg">{finalResults.grade.emoji}</div>

                {/* 타이틀 */}
                <h2 className="text-3xl font-black drop-shadow-md">{finalResults.grade.title}</h2>
                <p className="text-lg text-white/90">{finalResults.grade.description}</p>

                {/* 핵심 점수 강조 */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mx-4">
                  <p className="text-white/70 text-sm mb-1">총 점수</p>
                  <p className="text-4xl font-black">{finalResults.totalScore}<span className="text-lg font-normal text-white/70">점</span></p>
                </div>

                {/* 상세 통계 */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5">
                    <p className="text-xs text-white/60">정답</p>
                    <p className="text-lg font-bold">{finalResults.correctCount}/{results.length}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5">
                    <p className="text-xs text-white/60">평균 시간</p>
                    <p className="text-lg font-bold">{(avgTimeMs / 1000).toFixed(1)}초</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5">
                    <p className="text-xs text-white/60">힌트</p>
                    <p className="text-lg font-bold">{hintsUsed}회</p>
                  </div>
                </div>

                {/* 워터마크 */}
                <p className="text-xs text-white/40 pt-2">viral-site-opal.vercel.app</p>
              </div>
            </div>

            {/* 문제별 결과 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">문제별 결과</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      r.correct ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <span className="text-2xl">{r.question.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${r.correct ? 'text-green-700' : 'text-red-700'}`}>
                        {r.question.answer}
                      </p>
                      {!r.correct && r.selectedAnswer && (
                        <p className="text-xs text-red-500">내 답: {r.selectedAnswer}</p>
                      )}
                    </div>
                    <span className={`font-bold ${r.correct ? 'text-green-600' : 'text-red-400'}`}>
                      {r.correct ? `+${r.score}` : '0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 공유 버튼 */}
            <ShareButtons
              title={`🎯 이모지 퀴즈 결과: ${finalResults.grade.title}`}
              description={`${finalResults.grade.emoji} ${finalResults.correctCount}/${results.length} 정답! (${finalResults.totalScore}점)`}
              captureElementId="emoji-quiz-result"
              captureFileName="emoji-quiz-result"
            />

            {/* 다시하기 */}
            <button
              onClick={restart}
              className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              다시 도전하기
            </button>

            {/* 추천 콘텐츠 */}
            <Recommendations currentPath="/emoji-quiz" />

            {/* FAQ */}
            <FAQ items={emojiQuizFAQ} title="이모지 퀴즈 FAQ" />
          </div>
        );
        })()}
      </div>

      {/* 뱃지 획득 알림 */}
      <BadgeNotification badge={newBadge} onDismiss={dismissNewBadge} />
    </>
  );
}
