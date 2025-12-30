
import { Question } from '../types';

/**
 * Logic:
 * 1. Split by double newlines to get blocks.
 * 2. First line is question.
 * 3. Line starting with # is correct answer key.
 * 4. Other lines are options.
 */
export const parseOcrText = (text: string): Question[] => {
  const blocks = text.trim().split(/\n\s*\n/);
  
  return blocks.map((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return null;

    const questionText = lines[0];
    const options: string[] = [];
    let correctAnswer = '';

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('#')) {
        correctAnswer = lines[i].substring(1).trim();
      } else {
        options.push(lines[i]);
      }
    }

    return {
      id: `q-${index}-${Date.now()}`,
      text: questionText,
      options,
      correctAnswer
    };
  }).filter((q): q is Question => q !== null);
};
