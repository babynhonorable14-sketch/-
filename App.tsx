
import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus, Question, QuizState } from './types';
import { 
  DEFAULT_QUESTION_TEXT, 
  DEFAULT_PRIZE_CODE, 
  DEFAULT_REQUIRED_CORRECT,
  COOLDOWN_DURATION_MS 
} from './constants';
import { parseOcrText } from './services/parser';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Settings from './components/Settings';

const STORAGE_KEYS = {
  QUESTIONS: 'quiz_questions_raw',
  PRIZE: 'quiz_prize_code',
  REQUIRED: 'quiz_required_count',
  COOLDOWN: 'quiz_cooldown_timestamp'
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.HOME);
  const [rawText, setRawText] = useState(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || DEFAULT_QUESTION_TEXT);
  const [prizeCode, setPrizeCode] = useState(localStorage.getItem(STORAGE_KEYS.PRIZE) || DEFAULT_PRIZE_CODE);
  const [requiredCount, setRequiredCount] = useState(Number(localStorage.getItem(STORAGE_KEYS.REQUIRED)) || DEFAULT_REQUIRED_CORRECT);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Initialize questions
  useEffect(() => {
    const parsed = parseOcrText(rawText);
    setQuestions(parsed);
  }, [rawText]);

  // Cooldown check
  useEffect(() => {
    const checkCooldown = () => {
      const ts = Number(localStorage.getItem(STORAGE_KEYS.COOLDOWN)) || 0;
      const now = Date.now();
      if (ts > now) {
        setCooldownTime(Math.ceil((ts - now) / 1000));
      } else {
        setCooldownTime(0);
      }
    };

    checkCooldown();
    const timer = setInterval(checkCooldown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartQuiz = () => {
    if (cooldownTime > 0) return;
    
    // Pick N random questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(requiredCount, questions.length));
    
    setActiveQuiz(selected);
    setCurrentIndex(0);
    setStatus(AppStatus.QUIZ);
  };

  const handleAnswer = (option: string) => {
    const currentQ = activeQuiz[currentIndex];
    const isCorrect = option.startsWith(currentQ.correctAnswer) || option === currentQ.correctAnswer;

    if (isCorrect) {
      if (currentIndex + 1 >= activeQuiz.length) {
        setStatus(AppStatus.SUCCESS);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      // Set cooldown on failure
      const unlockTime = Date.now() + COOLDOWN_DURATION_MS;
      localStorage.setItem(STORAGE_KEYS.COOLDOWN, unlockTime.toString());
      setStatus(AppStatus.FAILURE);
    }
  };

  const saveSettings = (newRaw: string, newPrize: string, newRequired: number) => {
    setRawText(newRaw);
    setPrizeCode(newPrize);
    setRequiredCount(newRequired);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, newRaw);
    localStorage.setItem(STORAGE_KEYS.PRIZE, newPrize);
    localStorage.setItem(STORAGE_KEYS.REQUIRED, newRequired.toString());
    setStatus(AppStatus.HOME);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-8 flex flex-col">
      {status === AppStatus.HOME && (
        <Home 
          onStart={handleStartQuiz} 
          onOpenSettings={() => setStatus(AppStatus.SETTINGS)} 
          cooldown={cooldownTime}
          totalQuestions={questions.length}
          required={requiredCount}
        />
      )}

      {status === AppStatus.QUIZ && (
        <Quiz 
          question={activeQuiz[currentIndex]} 
          onAnswer={handleAnswer} 
          current={currentIndex + 1} 
          total={activeQuiz.length} 
        />
      )}

      {(status === AppStatus.SUCCESS || status === AppStatus.FAILURE) && (
        <Result 
          isSuccess={status === AppStatus.SUCCESS} 
          prizeCode={prizeCode} 
          onRetry={() => setStatus(AppStatus.HOME)} 
        />
      )}

      {status === AppStatus.SETTINGS && (
        <Settings 
          initialRaw={rawText} 
          initialPrize={prizeCode} 
          initialRequired={requiredCount}
          onSave={saveSettings} 
          onCancel={() => setStatus(AppStatus.HOME)}
        />
      )}
    </div>
  );
};

export default App;
