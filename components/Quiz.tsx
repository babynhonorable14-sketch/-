
import React from 'react';
import { Question } from '../types';

interface QuizProps {
  question: Question;
  onAnswer: (option: string) => void;
  current: number;
  total: number;
}

const Quiz: React.FC<QuizProps> = ({ question, onAnswer, current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="flex-1 flex flex-col animate-slideIn">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-blue-600">进度</span>
          <span className="text-sm font-medium text-gray-400">{current} / {total}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          {question.text}
        </h2>

        <div className="grid gap-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(option)}
              className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-start space-x-3 shadow-sm active:scale-[0.98]"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center text-sm font-bold text-gray-500 transition-colors">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-lg font-medium text-gray-700 group-hover:text-blue-800">
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
