import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Person, LuckyDrawSettings } from '../types';
import confetti from 'canvas-confetti';

interface LuckyDrawPanelProps {
  names: Person[];
}

export const LuckyDrawPanel: React.FC<LuckyDrawPanelProps> = ({ names }) => {
  const [settings, setSettings] = useState<LuckyDrawSettings>({ allowRepeat: false });
  const [currentWinner, setCurrentWinner] = useState<Person | null>(null);
  const [displayPerson, setDisplayPerson] = useState<Person | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [history, setHistory] = useState<Person[]>([]);
  const [remainingNames, setRemainingNames] = useState<Person[]>(names);
  
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

  const startDraw = () => {
    if (remainingNames.length === 0) {
      alert("所有名單已抽完！");
      return;
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
    
    setDisplayPerson(winner);
    setCurrentWinner(winner);
    setIsRolling(false);
    setShowResultModal(true);
    triggerConfetti();
    
    setHistory(prev => [winner, ...prev]);

    if (!settings.allowRepeat) {
      setRemainingNames(prev => prev.filter(p => p.id !== winner.id));
    }
  };

  const resetHistory = () => {
    if(confirm("確定要重置抽獎紀錄嗎？")) {
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
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
           <label className="flex items-center cursor-pointer select-none">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={settings.allowRepeat} 
                onChange={toggleRepeat}
                disabled={isRolling}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${settings.allowRepeat ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.allowRepeat ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <div className="ml-3 text-gray-700 font-medium">
              {settings.allowRepeat ? '允許重複中獎' : '不重複中獎'}
            </div>
          </label>
        </div>
        
        <div className="text-sm text-gray-500">
          待抽人數: <span className="font-bold text-indigo-600">{remainingNames.length}</span> / 總人數: {names.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stage */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center ring-8 ring-gray-900">
             {/* Fancy Border Gradient */}
             <div className={`absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-purple-600 opacity-50 ${isRolling ? 'animate-spin' : ''}`} style={{ margin: '-5px', zIndex: 0, filter: 'blur(20px)' }}></div>
             
             <div className="relative z-10 w-full h-full bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" style={{ 
                  backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
                  backgroundSize: '30px 30px' 
                }}></div>

                {/* Status Text */}
                <h3 className="text-indigo-300 text-xl font-bold mb-10 uppercase tracking-[0.3em] animate-pulse">
                  {isRolling ? 'LUCKY DRAWING...' : 'READY'}
                </h3>
                
                {/* Rolling Display */}
                <div className="relative mb-16 w-full max-w-lg h-48 bg-black/50 rounded-xl border-2 border-indigo-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] backdrop-blur-sm">
                   {/* Shine effect */}
                   <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-xl"></div>
                   
                   {displayPerson ? (
                     <div className={`text-center px-4 w-full ${isRolling ? 'slot-machine-effect' : ''}`}>
                        <h1 className={`font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] tracking-tight leading-none break-words
                          ${isRolling ? 'text-6xl opacity-70 blur-[1px]' : 'text-7xl md:text-8xl scale-110 duration-200'}
                        `}>
                          {displayPerson.name}
                        </h1>
                     </div>
                   ) : (
                     <h1 className="text-6xl md:text-7xl font-bold text-white/10 tracking-widest select-none">
                       ???
                     </h1>
                   )}
                </div>

                <Button 
                  size="lg" 
                  onClick={startDraw} 
                  disabled={isRolling || remainingNames.length === 0}
                  className={`
                    relative overflow-hidden group px-16 py-6 text-2xl font-black tracking-widest uppercase transition-all duration-200
                    ${isRolling 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                    }
                  `}
                >
                  <span className="relative z-10">{isRolling ? '抽選中...' : 'START'}</span>
                  {!isRolling && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                </Button>
             </div>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">中獎紀錄 ({history.length})</h3>
            {history.length > 0 && (
              <button 
                onClick={resetHistory}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                重置
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                <span className="text-4xl mb-2">🏆</span>
                <p>等待幸運兒...</p>
              </div>
            ) : (
              history.map((person, idx) => (
                <div key={`${person.id}-${idx}`} className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100 animate-pop-in">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3 shadow-md">
                    {history.length - idx}
                  </div>
                  <div className="font-bold text-gray-800 text-lg truncate">{person.name}</div>
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowResultModal(false)}
          ></div>
          <div className="relative bg-white rounded-3xl p-10 max-w-2xl w-full text-center shadow-2xl transform transition-all animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
             <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-5xl">
               👑
             </div>
             
             <h2 className="mt-10 text-2xl font-bold text-gray-400 uppercase tracking-widest">Congratulations</h2>
             <div className="my-8 py-4 relative">
                <div className="absolute inset-0 bg-indigo-100 transform -skew-x-12 rounded-lg opacity-50"></div>
                <h1 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 drop-shadow-sm">
                  {currentWinner.name}
                </h1>
             </div>
             
             <div className="flex justify-center gap-4 mt-8">
               <Button size="lg" onClick={() => setShowResultModal(false)}>
                 繼續抽獎
               </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};