import { useState, useCallback } from 'react';
import type { Cell, PlacedShip, ShipType } from './battleshipData';
import {
  SHIPS,
  GRID_SIZE,
  ROW_LABELS,
  COL_LABELS,
  createEmptyGrid,
  canPlaceShip,
  placeShip,
  randomPlaceShips,
} from './battleshipData';
import { getShipSvg } from './ShipGraphics';

interface ShipPlacerProps {
  onComplete: (grid: Cell[][], ships: PlacedShip[]) => void;
}

export function ShipPlacer({ onComplete }: ShipPlacerProps) {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [hoverCells, setHoverCells] = useState<{ row: number; col: number }[]>([]);
  const [canPlace, setCanPlace] = useState(false);

  const allShipsPlaced = placedShips.length === SHIPS.length;

  // 배 배치 미리보기
  const handleCellHover = useCallback((row: number, col: number) => {
    if (!selectedShip) {
      setHoverCells([]);
      setCanPlace(false);
      return;
    }

    const cells: { row: number; col: number }[] = [];
    for (let i = 0; i < selectedShip.size; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      if (r < GRID_SIZE && c < GRID_SIZE) {
        cells.push({ row: r, col: c });
      }
    }

    setHoverCells(cells);
    setCanPlace(canPlaceShip(grid, selectedShip, row, col, isHorizontal));
  }, [selectedShip, isHorizontal, grid]);

  // 배 배치
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!selectedShip || !canPlace) return;

    const newGrid = placeShip(grid, selectedShip, row, col, isHorizontal);
    const newPlacedShip: PlacedShip = {
      shipId: selectedShip.id,
      startRow: row,
      startCol: col,
      isHorizontal,
      hits: [],
    };

    setGrid(newGrid);
    setPlacedShips([...placedShips, newPlacedShip]);
    setSelectedShip(null);
    setHoverCells([]);
    setCanPlace(false);
  }, [selectedShip, canPlace, grid, isHorizontal, placedShips]);

  // 랜덤 배치
  const handleRandomPlace = () => {
    const { grid: newGrid, ships } = randomPlaceShips();
    setGrid(newGrid);
    setPlacedShips(ships);
    setSelectedShip(null);
    setHoverCells([]);
  };

  // 초기화
  const handleReset = () => {
    setGrid(createEmptyGrid());
    setPlacedShips([]);
    setSelectedShip(null);
    setHoverCells([]);
  };

  // 방향 전환
  const toggleDirection = () => {
    setIsHorizontal(!isHorizontal);
    setHoverCells([]);
  };

  // 셀 색상 결정
  const getCellStyle = (cell: Cell, row: number, col: number) => {
    // hover 상태 확인
    const isHovering = hoverCells.some(h => h.row === row && h.col === col);

    if (isHovering) {
      if (canPlace) {
        return 'bg-green-500/60 ring-2 ring-green-400';
      } else {
        return 'bg-red-500/60 ring-2 ring-red-400';
      }
    }

    if (cell.state === 'ship') {
      const ship = SHIPS.find(s => s.id === cell.shipId);
      return ship ? `bg-gradient-to-br ${ship.gradient}` : 'bg-indigo-500';
    }

    return 'bg-blue-900/30 hover:bg-blue-800/40';
  };

  return (
    <div className="space-y-4">
      {/* 안내 메시지 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
        <h3 className="font-bold text-lg mb-1">배 배치하기</h3>
        <p className="text-sm text-white/80">
          {selectedShip
            ? `${selectedShip.nameKo}(${selectedShip.size}칸)을 배치할 위치를 클릭하세요`
            : allShipsPlaced
            ? '모든 배가 배치되었습니다!'
            : '아래에서 배치할 배를 선택하세요'}
        </p>
      </div>

      {/* 격자판 */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-2xl p-3 shadow-2xl">
        {/* 열 라벨 */}
        <div className="flex mb-1">
          <div className="w-6 h-6" />
          {COL_LABELS.map((label, i) => (
            <div key={i} className="w-7 h-6 sm:w-8 flex items-center justify-center text-xs font-bold text-blue-300/70">
              {label}
            </div>
          ))}
        </div>

        {/* 격자 */}
        <div className="relative">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              <div className="w-6 h-7 sm:h-8 flex items-center justify-center text-xs font-bold text-blue-300/70">
                {ROW_LABELS[rowIndex]}
              </div>
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                  onMouseLeave={() => { setHoverCells([]); setCanPlace(false); }}
                  disabled={cell.state === 'ship'}
                  className={`
                    w-7 h-7 sm:w-8 sm:h-8 m-[1px] rounded-sm
                    transition-all duration-150
                    ${cell.state === 'ship' ? 'bg-transparent' : getCellStyle(cell, rowIndex, colIndex)}
                    ${cell.state !== 'ship' && selectedShip ? 'cursor-crosshair' : 'cursor-default'}
                    z-10
                  `}
                />
              ))}
            </div>
          ))}

          {/* 배치된 배 그래픽 오버레이 */}
          {placedShips.map((ship) => {
            const shipType = SHIPS.find(s => s.id === ship.shipId);
            if (!shipType) return null;

            const cellSize = 30; // w-7 + m-[1px]*2 ≈ 30
            const labelWidth = 24;

            const left = labelWidth + ship.startCol * cellSize + 2;
            const top = ship.startRow * cellSize + 2;

            const width = ship.isHorizontal ? shipType.size * cellSize - 2 : cellSize - 2;
            const height = ship.isHorizontal ? cellSize - 2 : shipType.size * cellSize - 2;

            return (
              <div
                key={ship.shipId}
                className="absolute pointer-events-none"
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              >
                {getShipSvg(ship.shipId, ship.isHorizontal, 'w-full h-full drop-shadow-lg')}
              </div>
            );
          })}
        </div>
      </div>

      {/* 방향 전환 버튼 */}
      {selectedShip && (
        <button
          onClick={toggleDirection}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isHorizontal ? '' : 'rotate-90'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span>{isHorizontal ? '가로 배치' : '세로 배치'}</span>
          <span className="text-gray-400 text-sm">(클릭하여 전환)</span>
        </button>
      )}

      {/* 배 선택 패널 */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          배 선택
        </h4>

        <div className="space-y-2">
          {SHIPS.map(ship => {
            const isPlaced = placedShips.some(p => p.shipId === ship.id);
            const isSelected = selectedShip?.id === ship.id;

            return (
              <button
                key={ship.id}
                onClick={() => !isPlaced && setSelectedShip(isSelected ? null : ship)}
                disabled={isPlaced}
                className={`
                  w-full p-3 rounded-xl flex items-center gap-3 transition-all
                  ${isPlaced
                    ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'bg-indigo-50 ring-2 ring-indigo-500'
                    : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }
                `}
              >
                {/* 배 그래픽 */}
                <div className={`h-8 flex-shrink-0 ${isPlaced ? 'opacity-30' : ''}`} style={{ width: `${ship.size * 24}px` }}>
                  {getShipSvg(ship.id, true, 'h-full w-full')}
                </div>

                {/* 배 정보 */}
                <div className="flex-1 text-left">
                  <p className={`font-medium ${isPlaced ? 'text-gray-400' : 'text-gray-900'}`}>
                    {ship.nameKo}
                  </p>
                  <p className="text-xs text-gray-400">{ship.size}칸</p>
                </div>

                {/* 상태 표시 */}
                {isPlaced ? (
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={handleRandomPlace}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>랜덤 배치</span>
        </button>
        <button
          onClick={handleReset}
          className="flex-1 py-3 bg-red-50 hover:bg-red-100 hover:scale-[1.02] active:scale-[0.98] text-red-500 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>초기화</span>
        </button>
      </div>

      {/* 준비 완료 버튼 */}
      {allShipsPlaced && (
        <button
          onClick={() => onComplete(grid, placedShips)}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-pulse"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>배치 완료!</span>
        </button>
      )}
    </div>
  );
}
