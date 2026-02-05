import { useState, useCallback, useEffect, useRef } from 'react';
import { difficultyLevels, TOTAL_ROUNDS, getGradeByPercent, MAX_TOTAL_SCORE } from './colorTestData';

export interface GameTile {
  index: number;
  color: string;
  isDifferent: boolean;
}

export interface RoundResult {
  round: number;
  correct: boolean;
  timeMs: number;
  score: number;
}

export interface GameState {
  phase: 'intro' | 'playing' | 'result';
  currentRound: number;
  score: number;
  combo: number;
  maxCombo: number;
  tiles: GameTile[];
  gridSize: number;
  differentIndex: number;
  roundStartTime: number;
  timeLeft: number;
  roundResults: RoundResult[];
  lastRoundCorrect: boolean | null;
  showFeedback: boolean;
}

// HSL 색상 생성 함수
function generateBaseColor(): { h: number; s: number; l: number } {
  return {
    h: Math.floor(Math.random() * 360),
    s: 40 + Math.floor(Math.random() * 40), // 40-80%
    l: 35 + Math.floor(Math.random() * 30), // 35-65%
  };
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// 다른 색상 생성 (난이도에 따라 차이 조절)
function generateDifferentColor(
  base: { h: number; s: number; l: number },
  hueDiff: number,
  satDiff: number,
  lightDiff: number
): { h: number; s: number; l: number } {
  // 랜덤하게 hue, saturation, lightness 중 하나 또는 조합을 변경
  const changeType = Math.floor(Math.random() * 3);

  let newH = base.h;
  let newS = base.s;
  let newL = base.l;

  const direction = Math.random() > 0.5 ? 1 : -1;

  switch (changeType) {
    case 0: // Hue 변경
      newH = (base.h + hueDiff * direction + 360) % 360;
      break;
    case 1: // Saturation 변경
      newS = Math.max(10, Math.min(90, base.s + satDiff * direction));
      break;
    case 2: // Lightness 변경
      newL = Math.max(20, Math.min(80, base.l + lightDiff * direction));
      break;
  }

  return { h: newH, s: newS, l: newL };
}

export function useColorTest() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'intro',
    currentRound: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    tiles: [],
    gridSize: 3,
    differentIndex: 0,
    roundStartTime: 0,
    timeLeft: 10000,
    roundResults: [],
    lastRoundCorrect: null,
    showFeedback: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 타이머 정리
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  // 새 라운드 생성
  const generateRound = useCallback((roundIndex: number) => {
    const config = difficultyLevels[roundIndex];
    const { gridSize, hueDiff, satDiff, lightDiff, timeLimit } = config;
    const totalTiles = gridSize * gridSize;

    const baseColor = generateBaseColor();
    const differentColor = generateDifferentColor(baseColor, hueDiff, satDiff, lightDiff);
    const differentIndex = Math.floor(Math.random() * totalTiles);

    const tiles: GameTile[] = [];
    for (let i = 0; i < totalTiles; i++) {
      const isDifferent = i === differentIndex;
      const color = isDifferent
        ? hslToString(differentColor.h, differentColor.s, differentColor.l)
        : hslToString(baseColor.h, baseColor.s, baseColor.l);

      tiles.push({ index: i, color, isDifferent });
    }

    return { tiles, gridSize, differentIndex, timeLimit };
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    clearTimers();
    const { tiles, gridSize, differentIndex, timeLimit } = generateRound(0);

    setGameState({
      phase: 'playing',
      currentRound: 1,
      score: 0,
      combo: 0,
      maxCombo: 0,
      tiles,
      gridSize,
      differentIndex,
      roundStartTime: Date.now(),
      timeLeft: timeLimit,
      roundResults: [],
      lastRoundCorrect: null,
      showFeedback: false,
    });
  }, [generateRound, clearTimers]);

  // 타일 클릭 처리
  const handleTileClick = useCallback((tileIndex: number) => {
    setGameState(prev => {
      if (prev.phase !== 'playing' || prev.showFeedback) return prev;

      const timeMs = Date.now() - prev.roundStartTime;
      const isCorrect = tileIndex === prev.differentIndex;

      // 점수 계산
      let roundScore = 0;
      if (isCorrect) {
        const baseScore = 100;
        // 속도 보너스: 3초 이내 최대 50점
        const speedBonus = Math.max(0, Math.floor((1 - timeMs / 3000) * 50));
        roundScore = baseScore + speedBonus;
      }

      const newCombo = isCorrect ? prev.combo + 1 : 0;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);

      const roundResult: RoundResult = {
        round: prev.currentRound,
        correct: isCorrect,
        timeMs,
        score: roundScore,
      };

      return {
        ...prev,
        score: prev.score + roundScore,
        combo: newCombo,
        maxCombo: newMaxCombo,
        roundResults: [...prev.roundResults, roundResult],
        lastRoundCorrect: isCorrect,
        showFeedback: true,
      };
    });
  }, []);

  // 피드백 후 다음 라운드로 진행
  useEffect(() => {
    if (gameState.showFeedback && gameState.phase === 'playing') {
      feedbackTimeoutRef.current = setTimeout(() => {
        setGameState(prev => {
          if (prev.currentRound >= TOTAL_ROUNDS) {
            // 게임 종료
            return { ...prev, phase: 'result', showFeedback: false };
          }

          // 다음 라운드
          const { tiles, gridSize, differentIndex, timeLimit } = generateRound(prev.currentRound);
          return {
            ...prev,
            currentRound: prev.currentRound + 1,
            tiles,
            gridSize,
            differentIndex,
            roundStartTime: Date.now(),
            timeLeft: timeLimit,
            showFeedback: false,
            lastRoundCorrect: null,
          };
        });
      }, 800); // 피드백 표시 시간
    }

    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [gameState.showFeedback, gameState.phase, generateRound]);

  // 타이머 업데이트
  useEffect(() => {
    if (gameState.phase === 'playing' && !gameState.showFeedback) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const elapsed = Date.now() - prev.roundStartTime;
          const config = difficultyLevels[prev.currentRound - 1];
          const newTimeLeft = Math.max(0, config.timeLimit - elapsed);

          if (newTimeLeft === 0) {
            // 시간 초과 - 오답 처리
            const roundResult: RoundResult = {
              round: prev.currentRound,
              correct: false,
              timeMs: config.timeLimit,
              score: 0,
            };

            return {
              ...prev,
              timeLeft: 0,
              combo: 0,
              roundResults: [...prev.roundResults, roundResult],
              lastRoundCorrect: false,
              showFeedback: true,
            };
          }

          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 50);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.phase, gameState.showFeedback, gameState.currentRound]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // 결과 계산
  const getResults = useCallback(() => {
    const { score, roundResults, maxCombo } = gameState;
    const correctCount = roundResults.filter(r => r.correct).length;
    const percent = Math.round((score / MAX_TOTAL_SCORE) * 100);
    const grade = getGradeByPercent(percent);
    const avgTime = roundResults.length > 0
      ? Math.round(roundResults.reduce((acc, r) => acc + r.timeMs, 0) / roundResults.length)
      : 0;

    return {
      score,
      maxScore: MAX_TOTAL_SCORE,
      percent,
      grade,
      correctCount,
      totalRounds: TOTAL_ROUNDS,
      maxCombo,
      avgTime,
      roundResults,
    };
  }, [gameState]);

  // 재시작
  const restart = useCallback(() => {
    clearTimers();
    setGameState({
      phase: 'intro',
      currentRound: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      tiles: [],
      gridSize: 3,
      differentIndex: 0,
      roundStartTime: 0,
      timeLeft: 10000,
      roundResults: [],
      lastRoundCorrect: null,
      showFeedback: false,
    });
  }, [clearTimers]);

  return {
    gameState,
    startGame,
    handleTileClick,
    getResults,
    restart,
  };
}
