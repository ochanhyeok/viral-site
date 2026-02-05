interface AgeGroupSelectProps {
  onSelect: (ageGroup: string) => void;
}

const ageGroups = [
  { value: '20early', label: '20대 초반', range: '20-24세' },
  { value: '20late', label: '20대 후반', range: '25-29세' },
  { value: '30early', label: '30대 초반', range: '30-34세' },
  { value: '30late', label: '30대 후반', range: '35-39세' },
  { value: '40plus', label: '40대 이상', range: '40세 이상' },
];

export function AgeGroupSelect({ onSelect }: AgeGroupSelectProps) {
  return (
    <div className="space-y-3">
      <p className="text-center text-gray-600 font-medium">나이대를 선택해주세요</p>
      <p className="text-center text-gray-400 text-sm mb-4">같은 나이대와 결과를 비교해볼 수 있어요</p>
      <div className="grid grid-cols-2 gap-2">
        {ageGroups.map((group) => (
          <button
            key={group.value}
            onClick={() => onSelect(group.value)}
            className="p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-violet-400 hover:bg-violet-50 transition-all active:scale-95"
          >
            <div className="font-bold text-gray-800">{group.label}</div>
            <div className="text-sm text-gray-400">{group.range}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export const ageGroupLabels: Record<string, string> = {
  '20early': '20대 초반',
  '20late': '20대 후반',
  '30early': '30대 초반',
  '30late': '30대 후반',
  '40plus': '40대 이상',
};
