import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { SEO } from '../../components';
import { useBattleship } from './useBattleship';
import { useUserData } from '../../hooks/useLocalStorage';
import { Grid, MiniGrid } from './Grid';
import { ShipPlacer } from './ShipPlacer';
import type { Cell, PlacedShip } from './battleshipData';
import { createEmptyGrid, SHIPS, coordToString } from './battleshipData';

// CSS Icons
const Icons = {
  battleship: (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
      <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
  ),
  users: (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    </div>
  ),
  crown: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2L5 8l-3-2 2 10h12l2-10-3 2-5-6z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  player: (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  trophy: (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-xl mx-auto">
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-1.17a3 3 0 01-5.66 0H6.83A3 3 0 014 10H3.17a3 3 0 01-1-5.83A3 3 0 015 5zm5 0a1 1 0 10-2 0v4a1 1 0 102 0V5zm3 5v3h2v2H5v-2h2v-3a3 3 0 116 0z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
};

export function BattleshipGame() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomCode = searchParams.get('room');

  const { userData } = useUserData();
  const defaultNickname = userData.profile?.nickname || '';

  const [nickname, setNickname] = useState(defaultNickname);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [attackResult, setAttackResult] = useState<{ result: string; coord: string } | null>(null);

  const {
    room,
    playerId,
    currentPlayer,
    opponent,
    isHost,
    players,
    isMyTurn,
    isWinner,
    isLoading,
    error,
    createRoom,
    joinRoom,
    startSetup,
    submitPlacement,
    attack,
    leaveRoom,
  } = useBattleship();

  // 승리 효과
  useEffect(() => {
    if (room?.status === 'finished' && isWinner) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#6366f1', '#8b5cf6'],
      });
    }
  }, [room?.status, isWinner]);

  // 마지막 공격 알림
  useEffect(() => {
    if (room?.lastAttack && room.lastAttack.attackerId !== playerId) {
      const coord = coordToString(room.lastAttack.row, room.lastAttack.col);
      let message = '';
      if (room.lastAttack.result === 'miss') {
        message = `상대방이 ${coord}을 공격했지만 빗나갔습니다!`;
      } else if (room.lastAttack.result === 'hit') {
        message = `${coord} 명중! 배가 피격당했습니다!`;
      } else if (room.lastAttack.result === 'sunk') {
        const sunkShip = SHIPS.find(s => s.id === room.lastAttack?.sunkShip);
        message = `${sunkShip?.nameKo || '배'}가 침몰했습니다!`;
      }
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [room?.lastAttack?.timestamp]);

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const copyCode = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      showNotification('방 코드가 복사되었습니다');
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/battleship?room=${room?.id}`;
    navigator.clipboard.writeText(link);
    showNotification('링크가 복사되었습니다');
  };

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;
    const code = await createRoom(nickname.trim());
    if (code) {
      navigate(`/battleship?room=${code}`, { replace: true });
    }
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim() || !roomCode) return;
    await joinRoom(roomCode, nickname.trim());
  };

  const handleAttack = async (row: number, col: number) => {
    if (!isMyTurn) return;

    const { success, result } = await attack(row, col);
    if (success && result) {
      const coord = coordToString(row, col);
      setAttackResult({ result, coord });
      setTimeout(() => setAttackResult(null), 1500);
    }
  };

  // 상대방 공격 기록을 기반으로 공격 격자 생성
  const getAttackGrid = (): Cell[][] => {
    const grid = createEmptyGrid();
    if (opponent?.attacks) {
      opponent.attacks.forEach(atk => {
        grid[atk.row][atk.col].state = atk.result === 'miss' ? 'miss' : atk.result === 'sunk' ? 'sunk' : 'hit';
      });
    }
    return grid;
  };

  // 침몰한 배 수 계산
  const getSunkCount = (ships?: PlacedShip[]): number => {
    if (!ships) return 0;
    return ships.filter(ship => {
      const shipType = SHIPS.find(s => s.id === ship.shipId);
      return shipType && ship.hits.length === shipType.size;
    }).length;
  };

  return (
    <>
      <SEO
        title="배틀쉽 - 친구와 해전 대결"
        description="친구와 함께 전략적 해전 대결! 상대 함대를 먼저 격침시키면 승리!"
      />

      <div className="max-w-lg mx-auto">
        {/* 로비 - 방 없을 때 */}
        {!room && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">{Icons.battleship}</div>
              <h1 className="text-2xl font-black text-gray-900">배틀쉽</h1>
              <p className="text-gray-500">친구와 전략적 해전 대결!</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
            )}

            {roomCode ? (
              <div className="space-y-3">
                <div className="bg-indigo-50 p-4 rounded-xl text-center">
                  <p className="text-indigo-700 font-medium">방 코드: {roomCode}</p>
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
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isLoading ? '생성 중...' : '방 만들기'}
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>홈으로</span>
            </button>
          </div>
        )}

        {/* 로비 - 대기 중 */}
        {room && room.status === 'lobby' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <p className="text-white/70 text-sm mb-1">방 코드</p>
              <button onClick={copyCode} className="text-3xl font-black tracking-wider hover:scale-105 transition-transform">
                {room.id}
              </button>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all">
                  {Icons.copy}
                  <span>코드 복사</span>
                </button>
                <button onClick={copyLink} className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>링크 복사</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                {Icons.users}
                <span>참가자 ({players.length}/2)</span>
              </h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      player.id === playerId ? 'bg-indigo-50' : 'bg-gray-50'
                    }`}
                  >
                    {index === 0 ? Icons.crown : Icons.player}
                    <span className={`font-medium ${player.id === playerId ? 'text-indigo-600' : 'text-gray-700'}`}>
                      {player.nickname}
                      {player.id === playerId && ' (나)'}
                    </span>
                    {player.isHost && (
                      <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">방장</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isHost && players.length === 2 ? (
              <button
                onClick={startSetup}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                게임 시작!
              </button>
            ) : isHost ? (
              <div className="text-center py-4 text-gray-500">상대방을 기다리는 중...</div>
            ) : (
              <div className="text-center py-4 text-gray-500">방장이 게임을 시작할 때까지 대기 중...</div>
            )}

            <button
              onClick={() => { leaveRoom(); navigate('/battleship'); }}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>나가기</span>
            </button>
          </div>
        )}

        {/* 배치 단계 */}
        {room && room.status === 'setup' && !currentPlayer?.isReady && (
          <div className="space-y-4 animate-fadeIn">
            <ShipPlacer onComplete={submitPlacement} />
          </div>
        )}

        {/* 배치 완료 대기 */}
        {room && room.status === 'setup' && currentPlayer?.isReady && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">배치 완료!</h2>
              <p className="text-white/70">상대방이 배치를 완료할 때까지 대기 중...</p>
            </div>

            {currentPlayer?.grid && (
              <div>
                <p className="text-sm text-gray-500 mb-2">내 함대 배치</p>
                <MiniGrid grid={currentPlayer.grid} showShips />
              </div>
            )}
          </div>
        )}

        {/* 전투 단계 */}
        {room && room.status === 'battle' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 턴 표시 */}
            <div className={`rounded-xl p-4 text-center font-bold ${
              isMyTurn
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isMyTurn ? '내 턴 - 상대 함대를 공격하세요!' : `${opponent?.nickname}의 턴...`}
            </div>

            {/* 공격 결과 표시 */}
            {attackResult && (
              <div className={`text-center py-2 px-4 rounded-xl font-bold animate-bounce ${
                attackResult.result === 'miss' ? 'bg-gray-200 text-gray-600' :
                attackResult.result === 'hit' ? 'bg-red-500 text-white' :
                'bg-red-700 text-white'
              }`}>
                {attackResult.result === 'miss' && `${attackResult.coord} 빗나감!`}
                {attackResult.result === 'hit' && `${attackResult.coord} 명중!`}
                {attackResult.result === 'sunk' && '침몰!'}
              </div>
            )}

            {/* 상대방 격자 (공격용) */}
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                상대 함대 ({getSunkCount(opponent?.ships)}/5 침몰)
              </p>
              <Grid
                grid={getAttackGrid()}
                onCellClick={handleAttack}
                isOpponentGrid
                disabled={!isMyTurn}
                showShips={false}
                lastAttack={room.lastAttack && room.lastAttack.attackerId === playerId ? { row: room.lastAttack.row, col: room.lastAttack.col } : null}
              />
            </div>

            {/* 내 격자 */}
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                내 함대 ({getSunkCount(currentPlayer?.ships)}/5 침몰)
              </p>
              {currentPlayer?.grid && (
                <Grid
                  grid={currentPlayer.grid}
                  ships={currentPlayer.ships}
                  disabled
                  showShips
                  lastAttack={room.lastAttack && room.lastAttack.attackerId !== playerId ? { row: room.lastAttack.row, col: room.lastAttack.col } : null}
                />
              )}
            </div>
          </div>
        )}

        {/* 게임 종료 */}
        {room && room.status === 'finished' && (
          <div className="space-y-6 animate-fadeIn">
            <div className={`rounded-3xl p-8 text-white text-center ${
              isWinner
                ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                : 'bg-gradient-to-br from-gray-500 to-gray-700'
            }`}>
              {isWinner ? Icons.trophy : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <h2 className="text-3xl font-black mt-4">{isWinner ? '승리!' : '패배...'}</h2>
              <p className="text-white/80 mt-2">
                {isWinner
                  ? '상대 함대를 모두 격침시켰습니다!'
                  : '내 함대가 모두 침몰했습니다.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">최종 결과</h3>
              <div className="space-y-2">
                {players.map(player => (
                  <div key={player.id} className={`p-3 rounded-xl flex items-center justify-between ${
                    player.id === room.winner ? 'bg-amber-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      {player.id === room.winner ? Icons.crown : Icons.player}
                      <span className="font-medium">{player.nickname}</span>
                      {player.id === playerId && <span className="text-gray-400">(나)</span>}
                    </div>
                    <span className={`font-bold ${player.id === room.winner ? 'text-amber-600' : 'text-gray-500'}`}>
                      {player.id === room.winner ? '승리' : '패배'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { leaveRoom(); navigate('/battleship'); }}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>다시 하기</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3.5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>홈으로</span>
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg max-w-xs">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      </div>
    </>
  );
}
