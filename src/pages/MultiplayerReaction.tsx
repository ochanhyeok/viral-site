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

// CSS Icons
const Icons = {
  // 멀티플레이 헤더 아이콘
  multiplayer: (
    <div className="flex items-center gap-2">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  ),
  // 복사 아이콘
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  // 참가자 아이콘
  users: (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    </div>
  ),
  // 방장 크라운
  crown: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2L5 8l-3-2 2 10h12l2-10-3 2-5-6z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  // 일반 플레이어
  player: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  // 트로피
  trophy: (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-xl mx-auto">
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-1.17a3 3 0 01-5.66 0H6.83A3 3 0 014 10H3.17a3 3 0 01-1-5.83A3 3 0 015 5zm5 0a1 1 0 10-2 0v4a1 1 0 102 0V5zm3 5v3h2v2H5v-2h2v-3a3 3 0 116 0z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  // 메달
  gold: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md text-white font-bold text-sm">1</div>
  ),
  silver: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md text-white font-bold text-sm">2</div>
  ),
  bronze: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-md text-white font-bold text-sm">3</div>
  ),
  // 랭킹 아이콘
  ranking: (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
  ),
  // 완료 체크
  check: (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
  // 대기 중
  waiting: (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  ),
  // 완료됨
  done: (
    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  ),
};

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
    setToastMessage('링크가 복사되었습니다');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 코드 복사
  const copyCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      setToastMessage('방 코드가 복사되었습니다');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
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
              <div className="flex justify-center mb-4">{Icons.multiplayer}</div>
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

            {/* 혼자하기 */}
            <button
              onClick={() => navigate('/reaction-test')}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-xl font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>혼자 하기</span>
            </button>
          </div>
        )}

        {/* 대기실 */}
        {phase === 'lobby' && room && room.status === 'waiting' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 방 정보 */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <p className="text-white/70 text-sm mb-1">방 코드</p>
              <button
                onClick={copyCode}
                className="text-3xl font-black tracking-wider hover:scale-105 transition-transform cursor-pointer"
              >
                {room.id}
              </button>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
                >
                  {Icons.copy}
                  <span>코드 복사</span>
                </button>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>링크 복사</span>
                </button>
              </div>
            </div>

            {/* 참가자 목록 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                {Icons.users}
                <span>참가자 ({players.length}/4)</span>
              </h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.id === playerId ? 'bg-violet-50' : 'bg-gray-50'
                    }`}
                  >
                    {index === 0 ? Icons.crown : Icons.player}
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
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-xl font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>나가기</span>
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
              <div onClick={handleClick} onTouchEnd={(e) => { e.preventDefault(); handleClick(); }} className="cursor-pointer select-none">
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center shadow-2xl">
                  <div className="w-20 h-20 rounded-full bg-red-400/50 flex items-center justify-center mb-6 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-white/90 shadow-inner"></div>
                  </div>
                  <p className="text-white text-2xl font-bold">대기...</p>
                </div>
              </div>
            )}

            {/* 준비 화면 */}
            {phase === 'ready' && (
              <div onClick={handleClick} onTouchEnd={(e) => { e.preventDefault(); handleClick(); }} className="cursor-pointer select-none">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center shadow-2xl animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-green-300/50 flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg"></div>
                  </div>
                  <p className="text-white text-3xl font-black">지금!</p>
                </div>
              </div>
            )}

            {/* Too Early */}
            {phase === 'tooEarly' && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 min-h-[250px] flex flex-col items-center justify-center shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
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
              <div className="flex justify-center mb-4">{Icons.check}</div>
              <h2 className="text-2xl font-bold mb-2">완료!</h2>
              <p className="text-4xl font-black">{getMyResult()?.avgTime}ms</p>
              <p className="text-white/70 mt-2">다른 플레이어를 기다리는 중...</p>
            </div>
            <div className="flex justify-center gap-2">
              {players.map((p) => (
                <div key={p.id}>
                  {p.result ? Icons.done : Icons.waiting}
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
              {Icons.trophy}
              <p className="text-white/80 text-sm mt-3">승자</p>
              <p className="text-3xl font-black">{sortedResults[0]?.nickname}</p>
              <p className="text-2xl font-bold mt-1">{sortedResults[0]?.result?.score}ms</p>
            </div>

            {/* 순위 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                {Icons.ranking}
                <span>최종 순위</span>
              </h3>
              <div className="space-y-2">
                {sortedResults.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.id === playerId ? 'bg-violet-50 ring-2 ring-violet-300' : 'bg-gray-50'
                    }`}
                  >
                    {index === 0 ? Icons.gold : index === 1 ? Icons.silver : index === 2 ? Icons.bronze : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">{index + 1}</div>
                    )}
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
            {/* 버튼들 */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  leaveRoom();
                  navigate('/play/reaction');
                }}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>다시 하기</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3.5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-xl font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>홈으로</span>
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
            showToast
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toastMessage}
          </div>
        </div>
      </div>
    </>
  );
}
