import { useState, useEffect, useCallback, useRef } from 'react';

const FIREBASE_DB_URL = 'https://viral-site-3275f-default-rtdb.asia-southeast1.firebasedatabase.app';

export interface Player {
  id: string;
  nickname: string;
  isHost: boolean;
  isReady: boolean;
  result?: {
    score: number;
    grade: string;
    completedAt: number;
  };
}

export interface Room {
  id: string;
  testType: string;
  hostId: string;
  status: 'waiting' | 'playing' | 'finished';
  players: { [playerId: string]: Player };
  createdAt: number;
  startedAt?: number;
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

export function useMultiplayer(testType: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 방 상태 폴링
  const startPolling = useCallback((roomId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    const fetchRoom = async () => {
      try {
        const response = await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}.json`);
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

    fetchRoom(); // 즉시 한 번 실행
    pollingRef.current = setInterval(fetchRoom, 1000); // 1초마다 폴링
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
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

      const newRoom: Omit<Room, 'id'> = {
        testType,
        hostId: newPlayerId,
        status: 'waiting',
        players: {
          [newPlayerId]: {
            id: newPlayerId,
            nickname,
            isHost: true,
            isReady: true,
          },
        },
        createdAt: Date.now(),
      };

      await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}.json`, {
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
  }, [testType, startPolling]);

  // 방 참가하기
  const joinRoom = useCallback(async (roomId: string, nickname: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // 방 존재 확인
      const response = await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}.json`);
      const roomData = await response.json();

      if (!roomData) {
        setError('방을 찾을 수 없습니다');
        return false;
      }

      if (roomData.status !== 'waiting') {
        setError('이미 시작된 게임입니다');
        return false;
      }

      const playerCount = Object.keys(roomData.players || {}).length;
      if (playerCount >= 4) {
        setError('방이 가득 찼습니다 (최대 4명)');
        return false;
      }

      // 플레이어 추가
      const newPlayerId = generatePlayerId();
      setPlayerId(newPlayerId);

      const newPlayer: Player = {
        id: newPlayerId,
        nickname,
        isHost: false,
        isReady: true,
      };

      await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}/players/${newPlayerId}.json`, {
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

  // 게임 시작 (호스트만)
  const startGame = useCallback(async (): Promise<boolean> => {
    if (!room || !playerId) return false;

    const isHost = room.players[playerId]?.isHost;
    if (!isHost) return false;

    try {
      await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}/status.json`, {
        method: 'PUT',
        body: JSON.stringify('playing'),
      });

      await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}/startedAt.json`, {
        method: 'PUT',
        body: JSON.stringify(Date.now()),
      });

      return true;
    } catch (err) {
      console.error('Failed to start game:', err);
      return false;
    }
  }, [room, playerId]);

  // 결과 제출
  const submitResult = useCallback(async (score: number, grade: string): Promise<boolean> => {
    if (!room || !playerId) return false;

    try {
      const result = {
        score,
        grade,
        completedAt: Date.now(),
      };

      await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}/players/${playerId}/result.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      // 모든 플레이어가 완료했는지 확인
      const response = await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}/players.json`);
      const players = await response.json();

      const allCompleted = Object.values(players as { [key: string]: Player }).every(
        p => p.result !== undefined
      );

      if (allCompleted) {
        await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}/status.json`, {
          method: 'PUT',
          body: JSON.stringify('finished'),
        });
      }

      return true;
    } catch (err) {
      console.error('Failed to submit result:', err);
      return false;
    }
  }, [room, playerId]);

  // 방 나가기
  const leaveRoom = useCallback(async () => {
    if (!room || !playerId) return;

    stopPolling();

    try {
      // 호스트가 나가면 방 삭제
      if (room.players[playerId]?.isHost) {
        await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}.json`, {
          method: 'DELETE',
        });
      } else {
        // 플레이어만 삭제
        await fetch(`${FIREBASE_DB_URL}/rooms/${room.id}/players/${playerId}.json`, {
          method: 'DELETE',
        });
      }
    } catch (err) {
      console.error('Failed to leave room:', err);
    }

    setRoom(null);
    setPlayerId('');
  }, [room, playerId, stopPolling]);

  // 현재 플레이어 정보
  const currentPlayer = room?.players[playerId] || null;
  const isHost = currentPlayer?.isHost || false;
  const players = room ? Object.values(room.players) : [];

  // 결과 정렬 (반응속도는 낮을수록 좋음)
  const sortedResults = room?.status === 'finished'
    ? players
        .filter(p => p.result)
        .sort((a, b) => (a.result?.score || 0) - (b.result?.score || 0))
    : [];

  return {
    room,
    playerId,
    currentPlayer,
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
  };
}
