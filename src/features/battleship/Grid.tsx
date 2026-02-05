import type { Cell, PlacedShip } from './battleshipData';
import { ROW_LABELS, COL_LABELS, SHIPS } from './battleshipData';
import { getShipSvg } from './ShipGraphics';

interface GridProps {
  grid: Cell[][];
  ships?: PlacedShip[];
  onCellClick?: (row: number, col: number) => void;
  isOpponentGrid?: boolean;
  disabled?: boolean;
  showShips?: boolean;
  highlightCells?: { row: number; col: number }[];
  lastAttack?: { row: number; col: number } | null;
}

export function Grid({
  grid,
  ships,
  onCellClick,
  isOpponentGrid = false,
  disabled = false,
  showShips = true,
  highlightCells = [],
  lastAttack,
}: GridProps) {
  const getCellColor = (cell: Cell) => {
    switch (cell.state) {
      case 'hit':
        return 'bg-gradient-to-br from-red-500 to-rose-600';
      case 'miss':
        return 'bg-gradient-to-br from-gray-300 to-gray-400';
      case 'sunk':
        return 'bg-gradient-to-br from-red-700 to-red-900';
      case 'ship':
        // 배 그래픽이 있으면 투명하게
        if (showShips && !isOpponentGrid) {
          return 'bg-transparent';
        }
        return 'bg-blue-900/30';
      default:
        return 'bg-blue-900/30 hover:bg-blue-800/50';
    }
  };

  // 셀 크기 계산 (반응형)
  const cellSize = 28; // sm:32
  const cellGap = 2; // m-[1px] * 2

  const isHighlighted = (row: number, col: number) => {
    return highlightCells.some(c => c.row === row && c.col === col);
  };

  const isLastAttack = (row: number, col: number) => {
    return lastAttack?.row === row && lastAttack?.col === col;
  };

  return (
    <div className="relative">
      {/* 격자판 컨테이너 */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 rounded-2xl p-3 shadow-2xl relative">
        {/* 열 라벨 (상단) */}
        <div className="flex mb-1">
          <div className="w-6 h-6" /> {/* 코너 빈 공간 */}
          {COL_LABELS.map((label, i) => (
            <div
              key={i}
              className="w-7 h-6 sm:w-8 flex items-center justify-center text-xs font-bold text-blue-300/70"
            >
              {label}
            </div>
          ))}
        </div>

        {/* 격자 + 행 라벨 */}
        <div className="relative">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {/* 행 라벨 (좌측) */}
              <div className="w-6 h-7 sm:h-8 flex items-center justify-center text-xs font-bold text-blue-300/70">
                {ROW_LABELS[rowIndex]}
              </div>

              {/* 셀들 */}
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onCellClick?.(rowIndex, colIndex)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    onCellClick?.(rowIndex, colIndex);
                  }}
                  disabled={disabled || cell.state === 'hit' || cell.state === 'miss' || cell.state === 'sunk'}
                  className={`
                    w-7 h-7 sm:w-8 sm:h-8 m-[1px] rounded-sm
                    transition-all duration-150
                    ${getCellColor(cell)}
                    ${!disabled && cell.state === 'empty'
                      ? 'cursor-crosshair hover:scale-110 hover:ring-2 hover:ring-yellow-400 hover:bg-yellow-500/40 active:scale-95 active:bg-red-500/60'
                      : 'cursor-default'}
                    ${isHighlighted(rowIndex, colIndex) ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-blue-950' : ''}
                    ${isLastAttack(rowIndex, colIndex) ? 'animate-pulse ring-2 ring-white' : ''}
                    relative overflow-hidden z-10
                  `}
                >
                  {/* 명중 표시 */}
                  {cell.state === 'hit' && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-4 h-4 sm:w-5 sm:h-5">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-lg">
                          <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            fill="#ef4444"
                            stroke="white"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* 침몰 표시 */}
                  {cell.state === 'sunk' && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}

                  {/* 빗나감 표시 */}
                  {cell.state === 'miss' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/70 shadow-md" />
                    </div>
                  )}

                  {/* 물결 효과 (빈 칸) */}
                  {cell.state === 'empty' && !isOpponentGrid && (
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}

          {/* 배 그래픽 오버레이 */}
          {showShips && !isOpponentGrid && ships && ships.map((ship) => {
            const shipType = SHIPS.find(s => s.id === ship.shipId);
            if (!shipType) return null;

            // 배 위치 계산 (라벨 너비 24px + 셀 시작)
            const labelWidth = 24; // w-6
            const cellWidth = cellSize + cellGap; // 28 + 2 = 30 (실제로는 29~31px)

            const left = labelWidth + ship.startCol * cellWidth + 2;
            const top = ship.startRow * cellWidth + 2;

            const width = ship.isHorizontal
              ? shipType.size * cellWidth - 2
              : cellWidth - 2;
            const height = ship.isHorizontal
              ? cellWidth - 2
              : shipType.size * cellWidth - 2;

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

      {/* 범례 */}
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
        {!isOpponentGrid && showShips && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-purple-600" />
            <span>배</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span>명중</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
          <span>빗나감</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span>침몰</span>
        </div>
      </div>
    </div>
  );
}

// 미니 그리드 (상대방 현황 표시용)
export function MiniGrid({ grid, showShips = false }: { grid: Cell[][]; showShips?: boolean }) {
  return (
    <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-xl p-2">
      <div className="grid grid-cols-10 gap-[1px]">
        {grid.flat().map((cell, i) => (
          <div
            key={i}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px] ${
              cell.state === 'hit' ? 'bg-red-500' :
              cell.state === 'miss' ? 'bg-gray-400' :
              cell.state === 'sunk' ? 'bg-red-800' :
              cell.state === 'ship' && showShips ? 'bg-indigo-500' :
              'bg-blue-800/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
