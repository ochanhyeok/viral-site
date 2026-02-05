import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SEO, ShareButtons, Recommendations, FAQ, BadgeNotification } from '../../components';
import { useColorTest } from './useColorTest';
import { TOTAL_ROUNDS, funFacts, colorTestFAQ, difficultyLevels } from './colorTestData';
import { useColorTestStats, useTotalParticipants } from '../../hooks/useTestStats';
import { useUserData } from '../../hooks/useLocalStorage';
import { useBadges } from '../../hooks/useBadges';

// 색감 테스트용 간단한 희소성 정보
function getColorRarityInfo(percentage: number) {
  const oneInX = percentage > 0 ? Math.round(100 / percentage) : 100;

  if (percentage <= 5) {
    return {
      badge: '🦄 초희귀',
      badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      message: `${oneInX}명 중 1명 꼴!`,
      isRare: true,
    };
  }
  if (percentage <= 10) {
    return {
      badge: '💎 희귀',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      message: `상위 ${percentage}%`,
      isRare: true,
    };
  }
  if (percentage <= 20) {
    return {
      badge: '⭐ 특별',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
      message: `전체 ${percentage}%`,
      isRare: true,
    };
  }
  return {
    badge: '',
    badgeColor: '',
    message: `전체 ${percentage}%`,
    isRare: false,
  };
}

