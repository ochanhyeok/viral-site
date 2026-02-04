import type { StressQuestion } from '../../types/stressTest';
import { answerOptions } from '../../data/stressQuestions';

interface QuestionProps {
  question: StressQuestion;
  selectedScore: number | null;
  onAnswer: (score: number) => void;
}

export function Question({ question, selectedScore, onAnswer }: QuestionProps) {
  return (
    <div className="animate-fadeIn">
      <div className="mb-2">
        <span className="inline-block px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
          {question.category}
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {answerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              selectedScore === option.value
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  selectedScore === option.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {option.value}
              </div>
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
