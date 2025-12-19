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
    <div className="min-h-screen text-slate-100 relative overflow-x-hidden selection:bg-pink-500 selection:text-white">
      <div className="mesh-bg"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white font-black text-xl">
                HR
              </div>
              <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                Lucky & Group
              </h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex p-1 rounded-full glass-card border border-white/10">
              {navItems.map((item) => (
                <button
                  key={item.mode}
                  onClick={() => setCurrentMode(item.mode)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${currentMode === item.mode
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pop-in">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass-card rounded-2xl p-2 flex justify-around items-center shadow-2xl border border-white/10">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setCurrentMode(item.mode)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-full ${currentMode === item.mode
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[10px] font-medium opacity-80">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;