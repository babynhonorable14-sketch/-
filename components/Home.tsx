
import React, { useState } from 'react';

interface HomeProps {
  onStart: () => void;
  onOpenSettings: () => void;
  cooldown: number;
  totalQuestions: number;
  required: number;
}

const Home: React.FC<HomeProps> = ({ onStart, onOpenSettings, cooldown, totalQuestions, required }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const handleAdminAccess = () => {
    if (passwordInput === 'adminadmin') {
      setIsPasswordModalOpen(false);
      setPasswordInput('');
      setError(false);
      onOpenSettings();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
      {/* Admin Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xs p-6 rounded-3xl shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-900">管理员验证</h3>
            <p className="text-sm text-gray-500">请输入访问密码以进入管理后台</p>
            <div className="space-y-2">
              <input
                type="password"
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
                className={`w-full p-3 rounded-xl border-2 outline-none transition-all ${
                  error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-blue-500'
                }`}
                placeholder="输入密码"
              />
              {error && <p className="text-xs text-red-500 font-medium">密码错误，请重试</p>}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAdminAccess}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
              >
                确认
              </button>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordInput('');
                  setError(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">答题赢密码</h1>
        <p className="text-gray-500">连续答对 {Math.min(required, totalQuestions)} 道题即可解锁神秘代码</p>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={onStart}
          disabled={cooldown > 0 || totalQuestions === 0}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all transform active:scale-95 ${
            cooldown > 0 || totalQuestions === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
          }`}
        >
          {cooldown > 0 ? `冷却中 (${cooldown}s)` : '开始挑战'}
        </button>
        
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full py-3 px-6 rounded-2xl font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          题库管理
        </button>
      </div>

      {totalQuestions === 0 && (
        <p className="text-red-500 text-sm">题库目前为空，请点击管理导入题目</p>
      )}

      <div className="text-xs text-gray-400 pt-8">
        本系统为纯前端应用，数据仅保存在当前浏览器。
      </div>
    </div>
  );
};

export default Home;
