import React, { useState, useEffect } from 'react';
import { Person, AppMode } from './types';
import { InputPanel } from './components/InputPanel';
import { LuckyDrawPanel } from './components/LuckyDrawPanel';
import { GroupGeneratorPanel } from './components/GroupGeneratorPanel';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('input');
  const [names, setNames] = useState<Person[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { mode: 'input' as AppMode, label: '名單輸入', icon: '📝' },
    { mode: 'draw' as AppMode, label: '幸運抽獎', icon: '🎰' },
    { mode: 'group' as AppMode, label: '自動分組', icon: '👥' },
  ];

  const renderContent = () => {
    switch (currentMode) {
      case 'input':
        return <InputPanel names={names} setNames={setNames} onNext={() => setCurrentMode('draw')} />;
      case 'draw':
        return <LuckyDrawPanel names={names} />;
      case 'group':
        return <GroupGeneratorPanel names={names} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="mesh-bg" />

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentMode('input')}>
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30">
                🎲
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                抽獎系統與自動分組
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
                title={theme === 'light' ? '切換深色模式' : '切換淺色模式'}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              <nav className="hidden md:flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl backdrop-blur-md">
                {navItems.map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setCurrentMode(item.mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center ${currentMode === item.mode
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm scale-105'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/20 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setCurrentMode(item.mode)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentMode === item.mode
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500'
                }`}
            >
              <span className={`text-xl transition-transform duration-200 ${currentMode === item.mode ? '-translate-y-1' : ''}`}>{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;