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
      if(confirm("要覆蓋目前名單嗎？(取消則為追加)")) {
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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            輸入名單來源
          </h2>
          <Button variant="secondary" size="sm" onClick={loadDemoData} icon={<span>🎲</span>}>
             載入範例名單
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                方法 1: 貼上姓名 (以換行或逗號分隔)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-700"
                placeholder="例如：&#10;王小明&#10;李大同&#10;張美麗"
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleAddText} disabled={!inputText.trim()} size="sm">
                  加入名單
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">或</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                方法 2: 上傳 CSV / TXT 檔案
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                  cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex flex-col h-full max-h-[400px]">
            <div className="flex flex-col gap-2 mb-3">
               <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">目前名單 ({names.length} 人)</h3>
                  {names.length > 0 && (
                    <button 
                      onClick={clearAll}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      清空全部
                    </button>
                  )}
               </div>
               
               {duplicateInfo.hasDuplicates && (
                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex justify-between items-center text-sm text-amber-800 animate-pop-in">
                    <span className="flex items-center">
                       <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                       </svg>
                       偵測到重複名單
                    </span>
                    <button 
                      onClick={removeDuplicates}
                      className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-2 py-1 rounded text-xs font-bold transition-colors"
                    >
                      移除重複
                    </button>
                 </div>
               )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {names.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                  <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className={`flex items-center justify-between p-2 rounded shadow-sm border transition-colors
                        ${isDup ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-100 hover:border-indigo-200'}
                      `}
                    >
                      <div className="flex items-center">
                        <span className={`w-6 h-6 flex items-center justify-center text-xs rounded-full mr-3 ${isDup ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                          {index + 1}
                        </span>
                        <span className={`font-medium ${isDup ? 'text-amber-900' : 'text-gray-800'}`}>
                           {person.name}
                           {isDup && <span className="ml-2 text-[10px] bg-amber-200 text-amber-800 px-1 rounded">重複</span>}
                        </span>
                      </div>
                      <button 
                        onClick={() => removePerson(person.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
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

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={onNext} 
          disabled={names.length === 0 || duplicateInfo.hasDuplicates}
          className="w-full md:w-auto min-w-[200px]"
          title={duplicateInfo.hasDuplicates ? "請先處理重複名單" : ""}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          {duplicateInfo.hasDuplicates ? '請移除重複名單' : '開始使用功能'}
        </Button>
      </div>
    </div>
  );
};