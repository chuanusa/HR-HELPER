import React, { useState } from 'react';
import { Prize } from '../types';

interface PrizePanelProps {
    prizes: Prize[];
    setPrizes: React.Dispatch<React.SetStateAction<Prize[]>>;
}

export const PrizePanel: React.FC<PrizePanelProps> = ({ prizes, setPrizes }) => {
    const [prizeInput, setPrizeInput] = useState('');

    const handleAddPrize = () => {
        if (!prizeInput.trim()) return;
        const items = prizeInput.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        const newPrizes = items.map((name, idx) => ({
            id: Date.now().toString() + idx + Math.random(),
            name
        }));
        setPrizes(prev => [...prev, ...newPrizes]);
        setPrizeInput('');
    };

    const removePrize = (id: string) => {
        setPrizes(prev => prev.filter(p => p.id !== id));
    };

    const movePrize = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === prizes.length - 1) return;

        setPrizes(prev => {
            const newPrizes = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newPrizes[index], newPrizes[targetIndex]] = [newPrizes[targetIndex], newPrizes[index]];
            return newPrizes;
        });
    };

    return (
        <div className="animate-pop-in max-w-4xl mx-auto space-y-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        獎項設定
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        設定您要抽出的獎項，支援多筆輸入與排序功能
                    </p>
                </div>
                <div className="text-sm font-medium bg-slate-100 dark:bg-black/20 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">目前獎項數:</span> <span className="text-indigo-600 dark:text-indigo-400 font-bold text-base mx-1">{prizes.length}</span>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/20 dark:border-white/10">
                <div className="flex flex-col gap-4 mb-6">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">新增獎項</label>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                            placeholder="輸入獎項名稱，多個獎項可用逗號或換行分隔..."
                            value={prizeInput}
                            onChange={(e) => setPrizeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddPrize()}
                        />
                        <button onClick={handleAddPrize} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-2 font-bold hover:shadow-lg hover:scale-105 transition-all">
                            新增
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">提示：輸入 "Switch, iPad, PS5" 可一次新增三個獎項。</p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center justify-between">
                        <span>獎項列表 (依序抽出)</span>
                        {prizes.length > 0 && (
                            <button onClick={() => setPrizes([])} className="text-xs text-rose-500 hover:text-rose-600 underline">清空列表</button>
                        )}
                    </h3>

                    {prizes.length === 0 ? (
                        <div className="text-center text-slate-400 dark:text-slate-500 py-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-white/5">
                            🎁 尚未設定任何獎項
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {prizes.map((prize, idx) => (
                                <div key={prize.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${idx === 0 ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30' : 'bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-indigo-100'}`}>
                                    <div className="flex items-center flex-1 min-w-0">
                                        <span className={`text-sm font-bold mr-4 w-8 h-8 flex items-center justify-center rounded-lg shadow-sm ${idx === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-base font-medium truncate text-slate-700 dark:text-slate-200">{prize.name}</span>
                                        {idx === 0 && <span className="ml-3 text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Next</span>}
                                    </div>
                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => movePrize(idx, 'up')} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-500 disabled:opacity-30 transition-colors" disabled={idx === 0} title="Move Up">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => movePrize(idx, 'down')} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-500 disabled:opacity-30 transition-colors" disabled={idx === prizes.length - 1} title="Move Down">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <div className="w-px h-4 bg-slate-300 dark:bg-white/10 mx-1"></div>
                                        <button onClick={() => removePrize(prize.id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-500 transition-colors" title="Remove">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
