import { useState, useEffect, useCallback, useRef } from 'react';
import type { Cell, PlacedShip, GamePhase, AttackResult, ShipType } from './battleshipData';
import { createEmptyGrid, processAttack, isGameOver } from './battleshipData';

const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';

export interface BattleshipPlayer {
  id: string;
  nickname: string;
  isHost: boolean;
  isReady: boolean;
  grid?: Cell[][];
  ships?: PlacedShip[];
  attacks?: { row: number; col: number; result: AttackResult }[];
}

export interface BattleshipRoom {
  id: string;
  hostId: string;
  status: GamePhase;
  currentTurn?: string; // 현재 턴인 플레이어 ID
  winner?: string;
  players: { [playerId: string]: BattleshipPlayer };
  createdAt: number;
  startedAt?: number;
  lastAttack?: {
    attackerId: string;
    row: number;
    col: number;
    result: AttackResult;
    sunkShip?: string;
    timestamp: number;
  };
}

// 랜덤 방 코드 생성 (6자리)
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 플레이어 ID 생성
function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useBattleship() {
  const [room, setRoom] = useState<BattleshipRoom | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로컬 상태 (공격 격자 - 상대방 위치 추적용)
  const [attackGrid, setAttackGrid] = useState<Cell[][]>(createEmptyGrid());

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 방 상태 폴링
  const startPolling = useCallback((roomId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    const fetchRoom = async () => {
      try {
        const response = await fetch(`${FIREBASE_DB_URL}/battleship/${roomId}.json`);
        const data = await response.json();
        if (data) {
          setRoom({ ...data, id: roomId });
        } else {
          setRoom(null);
          setError('방이 존재하지 않습니다');
          stopPolling();
        }
      } catch (err) {
        console.error('Failed to fetch room:', err);
      }
    };

    fetchRoom();
    pollingRef.current = setInterval(fetchRoom, 800); // 0.8초마다 폴링
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // 방 만들기
  const createRoom = useCallback(async (nickname: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const roomId = generateRoomCode();
      const newPlayerId = generatePlayerId();
      setPlayerId(newPlayerId);

      const newRoom: Omit<BattleshipRoom, 'id'> = {
        hostId: newPlayerId,
        status: 'lobby',
        players: {
          [newPlayerId]: {
            id: newPlayerId,
            nickname,
            isHost: true,
            isReady: false,
          },
        },
        createdAt: Date.now(),
      };

      await fetch(`${FIREBASE_DB_URL}/battleship/${roomId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });

      setRoom({ ...newRoom, id: roomId });
      startPolling(roomId);

      return roomId;
    } catch (err) {
      console.error('Failed to create room:', err);
      setError('방 생성에 실패했습니다');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [startPolling]);

  // 방 참가하기
  const joinRoom = useCallback(async (roomId: string, nickname: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${FIREBASE_DB_URL}/battleship/${roomId}.json`);
      const roomData = await response.json();

      if (!roomData) {
        setError('방을 찾을 수 없습니다');
        return false;
      }

      if (roomData.status !== 'lobby') {
        setError('이미 시작된 게임입니다');
        return false;
      }

      const playerCount = Object.keys(roomData.players || {}).length;
      if (playerCount >= 2) {
        setError('방이 가득 찼습니다 (최대 2명)');
        return false;
      }

      const newPlayerId = generatePlayerId();
      setPlayerId(newPlayerId);

      const newPlayer: BattleshipPlayer = {
        id: newPlayerId,
        nickname,
        isHost: false,
        isReady: false,
      };

      await fetch(`${FIREBASE_DB_URL}/battleship/${roomId}/players/${newPlayerId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer),
      });

      startPolling(roomId);
      return true;
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('방 참가에 실패했습니다');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [startPolling]);

  // 배치 완료 (준비 상태로 전환)
  const submitPlacement = useCallback(async (grid: Cell[][], ships: PlacedShip[]): Promise<boolean> => {
    if (!room || !playerId) return false;

    try {
      await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}/players/${playerId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isReady: true,
          grid,
          ships,
          attacks: [],
        }),
      });

      // 두 플레이어 모두 준비되었는지 확인
      const response = await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}/players.json`);
      const players = await response.json();
      const allReady = Object.values(players as { [key: string]: BattleshipPlayer }).every(p => p.isReady);

      if (allReady && Object.keys(players).length === 2) {
        // 게임 시작! 호스트가 먼저
        const hostId = room.hostId;
        await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'battle',
            currentTurn: hostId,
            startedAt: Date.now(),
          }),
        });
      }

      return true;
    } catch (err) {
      console.error('Failed to submit placement:', err);
      return false;
    }
  }, [room, playerId]);

  // 공격하기
  const attack = useCallback(async (row: number, col: number): Promise<{ success: boolean; result?: AttackResult; sunkShip?: ShipType }> => {
    if (!room || !playerId || room.currentTurn !== playerId) {
      return { success: false };
    }

    try {
      // 상대방 찾기
      const opponentId = Object.keys(room.players).find(id => id !== playerId);
      if (!opponentId) return { success: false };

      const opponent = room.players[opponentId];
      if (!opponent.grid || !opponent.ships) return { success: false };

      // 이미 공격한 곳인지 확인
      const existingAttacks = opponent.attacks || [];
      if (existingAttacks.some(a => a.row === row && a.col === col)) {
        return { success: false };
      }

      // 공격 처리
      const { newGrid, newShips, result, sunkShip } = processAttack(
        opponent.grid,
        opponent.ships,
        row,
        col
      );

      // 로컬 공격 격자 업데이트
      setAttackGrid(prev => {
        const newAttackGrid = prev.map(r => r.map(c => ({ ...c })));
        newAttackGrid[row][col].state = result === 'miss' ? 'miss' : result === 'sunk' ? 'sunk' : 'hit';
        return newAttackGrid;
      });

      // Firebase 업데이트
      const newAttack = { row, col, result };

      await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}/players/${opponentId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid: newGrid,
          ships: newShips,
          attacks: [...existingAttacks, newAttack],
        }),
      });

      // 게임 종료 확인
      const gameOver = isGameOver(newShips);

      if (gameOver) {
        await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'finished',
            winner: playerId,
            lastAttack: {
              attackerId: playerId,
              row,
              col,
              result,
              sunkShip: sunkShip?.id,
              timestamp: Date.now(),
            },
          }),
        });
      } else {
        // 턴 교체
        await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentTurn: opponentId,
            lastAttack: {
              attackerId: playerId,
              row,
              col,
              result,
              sunkShip: sunkShip?.id,
              timestamp: Date.now(),
            },
          }),
        });
      }

      return { success: true, result, sunkShip };
    } catch (err) {
      console.error('Failed to attack:', err);
      return { success: false };
    }
  }, [room, playerId]);

  // 방 나가기
  const leaveRoom = useCallback(async () => {
    if (!room || !playerId) return;

    stopPolling();

    try {
      if (room.players[playerId]?.isHost) {
        await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}.json`, {
          method: 'DELETE',
        });
      } else {
        await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}/players/${playerId}.json`, {
          method: 'DELETE',
        });
      }
    } catch (err) {
      console.error('Failed to leave room:', err);
    }

    setRoom(null);
    setPlayerId('');
    setAttackGrid(createEmptyGrid());
  }, [room, playerId, stopPolling]);

  // 게임 시작 (setup 단계로)
  const startSetup = useCallback(async (): Promise<boolean> => {
    if (!room || !playerId) return false;

    const isHost = room.players[playerId]?.isHost;
    if (!isHost) return false;

    try {
      await fetch(`${FIREBASE_DB_URL}/battleship/${room.id}/status.json`, {
        method: 'PUT',
        body: JSON.stringify('setup'),
      });
      return true;
    } catch (err) {
      console.error('Failed to start setup:', err);
      return false;
    }
  }, [room, playerId]);

  // 계산된 값들
  const currentPlayer = room?.players[playerId] || null;
  const isHost = currentPlayer?.isHost || false;
  const players = room ? Object.values(room.players) : [];
  const opponent = room ? Object.values(room.players).find(p => p.id !== playerId) : null;
  const isMyTurn = room?.currentTurn === playerId;
  const isWinner = room?.winner === playerId;

  // 상대방 공격 기록으로 내 격자 상태 업데이트
  useEffect(() => {
    if (currentPlayer?.attacks && currentPlayer.grid) {
      // 공격 격자 업데이트 (상대방 격자에 내가 공격한 흔적)
      const newAttackGrid = createEmptyGrid();
      currentPlayer.attacks.forEach(attack => {
        newAttackGrid[attack.row][attack.col].state =
          attack.result === 'miss' ? 'miss' : attack.result === 'sunk' ? 'sunk' : 'hit';
      });
    }
  }, [currentPlayer?.attacks]);

  // opponent의 공격 기록을 기반으로 attackGrid 동기화
  useEffect(() => {
    if (opponent?.attacks) {
      // 상대방이 공격한 것 = 내가 받은 공격 (myGrid에 표시됨)
      // 내가 공격한 것 = 상대방의 attacks에 기록됨
    }
  }, [opponent?.attacks]);

  return {
    room,
    playerId,
    currentPlayer,
    opponent,
    isHost,
    players,
    isMyTurn,
    isWinner,
    attackGrid,
    isLoading,
    error,
    createRoom,
    joinRoom,
    startSetup,
    submitPlacement,
    attack,
    leaveRoom,
  };
}
