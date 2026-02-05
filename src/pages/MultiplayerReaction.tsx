import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { SEO } from '../components';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { useUserData } from '../hooks/useLocalStorage';
import {
  TOTAL_ROUNDS,
  MIN_WAIT_TIME,
  MAX_WAIT_TIME,
  getGradeByMs,
} from '../features/reaction-test/reactionTestData';

type GamePhase = 'lobby' | 'waiting' | 'ready' | 'result' | 'tooEarly' | 'final' | 'compare';

interface RoundResult {
  round: number;
  reactionTime: number;
}

export function MultiplayerReaction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomCode = searchParams.get('room');

  const { userData } = useUserData();
  const defaultNickname = userData.profile?.nickname || '';

  const [nickname, setNickname] = useState(defaultNickname);
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState(0);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    room,
    playerId,
    isHost,
    players,
    sortedResults,
    isLoading,
    error,
    createRoom,
    joinRoom,
    startGame,
    submitResult,
    leaveRoom,
  } = useMultiplayer('reaction-test');

  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 게임 상태 변화 감지
  useEffect(() => {
    if (room?.status === 'playing' && phase === 'lobby') {
      // 게임 시작됨
      setCurrentRound(1);
      setResults([]);
      startRound();
    }
    if (room?.status === 'finished' && phase !== 'compare') {
      setPhase('compare');
      // 1등이면 confetti
      if (sortedResults[0]?.id === playerId) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
        });
      }
    }
  }, [room?.status]);

  // 라운드 시작
  const startRound = useCallback(() => {
    clearTimer();
    setPhase('waiting');

    const waitTime = MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);
    timeoutRef.current = setTimeout(() => {
      setPhase('ready');
      startTimeRef.current = performance.now();
    }, waitTime);
  }, [clearTimer]);

  // 화면 클릭 처리
  const handleClick = () => {
    if (phase === 'waiting') {
      clearTimer();
      setPhase('tooEarly');
    } else if (phase === 'ready') {
      const reactionTime = Math.round(performance.now() - startTimeRef.current);
      setCurrentReactionTime(reactionTime);

      const newResult: RoundResult = { round: currentRound, reactionTime };
      setResults(prev => [...prev, newResult]);
      setPhase('result');
    }
  };

  // 다음 라운드
  const handleNext = () => {
    if (currentRound >= TOTAL_ROUNDS) {
      // 게임 종료 - 결과 제출
      const avgTime = Math.round(results.reduce((a, b) => a + b.reactionTime, 0) / results.length);
      const grade = getGradeByMs(avgTime);
      submitResult(avgTime, grade.title);
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

  // 방 만들기
  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;
    const code = await createRoom(nickname.trim());
    if (code) {
      navigate(`/play/reaction?room=${code}`, { replace: true });
    }
  };

  // 방 참가
  const handleJoinRoom = async () => {
    if (!nickname.trim() || !roomCode) return;
    const success = await joinRoom(roomCode, nickname.trim());
    if (!success) {
      // 에러 표시됨
    }
  };

  // 링크 복사
  const copyLink = () => {
    const link = `${window.location.origin}/play/reaction?room=${room?.id}`;
    navigator.clipboard.writeText(link);
  };

  // 게임 결과 계산
  const getMyResult = () => {
    if (results.length === 0) return null;
    const times = results.map(r => r.reactionTime);
    const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const bestTime = Math.min(...times);
    const grade = getGradeByMs(avgTime);
    return { avgTime, bestTime, grade };
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearTimer();
      // 방 나가기는 명시적으로 호출해야 함
    };
  }, [clearTimer]);

  // 자동 참가 (URL에 room이 있는 경우)
  useEffect(() => {
    if (roomCode && !room && nickname && phase === 'lobby') {
      // 닉네임이 있으면 자동 참가 시도
    }
  }, [roomCode, room, nickname, phase]);

  return (
    <>
      <SEO
        title="같이하기 - 반응속도 대결"
        description="친구와 함께 반응속도 대결! 누가 더 빠른지 겨뤄보세요!"
      />

      <div className="max-w-lg mx-auto">
        {/* 로비 화면 */}
        {phase === 'lobby' && !room && (
          <div className="space-y-6 animate-fadeIn">
            {/* 헤더 */}
            <div className="text-center py-6">
              <div className="text-6xl mb-4">👥⚡</div>
              <h1 className="text-2xl font-black text-gray-900">같이하기</h1>
              <p className="text-gray-500">친구와 반응속도 대결!</p>
            </div>

            {/* 닉네임 입력 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* 방 만들기 또는 참가 */}
            {roomCode ? (
              <div className="space-y-3">
                <div className="bg-amber-50 p-4 rounded-xl text-center">
                  <p className="text-amber-700 font-medium">방 코드: {roomCode}</p>
                </div>
                <button
                  onClick={handleJoinRoom}
                  disabled={!nickname.trim() || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? '참가 중...' : '방 참가하기'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateRoom}
                disabled={!nickname.trim() || isLoading}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isLoading ? '생성 중...' : '방 만들기'}
              </button>
            )}

            {/* 돌아가기 */}
            <button
              onClick={() => navigate('/reaction-test')}
              className="w-full py-3 text-gray-500 hover:text-gray-700"
            >
              혼자 하기
            </button>
          </div>
        )}

        {/* 대기실 */}
        {phase === 'lobby' && room && room.status === 'waiting' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 방 정보 */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <p className="text-white/70 text-sm mb-1">방 코드</p>
              <p className="text-3xl font-black tracking-wider">{room.id}</p>
              <button
                onClick={copyLink}
                className="mt-3 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
              >
                📋 링크 복사
              </button>
            </div>

            {/* 참가자 목록 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>👥</span> 참가자 ({players.length}/4)
              </h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.id === playerId ? 'bg-violet-50' : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">
                      {index === 0 ? '👑' : '👤'}
                    </span>
                    <span className={`font-medium ${player.id === playerId ? 'text-violet-600' : 'text-gray-700'}`}>
                      {player.nickname}
                      {player.id === playerId && ' (나)'}
                    </span>
                    {player.isHost && (
                      <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        방장
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 시작 버튼 (호스트만) */}
            {isHost ? (
              <button
                onClick={startGame}
                disabled={players.length < 2}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {players.length < 2 ? '최소 2명 필요' : '게임 시작!'}
              </button>
            ) : (
              <div className="text-center py-4 text-gray-500">
                방장이 게임을 시작할 때까지 대기 중...
              </div>
            )}

            {/* 나가기 */}
            <button
              onClick={() => {
                leaveRoom();
                navigate('/play/reaction');
              }}
              className="w-full py-3 text-red-500 hover:text-red-600"
            >
              나가기
            </button>
          </div>
        )}

        {/* 게임 진행 중 */}
        {(phase === 'waiting' || phase === 'ready' || phase === 'result' || phase === 'tooEarly') && (
          <div className="space-y-4">
            {/* 상단 정보 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Round {currentRound}/{TOTAL_ROUNDS}</span>
                <div className="flex -space-x-2">
                  {players.map((p) => (
                    <div
                      key={p.id}
                      className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600 border-2 border-white"
                      title={p.nickname}
                    >
                      {p.nickname.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 대기 화면 */}
            {phase === 'waiting' && (
              <div onClick={handleClick} className="cursor-pointer">
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center shadow-2xl">
                  <div className="text-6xl mb-6 animate-pulse">🔴</div>
                  <p className="text-white text-2xl font-bold">대기...</p>
                </div>
              </div>
            )}

            {/* 준비 화면 */}
            {phase === 'ready' && (
              <div onClick={handleClick} className="cursor-pointer">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center shadow-2xl animate-pulse">
                  <div className="text-6xl mb-6">🟢</div>
                  <p className="text-white text-3xl font-black">지금!</p>
                </div>
              </div>
            )}

            {/* Too Early */}
            {phase === 'tooEarly' && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 min-h-[250px] flex flex-col items-center justify-center shadow-2xl">
                  <div className="text-6xl mb-4">😅</div>
                  <p className="text-white text-2xl font-bold">Too Early!</p>
                </div>
                <button onClick={handleRetry} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold">
                  다시 시도
                </button>
              </div>
            )}

            {/* 라운드 결과 */}
            {phase === 'result' && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 shadow-2xl">
                  <p className="text-white/80 text-sm mb-2">Round {currentRound}</p>
                  <p className="text-5xl font-black text-white">{currentReactionTime}ms</p>
                </div>
                <button onClick={handleNext} className="w-full py-4 bg-violet-500 text-white rounded-2xl font-bold">
                  {currentRound >= TOTAL_ROUNDS ? '완료!' : '다음'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 내 결과 완료, 다른 플레이어 대기 */}
        {phase === 'final' && room?.status === 'playing' && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">완료!</h2>
              <p className="text-4xl font-black">{getMyResult()?.avgTime}ms</p>
              <p className="text-white/70 mt-2">다른 플레이어를 기다리는 중...</p>
            </div>
            <div className="flex justify-center gap-2">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                    p.result ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 animate-pulse'
                  }`}
                >
                  {p.result ? '✓' : '⏳'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 최종 결과 비교 */}
        {phase === 'compare' && room?.status === 'finished' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 승자 */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white text-center">
              <div className="text-6xl mb-2">🏆</div>
              <p className="text-white/80 text-sm">승자</p>
              <p className="text-3xl font-black">{sortedResults[0]?.nickname}</p>
              <p className="text-2xl font-bold mt-1">{sortedResults[0]?.result?.score}ms</p>
            </div>

            {/* 순위 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">🏅 최종 순위</h3>
              <div className="space-y-2">
                {sortedResults.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.id === playerId ? 'bg-violet-50 ring-2 ring-violet-300' : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </span>
                    <span className="font-medium flex-1">
                      {player.nickname}
                      {player.id === playerId && ' (나)'}
                    </span>
                    <span className="font-bold text-gray-700">{player.result?.score}ms</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼들 */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  leaveRoom();
                  navigate('/play/reaction');
                }}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold"
              >
                다시 하기
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 text-gray-500"
              >
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