export function ColorTest() {
  const { gameState, startGame, handleTileClick, getResults, restart } = useColorTest();
  const { phase, currentRound, score, combo, tiles, gridSize, timeLeft, showFeedback, lastRoundCorrect } = gameState;
  const [funFact] = useState(() => funFacts[Math.floor(Math.random() * funFacts.length)]);

  const { submitResult, getStats, stats, loading: statsLoading } = useColorTestStats();
  const { totalCount, isLoading: totalLoading } = useTotalParticipants('color-test');
  const { saveRecord } = useUserData();
  const { checkBadges, newBadge, dismissNewBadge } = useBadges();

  // 결과 제출 및 로컬 저장
  useEffect(() => {
    if (phase === 'result') {
      const results = getResults();
      submitResult(results.grade.id);

      // 로컬에 기록 저장
      saveRecord({
        testType: 'color-test',
        testName: '색감 테스트',
        result: results.grade.title,
        resultEmoji: results.grade.emoji,
        score: results.score,
        maxScore: results.maxScore,
        percentage: results.percent,
      });

      // 뱃지 체크
      setTimeout(() => checkBadges(), 500);

      // 높은 점수면 confetti
      if (results.percent >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#a855f7', '#d946ef', '#f472b6'],
        });
      }
    }
  }, [phase]);

  // 결과 통계 가져오기
  useEffect(() => {
    if (phase === 'result') {
      const results = getResults();
      getStats(results.grade.id);
    }
  }, [phase]);

  const results = phase === 'result' ? getResults() : null;
  const rarityInfo = results && stats ? getColorRarityInfo(stats.percentage) : null;

  // 시간 프로그레스 계산
  const config = currentRound > 0 ? difficultyLevels[currentRound - 1] : difficultyLevels[0];
  const timePercent = (timeLeft / config.timeLimit) * 100;
  const timeColor = timePercent > 50 ? 'bg-green-500' : timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <>
      <SEO
        title="색감 테스트 - 당신의 색 구분 능력은?"
        description="미세한 색상 차이를 구분할 수 있나요? 15단계 색감 테스트로 당신의 색채 감각을 확인해보세요. 상위 몇 %인지 알아보세요!"
        keywords="색감테스트,색깔테스트,색맹테스트,눈테스트,색채감각,컬러테스트,무료테스트"
      />

      <div className="max-w-lg mx-auto">
        {/* 인트로 화면 */}
        {phase === 'intro' && (
          <div className="text-center space-y-6 animate-fadeIn">
            {/* 메인 비주얼 */}
            <div className="relative py-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-200 via-purple-200 to-fuchsia-200 rounded-3xl opacity-50 blur-xl" />
              <div className="relative">
                <div className="text-8xl mb-4 animate-bounce">🎨</div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">색감 테스트</h1>
                <p className="text-lg text-gray-600">당신의 색 구분 능력은?</p>
              </div>
            </div>

            {/* 참여자 수 */}
            {!totalLoading && totalCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full">
                <span className="text-violet-500">👥</span>
                <span className="text-sm text-violet-700 font-medium">
                  {totalCount.toLocaleString()}명이 테스트했어요!
                </span>
              </div>
            )}

            {/* 설명 카드 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-left space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">테스트 방법</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">1</span>
                  <p className="text-gray-600 text-sm pt-1">여러 색상 타일 중 <span className="font-semibold text-gray-900">다른 하나</span>를 찾으세요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">2</span>
                  <p className="text-gray-600 text-sm pt-1">총 <span className="font-semibold text-gray-900">{TOTAL_ROUNDS}라운드</span>, 점점 어려워져요</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">3</span>
                  <p className="text-gray-600 text-sm pt-1"><span className="font-semibold text-gray-900">빠르게</span> 맞출수록 높은 점수!</p>
                </div>
              </div>
            </div>

            {/* 팁 */}
            <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <p className="text-sm text-amber-800 text-left">{funFact}</p>
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={startGame}
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              테스트 시작하기
            </button>
          </div>
        )}

        {/* 게임 화면 */}
        {phase === 'playing' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 상단 정보 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">라운드</span>
                  <span className="text-xl font-bold text-gray-900">{currentRound}/{TOTAL_ROUNDS}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">점수</span>
                  <span className="text-xl font-bold text-violet-600">{score}</span>
                </div>
                {combo > 1 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse">
                    <span className="text-white text-sm font-bold">{combo} 콤보!</span>
                    <span className="text-lg">🔥</span>
                  </div>
                )}
              </div>

              {/* 시간 바 */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${timeColor} transition-all duration-100`}
                  style={{ width: `${timePercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {(timeLeft / 1000).toFixed(1)}초
              </p>
            </div>

            {/* 난이도 표시 */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                {gridSize}x{gridSize} 격자
                {currentRound > 9 && <span className="text-red-500 font-bold ml-1">극한 난이도!</span>}
              </span>
            </div>

            {/* 타일 그리드 */}
            <div
              className={`grid gap-2 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 ${showFeedback ? (lastRoundCorrect ? 'animate-pulse ring-4 ring-green-400' : 'animate-shake ring-4 ring-red-400') : ''}`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {tiles.map((tile) => (
                <button
                  key={tile.index}
                  onClick={() => !showFeedback && handleTileClick(tile.index)}
                  disabled={showFeedback}
                  className={`aspect-square rounded-xl transition-all duration-200 ${
                    showFeedback && tile.isDifferent
                      ? 'ring-4 ring-green-500 scale-110 z-10'
                      : 'hover:scale-105 active:scale-95'
                  } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    backgroundColor: tile.color,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>

            {/* 피드백 메시지 */}
            {showFeedback && (
              <div className={`text-center py-3 rounded-xl font-bold text-lg ${
                lastRoundCorrect
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              } animate-fadeIn`}>
                {lastRoundCorrect ? (
                  <span>정답! +{gameState.roundResults[gameState.roundResults.length - 1]?.score}점 ✨</span>
                ) : (
                  <span>틀렸어요 😅</span>
                )}
              </div>
            )}

            {/* 힌트 */}
            <p className="text-center text-sm text-gray-400">
              다른 색 하나를 찾아 터치하세요!
            </p>
          </div>
        )}

        {/* 결과 화면 */}
        {phase === 'result' && results && (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 카드 */}
            <div
              id="color-test-result"
              className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${results.grade.bgGradient} text-white shadow-2xl`}
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative text-center space-y-4">
                {/* 희귀도 뱃지 */}
                {rarityInfo && rarityInfo.isRare && (
                  <div className={`inline-flex items-center gap-1 px-3 py-1 ${rarityInfo.badgeColor} rounded-full text-sm font-bold`}>
                    {rarityInfo.badge}
                  </div>
                )}

                {/* 등급 */}
                <div className="text-7xl">{results.grade.emoji}</div>
                <h2 className="text-3xl font-black">{results.grade.title}</h2>
                <p className="text-xl text-white/90">{results.grade.description}</p>

                {/* 점수 */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                    <p className="text-sm text-white/70">점수</p>
                    <p className="text-2xl font-bold">{results.score}<span className="text-sm text-white/70">/{results.maxScore}</span></p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-xl p-3">
                    <p className="text-sm text-white/70">정답률</p>
                    <p className="text-2xl font-bold">{results.correctCount}/{results.totalRounds}</p>
                  </div>
                </div>

                {/* 상세 설명 */}
                <p className="text-sm text-white/80 leading-relaxed bg-black/10 rounded-xl p-4">
                  {results.grade.detailDescription}
                </p>

                {/* 추가 스탯 */}
                <div className="flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-white/60">최대 콤보</p>
                    <p className="font-bold text-lg">{results.maxCombo}🔥</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60">평균 응답</p>
                    <p className="font-bold text-lg">{(results.avgTime / 1000).toFixed(1)}초</p>
                  </div>
                </div>

                {/* 통계 */}
                {!statsLoading && stats && (
                  <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
                    <p className="text-sm text-white/70">
                      {rarityInfo?.message}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {stats.totalCount.toLocaleString()}명 중 {stats.count.toLocaleString()}명이 같은 결과
                    </p>
                  </div>
                )}

                {/* 워터마크 */}
                <p className="text-xs text-white/40 pt-2">
                  viral-site-opal.vercel.app
                </p>
              </div>
            </div>

            {/* 라운드별 결과 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">라운드별 결과</h3>
              <div className="grid grid-cols-5 gap-2">
                {results.roundResults.map((r, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                      r.correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                    title={`${r.round}라운드: ${r.correct ? '정답' : '오답'} (${(r.timeMs / 1000).toFixed(1)}초)`}
                  >
                    {r.correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>

            {/* 공유 버튼 */}
            <ShareButtons
              title={`🎨 색감 테스트 결과: ${results.grade.title}`}
              description={`${results.grade.emoji} ${results.grade.description} (${results.correctCount}/${results.totalRounds} 정답)`}
              captureElementId="color-test-result"
              captureFileName="color-test-result"
            />

            {/* 다시하기 */}
            <button
              onClick={restart}
              className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              다시 테스트하기
            </button>

            {/* 추천 콘텐츠 */}
            <Recommendations currentPath="/color-test" />

            {/* FAQ */}
            <FAQ items={colorTestFAQ} title="색감 테스트 FAQ" />
          </div>
        )}
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      {/* 뱃지 획득 알림 */}
      <BadgeNotification badge={newBadge} onDismiss={dismissNewBadge} />
    </>
  );
}
