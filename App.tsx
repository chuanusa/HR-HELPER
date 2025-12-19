import React, { useState } from 'react';
import { Person, AppMode } from './types';
import { InputPanel } from './components/InputPanel';
import { LuckyDrawPanel } from './components/LuckyDrawPanel';
import { GroupGeneratorPanel } from './components/GroupGeneratorPanel';

const App: React.FC = () => {
  const [names, setNames] = useState<Person[]>([]);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.INPUT);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.INPUT:
        return (
          <InputPanel 
            names={names} 
            setNames={setNames} 
            onNext={() => setCurrentMode(AppMode.LUCKY_DRAW)}
          />
        );
      case AppMode.LUCKY_DRAW:
        return <LuckyDrawPanel names={names} />;
      case AppMode.GROUPING:
        return <GroupGeneratorPanel names={names} />;
      default:
        return null;
    }
  };

  const navItems = [
    { mode: AppMode.INPUT, label: '名單輸入', icon: '📝' },
    { mode: AppMode.LUCKY_DRAW, label: '獎品抽籤', icon: '🎰' },
    { mode: AppMode.GROUPING, label: '自動分組', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold text-xl mr-3">
                HR
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
                Lucky & Group Tool
              </h1>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.mode}
                  onClick={() => setCurrentMode(item.mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                    currentMode === item.mode
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* Mobile Nav Placeholder (Simple current status) */}
             <div className="md:hidden text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {navItems.find(n => n.mode === currentMode)?.label}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setCurrentMode(item.mode)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                currentMode === item.mode ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Safe area padding for mobile bottom nav */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
};

export default App;