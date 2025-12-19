import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Person, LuckyDrawSettings, Prize, HistoryRecord } from '../types';
import confetti from 'canvas-confetti';

interface LuckyDrawPanelProps {
  names: Person[];
  prizes: Prize[];
  setPrizes: React.Dispatch<React.SetStateAction<Prize[]>>;
}

export const LuckyDrawPanel: React.FC<LuckyDrawPanelProps> = ({ names, prizes, setPrizes }) => {
  const [settings, setSettings] = useState<LuckyDrawSettings>({ allowRepeat: false });
  const [currentWinner, setCurrentWinner] = useState<Person | null>(null);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [displayPerson, setDisplayPerson] = useState<Person | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [remainingNames, setRemainingNames] = useState<Person[]>(names);

  // Prize States (Removed local state)
  // const [prizes, setPrizes] = useState<Prize[]>([]);
  // const [prizeInput, setPrizeInput] = useState('');

  // Animation refs
  const intervalRef = useRef<number | null>(null);

  // Initialize remaining names when props change or reset
  useEffect(() => {
    const ids = new Set(names.map(n => n.id));
    if (names.length !== remainingNames.length + history.length && settings.allowRepeat === false) {
      setRemainingNames(names);
      setHistory([]);
      setCurrentWinner(null);
      setDisplayPerson(null);
    }
  }, [names]);

  // ... (toggleRepeat logic unchanged)

  const toggleRepeat = () => {
    setSettings(prev => ({ ...prev, allowRepeat: !prev.allowRepeat }));
    if (!settings.allowRepeat) { // switching TO true
      setRemainingNames(names);
    } else {
      // switching TO false, filter out history
      const historyIds = new Set(history.map(h => h.id));
      setRemainingNames(names.filter(n => !historyIds.has(n.id)));
    }
  };

  // Helper: trigger confetti
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#ec4899', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#ec4899', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Prize Handlers (Removed local input handlers, kept logic consumption in Draw)

  const startDraw = () => {
    if (remainingNames.length === 0) {
      alert("所有名單已抽完！");
      return;
    }

    if (prizes.length > 0) {
      setCurrentPrize(prizes[0]);
    } else {
      setCurrentPrize(null);
    }

    setIsRolling(true);
    setCurrentWinner(null);
    setShowResultModal(false);

    // Initial speed
    let speed = 50;
    let counter = 0;

    const cycle = () => {
      const randomIndex = Math.floor(Math.random() * remainingNames.length);
      setDisplayPerson(remainingNames[randomIndex]);
      counter++;
    };

    // Use recursive timeout for variable speed could be better, but interval is simpler for "blur" effect
    intervalRef.current = window.setInterval(cycle, speed);

    // Stop logic
    const stopTime = 2500 + Math.random() * 1000;

    setTimeout(() => {
      stopDraw();
    }, stopTime);
  };

  const stopDraw = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Pick final winner
    const winnerIndex = Math.floor(Math.random() * remainingNames.length);
    const winner = remainingNames[winnerIndex];

    const wonPrize = prizes.length > 0 ? prizes[0] : { id: 'default', name: '一般中獎' };

    setDisplayPerson(winner);
    setCurrentWinner(winner);
    setIsRolling(false);
    setShowResultModal(true);
    triggerConfetti();

    const record: HistoryRecord = {
      ...winner,
      prize: wonPrize,
      drawnAt: Date.now()
    };

    setHistory(prev => [record, ...prev]);

    if (!settings.allowRepeat) {
      setRemainingNames(prev => prev.filter(p => p.id !== winner.id));
    }

    // Remove the prize if we are in prize mode
    if (prizes.length > 0) {
      setPrizes(prev => prev.slice(1));
    }
  };

  const resetHistory = () => {
    if (confirm("確定要重置抽獎紀錄嗎？")) {
      setHistory([]);
      setRemainingNames(names);
      setCurrentWinner(null);
      setDisplayPerson(null);
      setShowResultModal(false);
    }
  };

  return (
    <div className="animate-pop-in space-y-6">
      {/* Controls */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer select-none group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={settings.allowRepeat}
                onChange={toggleRepeat}
                disabled={isRolling}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors border border-white/10 dark:border-white/5 ${settings.allowRepeat ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700/50'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform shadow-md ${settings.allowRepeat ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <div className="ml-3 text-slate-600 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
              {settings.allowRepeat ? '允許重複中獎' : '不重複中獎'}
            </div>
          </label>
        </div>

        <div className="text-sm font-medium bg-slate-100 dark:bg-black/20 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5">
          <span className="text-slate-500 dark:text-slate-400">待抽:</span> <span className="text-indigo-600 dark:text-indigo-400 font-bold text-base mx-1">{remainingNames.length}</span> <span className="text-slate-300 dark:text-slate-600 mx-2">|</span> <span className="text-slate-500 dark:text-slate-400">總數:</span> {names.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stage */}
        <div className="lg:col-span-2 space-y-6 lg:order-1">
          <div className="relative glass-card rounded-3xl p-2 shadow-2xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center border border-white/20 dark:border-white/10 group">
            {/* Fancy Border Gradient - NO CHANGES needed inside here mostly */}
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-30 transition-opacity duration-1000 ${isRolling ? 'animate-pulse' : ''}`} style={{ margin: '-1px', zIndex: 0, filter: 'blur(40px)' }}></div>

            <div className="relative z-10 w-full h-full rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden bg-white/50 dark:bg-transparent">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{
                backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                color: isRolling ? '#818cf8' : '#cbd5e1'
              }}></div>

              {/* Status Text - Prize Display */}
              <h3 className="text-indigo-600 dark:text-indigo-300/80 text-sm font-bold mb-4 uppercase tracking-[0.5em] animate-pulse">
                {isRolling ? 'LUCKY DRAW IN PROGRESS' : 'READY TO START'}
              </h3>

              {/* Current Prize Display */}
              <div className="mb-8 h-12 flex items-center justify-center">
                {prizes.length > 0 ? (
                  <div className="animate-pop-in bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 px-6 py-2 rounded-full font-bold shadow-lg shadow-amber-500/20 border border-yellow-300">
                    <span className="mr-2">🏆</span> 正在抽出：{prizes[0].name}
                  </div>
                ) : (
                  <div className="text-slate-400 dark:text-slate-500 text-sm font-medium tracking-widest uppercase">
                    一般抽獎模式
                  </div>
                )}
              </div>

              {/* Rolling Display */}
              <div className="relative mb-16 w-full max-w-lg h-48 bg-white/80 dark:bg-black/40 rounded-2xl border border-indigo-100 dark:border-white/10 flex items-center justify-center shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-white/20 to-transparent"></div>

                {displayPerson ? (
                  <div className={`text-center px-4 w-full ${isRolling ? 'slot-machine-effect' : ''}`}>
                    <h1 className={`font-display font-black dark:text-white drop-shadow-lg tracking-tight leading-none break-words
                          ${isRolling ? 'text-6xl opacity-70 blur-[1px] text-slate-800' : 'text-6xl md:text-7xl scale-110 duration-300 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-white dark:to-indigo-200'}
                        `}>
                      {displayPerson.name}
                    </h1>
                  </div>
                ) : (
                  <h1 className="text-6xl md:text-7xl font-bold text-slate-300 dark:text-white/5 tracking-widest select-none font-display">
                    ???
                  </h1>
                )}
              </div>

              <Button
                size="lg"
                onClick={startDraw}
                disabled={isRolling || remainingNames.length === 0}
                className={`
                    relative overflow-hidden group px-16 py-6 text-xl font-black tracking-widest uppercase transition-all duration-300 rounded-2xl
                    ${isRolling
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent dark:border-white/5'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white hover:scale-105 shadow-xl shadow-indigo-500/30 dark:shadow-[0_0_40px_rgba(99,102,241,0.4)] border border-transparent dark:border-white/20'
                  }
                  `}
              >
                <span className="relative z-10 drop-shadow-md">{isRolling ? '抽選中...' : 'START'}</span>
                {!isRolling && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>}
              </Button>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="glass-card rounded-2xl flex flex-col h-[500px] border border-white/20 dark:border-white/10 overflow-hidden order-3">
          <div className="p-5 border-b border-indigo-50 dark:border-white/10 bg-indigo-50/50 dark:bg-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
              <span className="mr-2">🏆</span> 中獎紀錄
              <span className="ml-2 text-xs bg-white dark:bg-white/10 px-2 py-0.5 rounded-full text-indigo-600 dark:text-slate-300 shadow-sm">{history.length}</span>
            </h3>
            {history.length > 0 && (
              <button
                onClick={resetHistory}
                className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 underline underline-offset-2 transition-colors"
              >
                重置
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500/50 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-3xl opacity-50 text-slate-300 dark:text-slate-500">
                  🎁
                </div>
                <p className="text-sm font-medium">尚無中獎紀錄</p>
              </div>
            ) : (
              history.map((person, idx) => (
                <div key={`${person.id}-${idx}`} className="group flex items-center p-3 bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-100 dark:hover:border-white/10 transition-all duration-200 animate-pop-in shadow-sm dark:shadow-none">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-lg flex items-center justify-center font-bold text-xs mr-3 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                    {history.length - idx}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-700 dark:text-slate-200 text-base truncate">{person.name}</div>
                    <div className="text-xs text-indigo-500 dark:text-indigo-300 truncate">{(person as HistoryRecord).prize.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Winner Modal Overlay */}
      {showResultModal && currentWinner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowResultModal(false)}
          ></div>
          <div className="relative glass-panel border border-white/20 rounded-[2rem] p-10 max-w-xl w-full text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transform transition-gall animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden bg-white/90 dark:bg-slate-900/90">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 dark:from-indigo-500/20 to-transparent"></div>

            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-4 border-white dark:border-slate-800 shadow-[0_0_30px_rgba(234,179,8,0.5)] flex items-center justify-center text-5xl mb-6 group hover:scale-110 transition-transform duration-300">
                👑
              </div>

              <h2 className="text-xl font-bold text-indigo-400 dark:text-indigo-300 uppercase tracking-[0.3em] mb-2">Winner</h2>
              <div className="text-amber-500 dark:text-amber-400 font-bold text-lg mb-6 flex items-center justify-center gap-2">
                <span>🏆</span> {(currentWinner as HistoryRecord)?.prize?.name || '恭喜中獎'}
              </div>

              <div className="py-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 blur-xl rounded-full"></div>
                <h1 className="relative text-5xl md:text-7xl font-display font-black text-slate-800 dark:text-white drop-shadow-2xl">
                  {currentWinner.name}
                </h1>
              </div>

              <div className="flex justify-center gap-4 mt-10">
                <Button size="lg" onClick={() => setShowResultModal(false)} className="px-12 rounded-2xl">
                  繼續抽獎
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};