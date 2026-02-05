import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: { target: { value: string } }) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  placeholder = '선택하세요',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  // 스크롤 위치 조정
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (option: SelectOption) => {
    onChange?.({ target: { value: String(option.value) } });
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* 선택 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3.5 bg-gray-50/50 border-2 rounded-xl
            flex items-center justify-between gap-3
            transition-all duration-200 cursor-pointer text-left
            ${isOpen
              ? 'border-violet-500 bg-white ring-4 ring-violet-500/10'
              : error
              ? 'border-red-400 bg-red-50/30 hover:border-red-500'
              : 'border-gray-200 hover:border-gray-300 hover:bg-white'
            }`}
        >
          <span className={`flex-1 truncate ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
            {selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                {selectedOption.label}
              </span>
            ) : (
              placeholder
            )}
          </span>

          {/* 화살표 아이콘 */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180 text-violet-500' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 드롭다운 목록 */}
        {isOpen && (
          <ul
            ref={listRef}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden animate-dropdown max-h-64 overflow-y-auto"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-150 text-left
                      ${isSelected
                        ? 'bg-violet-50 text-violet-700'
                        : isHighlighted
                        ? 'bg-gray-50'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    {/* 아이콘 */}
                    {option.icon && (
                      <span className="text-lg flex-shrink-0">{option.icon}</span>
                    )}

                    {/* 라벨 & 설명 */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isSelected ? 'text-violet-700' : 'text-gray-900'}`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-gray-400 truncate">{option.description}</div>
                      )}
                    </div>

                    {/* 선택됨 표시 */}
                    {isSelected && (
                      <svg className="w-5 h-5 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 힌트 */}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <style>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

Select.displayName = 'Select';
