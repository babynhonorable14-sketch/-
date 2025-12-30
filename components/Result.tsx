
import React, { useState } from 'react';

interface ResultProps {
  isSuccess: boolean;
  prizeCode: string;
  onRetry: () => void;
}

const Result: React.FC<ResultProps> = ({ isSuccess, prizeCode, onRetry }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prizeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-scaleUp">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">🎉</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">恭喜通关！</h1>
          <p className="text-gray-500">所有的题目你都答对啦，这是你的解锁码：</p>
        </div>

        <div className="w-full p-8 rounded-3xl bg-white border-4 border-green-400 shadow-2xl space-y-4">
          <div className="text-5xl font-mono font-bold tracking-widest text-green-600">
            {prizeCode}
          </div>
          <button
            onClick={handleCopy}
            className="text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100"
          >
            {copied ? '已复制 ✔' : '复制密码'}
          </button>
        </div>

        <button
          onClick={onRetry}
          className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white font-bold text-lg shadow-lg hover:bg-gray-800 transition-all"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-shake">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-5xl">❌</span>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">挑战失败</h1>
        <p className="text-gray-500">回答错误！防作弊系统已启动，请等待冷却结束后重试。</p>
      </div>

      <button
        onClick={onRetry}
        className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
      >
        我知道了
      </button>
    </div>
  );
};

export default Result;
