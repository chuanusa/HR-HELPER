import React, { useState, useRef, useMemo } from 'react';
import { Button } from './Button';
import { Person } from '../types';

interface InputPanelProps {
  names: Person[];
  setNames: (names: Person[]) => void;
  onNext: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ names, setNames, onNext }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseNames = (text: string): Person[] => {
    // Split by new line or comma
    const rawNames = text.split(/[,\n]/).map(n => n.trim()).filter(n => n.length > 0);
    return rawNames.map(name => ({
      id: Math.random().toString(36).substring(2, 9),
      name
    }));
  };

  const handleAddText = () => {
    const newPeople = parseNames(inputText);
    if (newPeople.length === 0) return;

    setNames([...names, ...newPeople]);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newPeople = parseNames(content);
      setNames([...names, ...newPeople]);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setNames([]);
    }
  };

  const removePerson = (id: string) => {
    setNames(names.filter(p => p.id !== id));
  };

  // Demo Data Function
  const loadDemoData = () => {
    const demoList = [
      "王小明", "陳美麗", "林志豪", "張雅婷", "李建國",
      "黃怡君", "吳淑芬", "蔡志偉", "楊家豪", "許雅雯",
      "孫悟空", "魯夫", "鳴人", "炭治郎", "阿尼",
      "Iron Man", "Batman", "Spider-Man", "Wonder Woman", "Thor"
    ];

    const newPeople = demoList.map(name => ({
      id: Math.random().toString(36).substring(2, 9),
      name
    }));

    if (names.length > 0) {
      if (confirm("要覆蓋目前名單嗎？(取消則為追加)")) {
        setNames(newPeople);
      } else {
        setNames([...names, ...newPeople]);
      }
    } else {
      setNames(newPeople);
    }
  };

  // Duplicate Logic
  const duplicateInfo = useMemo(() => {
    const counts: Record<string, number> = {};
    names.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });

    const hasDuplicates = Object.values(counts).some(c => c > 1);
    return { counts, hasDuplicates };
  }, [names]);

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList: Person[] = [];

    names.forEach(person => {
      if (!seen.has(person.name)) {
        seen.add(person.name);
        uniqueList.push(person);
      }
    });

    const removedCount = names.length - uniqueList.length;
    setNames(uniqueList);
    alert(`已移除 ${removedCount} 個重複項目`);
  };

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="p-2 bg-indigo-500/20 rounded-lg mr-3">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            輸入名單來源
          </h2>
          <Button variant="secondary" size="sm" onClick={loadDemoData} icon={<span>🎲</span>}>
            範例名單
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                方法 1: 貼上姓名 (以換行或逗號分隔)
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-30 group-hover:opacity-75 blur transition duration-200"></div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="relative w-full h-48 p-4 bg-slate-900/80 border border-white/10 rounded-xl focus:ring-0 focus:outline-none text-slate-200 placeholder-slate-600 resize-none transition-all shadow-inner"
                  placeholder="例如：&#10;王小明&#10;李大同&#10;張美麗"
                />
              </div>
              <div className="mt-3 flex justify-end">
                <Button onClick={handleAddText} disabled={!inputText.trim()} size="sm">
                  加入名單
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-slate-800/50 text-sm text-slate-400 rounded-full backdrop-blur-sm">或</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                方法 2: 上傳 CSV / TXT 檔案
              </label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-slate-400 group-hover:text-indigo-300"><span className="font-semibold">點擊上傳</span> 或拖曳檔案至此</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-2xl p-4 flex flex-col h-full max-h-[500px] border border-white/5">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-slate-200">目前名單 <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{names.length} 人</span></h3>
                {names.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
                  >
                    清空全部
                  </button>
                )}
              </div>

              {duplicateInfo.hasDuplicates && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex justify-between items-center text-sm text-amber-200 animate-pop-in">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    偵測到重複名單
                  </span>
                  <button
                    onClick={removeDuplicates}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 rounded-lg text-xs font-bold transition-colors border border-amber-500/30"
                  >
                    移除重複
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {names.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500/50 italic py-12">
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>尚無資料，請由左側新增</p>
                </div>
              ) : (
                names.map((person, index) => {
                  const isDup = duplicateInfo.counts[person.name] > 1;
                  return (
                    <div
                      key={person.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group
                        ${isDup ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}
                      `}
                    >
                      <div className="flex items-center">
                        <span className={`w-6 h-6 flex items-center justify-center text-[10px] rounded-full mr-3 border ${isDup ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-700/50 text-slate-400 border-white/10'}`}>
                          {index + 1}
                        </span>
                        <span className={`font-medium ${isDup ? 'text-amber-200' : 'text-slate-200'}`}>
                          {person.name}
                          {isDup && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">重複</span>}
                        </span>
                      </div>
                      <button
                        onClick={() => removePerson(person.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-400/10 opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onNext}
          disabled={names.length === 0 || duplicateInfo.hasDuplicates}
          className="w-full md:w-auto min-w-[240px] shadow-2xl shadow-indigo-500/20"
          title={duplicateInfo.hasDuplicates ? "請先處理重複名單" : ""}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          {duplicateInfo.hasDuplicates ? '請移除重複名單' : '下一步：開始使用'}
        </Button>
      </div>
    </div>
  );
};