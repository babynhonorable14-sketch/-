
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface SettingsProps {
  initialRaw: string;
  initialPrize: string;
  initialRequired: number;
  onSave: (raw: string, prize: string, required: number) => void;
  onCancel: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  initialRaw, 
  initialPrize, 
  initialRequired,
  onSave, 
  onCancel 
}) => {
  const [raw, setRaw] = useState(initialRaw);
  const [prize, setPrize] = useState(initialPrize);
  const [required, setRequired] = useState(initialRequired);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiProcess = async (mode: 'text' | 'image', imageData?: string) => {
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `你是一个专业的出题助手。请从提供的${mode === 'image' ? '图片' : '文本'}中提取所有题目，并将其转换为标准的选择题格式。
      格式要求：
      1. 每一题包含：题目内容、A/B/C/D 选项、以及正确答案。
      2. 正确答案必须以 # 开头，紧跟答案字母（如 #A）。
      3. 每道题之间用一个空行分隔。
      4. 如果原内容没有选项，请根据常识自动生成合理的选项。
      
      格式示例：
      中国的首都是哪里？
      A. 上海
      B. 北京
      C. 广州
      #B

      示例结束。请直接输出题目内容，不要有任何开场白。`;

      const contents = mode === 'image' ? {
        parts: [
          { text: prompt },
          { inlineData: { data: imageData!, mimeType: 'image/jpeg' } }
        ]
      } : prompt;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
      });

      const result = response.text || '';
      if (result) {
        setRaw(prev => prev.trim() ? prev + '\n\n' + result : result);
      }
    } catch (error) {
      console.error('AI Error:', error);
      alert('AI 处理失败，请检查网络或 API Key。');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        handleAiProcess('image', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">系统设置</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Config */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">解锁密码</label>
            <input
              type="text"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
              placeholder="例如: 884512"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">通关需对题数</label>
            <input
              type="number"
              value={required}
              onChange={(e) => setRequired(Number(e.target.value))}
              className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* AI Tools */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-3">
          <h3 className="text-sm font-bold text-indigo-800 flex items-center">
            <span className="mr-2">✨</span> AI 智能题库助手
          </h3>
          <div className="flex space-x-2">
            <button
              disabled={isAiProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white border border-indigo-200 py-2 px-3 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{isAiProcessing ? '解析中...' : '拍照/图片导入'}</span>
            </button>
            <button
              disabled={isAiProcessing || !raw.trim()}
              onClick={() => handleAiProcess('text')}
              className="flex-1 bg-white border border-indigo-200 py-2 px-3 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>智能润色文本</span>
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
        </div>

        {/* Editor */}
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-gray-700 flex justify-between">
            <span>题库编辑器</span>
            <span className="text-xs font-normal text-gray-400">支持 OCR 格式</span>
          </label>
          {isAiProcessing && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p className="text-xs font-bold text-indigo-600">AI 正在努力生成题目...</p>
              </div>
            </div>
          )}
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all font-mono text-sm leading-relaxed"
            placeholder="在这里粘贴文本或使用 AI 导入..."
          />
        </div>
      </div>

      <div className="pt-4 flex space-x-3">
        <button
          onClick={() => onSave(raw, prize, required)}
          className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          保存配置
        </button>
        <button
          onClick={onCancel}
          className="py-4 px-8 rounded-2xl bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200"
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default Settings;
