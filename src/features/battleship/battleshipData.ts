// 배 종류 정의
export interface ShipType {
  id: string;
  name: string;
  nameKo: string;
  size: number;
  color: string;
  gradient: string;
}

export const SHIPS: ShipType[] = [
  {
    id: 'carrier',
    name: 'Carrier',
    nameKo: '항공모함',
    size: 5,
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'battleship',
    name: 'Battleship',
    nameKo: '전함',
    size: 4,
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'cruiser',
    name: 'Cruiser',
    nameKo: '순양함',
    size: 3,
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'submarine',
    name: 'Submarine',
    nameKo: '잠수함',
    size: 3,
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'destroyer',
    name: 'Destroyer',
    nameKo: '구축함',
    size: 2,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
  },
];

// 격자 크기
export const GRID_SIZE = 10;

// 셀 상태
export type CellState =
  | 'empty'      // 빈 칸
  | 'ship'       // 배가 있는 칸 (자신의 격자)
  | 'hit'        // 명중
  | 'miss'       // 빗나감
  | 'sunk';      // 침몰 (배 전체가 명중)

// 배 배치 정보
export interface PlacedShip {
  shipId: string;
  startRow: number;
  startCol: number;
  isHorizontal: boolean;
  hits: number[];  // 맞은 위치 인덱스
}

// 공격 결과
export type AttackResult = 'miss' | 'hit' | 'sunk';

// 격자판 셀
export interface Cell {
  row: number;
  col: number;
  state: CellState;
  shipId?: string;
}

// 게임 단계
export type GamePhase = 'lobby' | 'setup' | 'battle' | 'finished';

// 행 라벨 (A-J)
export const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// 열 라벨 (1-10)
export const COL_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// 좌표를 문자열로 변환 (예: "B5")
export function coordToString(row: number, col: number): string {
  return `${ROW_LABELS[row]}${COL_LABELS[col]}`;
}

// 문자열을 좌표로 변환
export function stringToCoord(str: string): { row: number; col: number } | null {
  if (str.length < 2 || str.length > 3) return null;

  const rowChar = str[0].toUpperCase();
  const colStr = str.slice(1);

  const row = ROW_LABELS.indexOf(rowChar);
  const col = parseInt(colStr, 10) - 1;

  if (row === -1 || isNaN(col) || col < 0 || col >= GRID_SIZE) {
    return null;
  }

  return { row, col };
}

// 빈 격자 생성
export function createEmptyGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = { row, col, state: 'empty' };
    }
  }
  return grid;
}

// 배 배치 가능 여부 확인
export function canPlaceShip(
  grid: Cell[][],
  ship: ShipType,
  startRow: number,
  startCol: number,
  isHorizontal: boolean
): boolean {
  for (let i = 0; i < ship.size; i++) {
    const row = isHorizontal ? startRow : startRow + i;
    const col = isHorizontal ? startCol + i : startCol;

    // 격자 범위 체크
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
      return false;
    }

    // 다른 배와 겹치는지 체크
    if (grid[row][col].state === 'ship') {
      return false;
    }
  }
  return true;
}

// 배 배치
export function placeShip(
  grid: Cell[][],
  ship: ShipType,
  startRow: number,
  startCol: number,
  isHorizontal: boolean
): Cell[][] {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

  for (let i = 0; i < ship.size; i++) {
    const row = isHorizontal ? startRow : startRow + i;
    const col = isHorizontal ? startCol + i : startCol;
    newGrid[row][col] = { row, col, state: 'ship', shipId: ship.id };
  }

  return newGrid;
}

// 랜덤 배치
export function randomPlaceShips(): { grid: Cell[][]; ships: PlacedShip[] } {
  let grid = createEmptyGrid();
  const placedShips: PlacedShip[] = [];

  for (const ship of SHIPS) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const isHorizontal = Math.random() > 0.5;
      const maxRow = isHorizontal ? GRID_SIZE : GRID_SIZE - ship.size;
      const maxCol = isHorizontal ? GRID_SIZE - ship.size : GRID_SIZE;

      const startRow = Math.floor(Math.random() * maxRow);
      const startCol = Math.floor(Math.random() * maxCol);

      if (canPlaceShip(grid, ship, startRow, startCol, isHorizontal)) {
        grid = placeShip(grid, ship, startRow, startCol, isHorizontal);
        placedShips.push({
          shipId: ship.id,
          startRow,
          startCol,
          isHorizontal,
          hits: [],
        });
        placed = true;
      }
      attempts++;
    }
  }

  return { grid, ships: placedShips };
}

// 공격 처리
export function processAttack(
  grid: Cell[][],
  ships: PlacedShip[],
  row: number,
  col: number
): { newGrid: Cell[][]; newShips: PlacedShip[]; result: AttackResult; sunkShip?: ShipType } {
  const newGrid = grid.map(r => r.map(c => ({ ...c })));
  const newShips = ships.map(s => ({ ...s, hits: [...s.hits] }));

  const cell = newGrid[row][col];

  if (cell.state === 'ship') {
    // 명중!
    cell.state = 'hit';

    // 어떤 배가 맞았는지 확인
    const shipId = cell.shipId;
    const hitShip = newShips.find(s => s.shipId === shipId);
    const shipType = SHIPS.find(s => s.id === shipId);

    if (hitShip && shipType) {
      // 맞은 위치 계산
      const hitIndex = hitShip.isHorizontal
        ? col - hitShip.startCol
        : row - hitShip.startRow;
      hitShip.hits.push(hitIndex);

      // 침몰 확인
      if (hitShip.hits.length === shipType.size) {
        // 배가 침몰! 모든 셀을 sunk로 변경
        for (let i = 0; i < shipType.size; i++) {
          const r = hitShip.isHorizontal ? hitShip.startRow : hitShip.startRow + i;
          const c = hitShip.isHorizontal ? hitShip.startCol + i : hitShip.startCol;
          newGrid[r][c].state = 'sunk';
        }
        return { newGrid, newShips, result: 'sunk', sunkShip: shipType };
      }
    }

    return { newGrid, newShips, result: 'hit' };
  } else {
    // 빗나감
    cell.state = 'miss';
    return { newGrid, newShips, result: 'miss' };
  }
}

// 게임 종료 확인 (모든 배가 침몰했는지)
export function isGameOver(ships: PlacedShip[]): boolean {
  return ships.every(ship => {
    const shipType = SHIPS.find(s => s.id === ship.shipId);
    return shipType && ship.hits.length === shipType.size;
  });
}
