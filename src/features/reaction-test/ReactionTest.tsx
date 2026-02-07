import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { SEO, ShareButtons, Recommendations, FAQ, BadgeNotification } from '../../components';
import {
  TOTAL_ROUNDS,
  MIN_WAIT_TIME,
  MAX_WAIT_TIME,
  funFacts,
  reactionTestFAQ,
  getGradeByMs,
  comparisonData,
} from './reactionTestData';
import { useTotalParticipants } from '../../hooks/useTestStats';
import { useUserData } from '../../hooks/useLocalStorage';
import { useBadges } from '../../hooks/useBadges';
import { submitRanking } from '../../hooks/useRanking';

type GamePhase = 'intro' | 'waiting' | 'ready' | 'result' | 'tooEarly' | 'final';

interface RoundResult {
  round: number;
  reactionTime: number;
  tooEarly: boolean;
}

// 반응속도 테스트용 간단한 통계 훅
function useReactionTestStats() {
  const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';
  const [stats, setStats] = useState<{
    count: number;
    totalCount: number;
    percentage: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const submitResult = async (resultType: string) => {
    try {
      const statsPath = `${FIREBASE_DB_URL}/stats/reaction-test/${resultType}.json`;
      const currentRes = await fetch(statsPath);
      const current = await currentRes.json() || 0;
      await fetch(statsPath, { method: 'PUT', body: JSON.stringify(current + 1) });
    } catch (error) {
      console.error('Failed to save reaction test result:', error);
    }
  };

  const getStats = async (resultType: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${FIREBASE_DB_URL}/stats/reaction-test.json`);
      const data = await response.json();
      let totalCount = 0;
      let myCount = 0;
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          const count = value as number;
          totalCount += count;
          if (key === resultType) myCount = count;
        });
      }
      const percentage = totalCount > 0 ? Math.round((myCount / totalCount) * 100) : 0;
      setStats({ count: myCount, totalCount, percentage });
    } catch (error) {
      console.error('Failed to fetch reaction test stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, submitResult, getStats };
}

// 희소성 정보
function getRarityInfo(percentage: number) {
  const oneInX = percentage > 0 ? Math.round(100 / percentage) : 100;
  if (percentage <= 5) {
    return { badge: '🦄 초희귀', badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white', message: `${oneInX}명 중 1명!`, isRare: true };
  }
  if (percentage <= 10) {
    return { badge: '💎 희귀', badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', message: `상위 ${percentage}%`, isRare: true };
  }
  if (percentage <= 20) {
    return { badge: '⭐ 특별', badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white', message: `전체 ${percentage}%`, isRare: true };
  }
  return { badge: '', badgeColor: '', message: `전체 ${percentage}%`, isRare: false };
}

export function ReactionTest() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState(0);
  const [funFact] = useState(() => funFacts[Math.floor(Math.random() * funFacts.length)]);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { stats, loading: statsLoading, submitResult, getStats } = useReactionTestStats();
  const { totalCount, isLoading: totalLoading } = useTotalParticipants('reaction-test');
  const { userData, saveRecord } = useUserData();
  const { checkBadges, newBadge, dismissNewBadge } = useBadges();
  const [_myRank, setMyRank] = useState<number | null>(null);

  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // 라운드 시작
  const startRound = useCallback(() => {
    clearTimer();
    setPhase('waiting');

    // 랜덤 대기 시간 후 초록색으로 전환
    const waitTime = MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);
    timeoutRef.current = setTimeout(() => {
      setPhase('ready');
      startTimeRef.current = performance.now();
    }, waitTime);
  }, [clearTimer]);

  // 게임 시작
  const startGame = () => {
    setCurrentRound(1);
    setResults([]);
    startRound();
  };

  // 화면 클릭 처리
  const handleClick = () => {
    if (phase === 'waiting') {
      // 너무 일찍 클릭
      clearTimer();
      setPhase('tooEarly');
    } else if (phase === 'ready') {
      // 정상 클릭 - 반응시간 측정
      const reactionTime = Math.round(performance.now() - startTimeRef.current);
      setCurrentReactionTime(reactionTime);

      const newResult: RoundResult = {
        round: currentRound,
        reactionTime,
        tooEarly: false,
      };
      setResults(prev => [...prev, newResult]);
      setPhase('result');
    }
  };

  // 다음 라운드 또는 최종 결과
  const handleNext = () => {
    if (currentRound >= TOTAL_ROUNDS) {
      // 최종 결과
      setPhase('final');
    } else {
      setCurrentRound(prev => prev + 1);
      startRound();
    }
  };

  // Too Early 후 재시도
  const handleRetry = () => {
    startRound();
  };

  // 최종 결과 계산
  const getFinalResults = () => {
    const validResults = results.filter(r => !r.tooEarly);
    if (validResults.length === 0) return null;

    const times = validResults.map(r => r.reactionTime);
    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const bestTime = Math.min(...times);
    const worstTime = Math.max(...times);
    const grade = getGradeByMs(avgTime);

    return { avgTime, bestTime, worstTime, grade, validCount: validResults.length };
  };

  // 최종 결과 제출 및 로컬 저장
  useEffect(() => {
    if (phase === 'final') {
      const finalResults = getFinalResults();
      if (finalResults) {
        submitResult(finalResults.grade.id);
        getStats(finalResults.grade.id);

        // 로컬에 기록 저장
        saveRecord({
          testType: 'reaction-test',
          testName: '반응속도 테스트',
          result: finalResults.grade.title,
          resultEmoji: finalResults.grade.emoji,
          score: finalResults.avgTime,
          details: { avgTime: finalResults.avgTime, bestTime: finalResults.bestTime },
        });

        // 랭킹 등록 (닉네임이 있는 경우)
        if (userData.profile?.nickname) {
          submitRanking('reaction-test', userData.profile.nickname, finalResults.avgTime, finalResults.grade.title)
            .then(res => {
              if (res.rank) setMyRank(res.rank);
            });
        }

        // 뱃지 체크
        setTimeout(() => checkBadges(), 500);

        // 좋은 결과면 confetti
        if (finalResults.avgTime < 250) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309'],
          });
        }
      }
    }
  }, [phase]);

  const finalResults = phase === 'final' ? getFinalResults() : null;
  const rarityInfo = finalResults && stats ? getRarityInfo(stats.percentage) : null;

  // 재시작
  const restart = () => {
    clearTimer();
    setPhase('intro');
    setCurrentRound(0);
    setResults([]);
  };

  return (
    <>
      <SEO
        title="반응속도 테스트 - 당신의 반사신경은?"
        description="초록색이 되면 최대한 빠르게 클릭! 밀리초 단위로 측정하는 정밀 반응속도 테스트. 프로게이머급인지 확인해보세요!"
        keywords="반응속도테스트,반사신경테스트,리액션테스트,클릭테스트,게임반응속도,무료테스트"
      />

      <div className="max-w-lg mx-auto">
        {/* 인트로 화면 */}
        {phase === 'intro' && (
          <div className="text-center space-y-6 animate-fadeIn">
            {/* 메인 비주얼 */}
            <div className="relative py-8">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 rounded-3xl opacity-50 blur-xl" />
              <div className="relative">
                <div className="text-8xl mb-4">⚡</div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">반응속도 테스트</h1>
                <p className="text-lg text-gray-600">당신의 반사신경은?</p>
              </div>
            </div>

            {/* 참여자 수 */}
            {!totalLoading && totalCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <span className="text-sm text-amber-700 font-medium">
                  {totalCount.toLocaleString()}명이 테스트했어요!
                </span>
              </div>
            )}

            {/* 설명 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">테스트 방법</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">1</span>
                  <p className="text-gray-600 text-sm pt-1"><span className="font-semibold text-red-500">빨간 화면</span>이 나오면 대기하세요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">2</span>
                  <p className="text-gray-600 text-sm pt-1"><span className="font-semibold text-green-500">초록색</span>으로 바뀌면 최대한 빠르게 클릭!</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">3</span>
                  <p className="text-gray-600 text-sm pt-1">총 <span className="font-semibold text-gray-900">{TOTAL_ROUNDS}회</span> 측정 후 평균 계산</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-xl">
                <p className="text-sm text-red-600">
                  ⚠️ 초록색이 되기 전에 클릭하면 <span className="font-bold">Too Early!</span>
                </p>
              </div>
            </div>

            {/* 팁 */}
            <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <p className="text-sm text-amber-800 text-left">{funFact}</p>
            </div>

            {/* 테스트 안내 정보성 텍스트 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 text-left shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">테스트 안내</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 총 {TOTAL_ROUNDS}회 측정 후 평균 계산</li>
                <li>• 소요 시간: 약 1-2분</li>
                <li>• 집중할 수 있는 환경에서 테스트하세요</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                이 테스트는 시각 자극에 대한 반응 속도를 밀리초(ms) 단위로 정밀하게 측정합니다.
                평균 성인의 반응속도는 약 250ms이며, 프로 게이머는 150ms 이하를 기록하기도 합니다.
                {TOTAL_ROUNDS}회의 측정을 통해 평균값을 산출하여 정확한 결과를 제공합니다.
                반응속도는 수면, 집중력, 컨디션에 따라 달라질 수 있습니다.
              </p>
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={startGame}
              className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              테스트 시작하기
            </button>

            {/* 같이하기 버튼 */}
            <Link
              to="/play/reaction"
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>친구와 같이하기</span>
            </Link>
          </div>
        )}

        {/* 대기 화면 (빨간색) */}
        {phase === 'waiting' && (
          <div
            onClick={handleClick}
            className="cursor-pointer select-none animate-fadeIn"
          >
            <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-red-400/50 flex items-center justify-center mb-6 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-white/90 shadow-inner"></div>
              </div>
              <p className="text-white text-2xl font-bold mb-2">대기...</p>
              <p className="text-white/80 text-sm">초록색이 될 때까지 기다리세요</p>
              <div className="mt-8 text-white/60 text-sm">
                Round {currentRound}/{TOTAL_ROUNDS}
              </div>
            </div>
          </div>
        )}

        {/* 준비 화면 (초록색) */}
        {phase === 'ready' && (
          <div
            onClick={handleClick}
            className="cursor-pointer select-none"
          >
            <div className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center shadow-2xl animate-pulse">
              <div className="w-20 h-20 rounded-full bg-green-300/50 flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg"></div>
              </div>
              <p className="text-white text-3xl font-black mb-2">지금 클릭!</p>
              <p className="text-white/80 text-sm">최대한 빠르게!</p>
            </div>
          </div>
        )}

        {/* Too Early 화면 */}
        {phase === 'tooEarly' && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 rounded-3xl p-8 min-h-[300px] flex flex-col items-center justify-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-white text-2xl font-bold mb-2">Too Early!</p>
              <p className="text-white/80">초록색이 될 때까지 기다려주세요</p>
            </div>
            <button
              onClick={handleRetry}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 라운드 결과 화면 */}
        {phase === 'result' && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <p className="text-white/80 text-sm mb-2">Round {currentRound}/{TOTAL_ROUNDS}</p>
              <div className="text-6xl font-black text-white mb-2">
                {currentReactionTime}<span className="text-2xl">ms</span>
              </div>
              <p className="text-white/80">
                {currentReactionTime < 200 ? '엄청 빨라요! ⚡' :
                  currentReactionTime < 270 ? '좋은 반응속도! 👍' :
                    currentReactionTime < 350 ? '평균적이에요 😊' : '조금 느렸어요 🐢'}
              </p>

              {/* 이전 결과들 */}
              {results.length > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                        r.reactionTime < 250 ? 'bg-green-400 text-green-900' :
                          r.reactionTime < 350 ? 'bg-yellow-400 text-yellow-900' :
                            'bg-orange-400 text-orange-900'
                      }`}
                    >
                      {r.reactionTime}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {currentRound >= TOTAL_ROUNDS ? '결과 보기' : '다음 라운드'}
            </button>
          </div>
        )}

        {/* 최종 결과 화면 */}
        {phase === 'final' && finalResults && (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 카드 - 프리미엄 디자인 */}
            <div
              id="reaction-test-result"
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${finalResults.grade.bgGradient} text-white shadow-2xl`}
            >
              {/* 배경 장식 */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              </div>

              <div className="relative p-8">
                {/* 상단 뱃지 */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium">⚡ 반응속도 테스트</span>
                  </div>
                  {rarityInfo && rarityInfo.isRare && (
                    <div className={`${rarityInfo.badgeColor} px-3 py-1 rounded-full shadow-lg`}>
                      <span className="text-xs font-bold">{rarityInfo.badge}</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-4">
                  {/* 이모지 */}
                  <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg border border-white/30">
                    <span className="text-5xl">{finalResults.grade.emoji}</span>
                  </div>

                  {/* 등급 */}
                  <h2 className="text-3xl font-black drop-shadow-lg">{finalResults.grade.title}</h2>
                  <p className="text-lg text-white/90">{finalResults.grade.description}</p>

                  {/* 구분선 */}
                  <div className="w-16 h-1 bg-white/30 rounded-full mx-auto" />

                  {/* 평균 반응속도 */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-sm text-white/70 mb-1">평균 반응속도</p>
                    <p className="text-5xl font-black">{finalResults.avgTime}<span className="text-xl">ms</span></p>
                  </div>

                  {/* 상세 기록 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-xs text-white/60">최고 기록</p>
                      <p className="text-xl font-bold">{finalResults.bestTime}ms</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-xs text-white/60">최저 기록</p>
                      <p className="text-xl font-bold">{finalResults.worstTime}ms</p>
                    </div>
                  </div>

                  {/* 통계 */}
                  {!statsLoading && stats && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <p className="text-sm">{rarityInfo?.message}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {stats.totalCount.toLocaleString()}명 중 {stats.count.toLocaleString()}명이 같은 등급
                      </p>
                    </div>
                  )}
                </div>

                {/* 하단 브랜딩 */}
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-white/20">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="text-white/60 text-xs font-medium">viral-site-opal.vercel.app</span>
                </div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {finalResults.grade.detailDescription}
              </p>
            </div>

            {/* 비교 차트 */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">반응속도 비교</h3>
              <div className="space-y-3">
                {comparisonData.map((item) => {
                  const myPosition = finalResults.avgTime;
                  const isMe = Math.abs(item.ms - myPosition) < 30;
                  const percentage = Math.min(100, (item.ms / 500) * 100);

                  return (
                    <div key={item.name} className="relative">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className={`${isMe ? 'font-bold text-amber-600' : 'text-gray-600'}`}>
                          {item.emoji} {item.name}
                        </span>
                        <span className={`${isMe ? 'font-bold text-amber-600' : 'text-gray-500'}`}>
                          {item.ms}ms
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isMe ? 'bg-amber-500' : 'bg-gray-300'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {/* 내 위치 표시 */}
                <div className="relative mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-bold text-violet-600">⭐ 나의 기록</span>
                    <span className="font-bold text-violet-600">{finalResults.avgTime}ms</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.min(100, (finalResults.avgTime / 500) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 각 라운드 결과 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">라운드별 기록</h3>
              <div className="flex justify-center gap-2">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={`flex-1 py-3 rounded-xl text-center ${
                      r.reactionTime < 250 ? 'bg-green-100 text-green-700' :
                        r.reactionTime < 350 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <p className="text-xs text-current/60">R{r.round}</p>
                    <p className="font-bold">{r.reactionTime}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 공유 버튼 */}
            <ShareButtons
              title={`⚡ 반응속도 테스트 결과: ${finalResults.grade.title}`}
              description={`${finalResults.grade.emoji} 평균 ${finalResults.avgTime}ms - ${finalResults.grade.description}`}
              captureElementId="reaction-test-result"
              captureFileName="reaction-test-result"
            />

            {/* 다시하기 */}
            <button
              onClick={restart}
              className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              다시 테스트하기
            </button>

            {/* 추천 콘텐츠 */}
            <Recommendations currentPath="/reaction-test" />

            {/* FAQ */}
            <FAQ items={reactionTestFAQ} title="반응속도 테스트 FAQ" />
          </div>
        )}
      </div>

      {/* 뱃지 획득 알림 */}
      <BadgeNotification badge={newBadge} onDismiss={dismissNewBadge} />
    </>
  );
}
