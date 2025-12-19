import React, { useState } from 'react';
import { Button } from './Button';
import { Person, Group } from '../types';

interface GroupGeneratorPanelProps {
  names: Person[];
}

export const GroupGeneratorPanel: React.FC<GroupGeneratorPanelProps> = ({ names }) => {
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  const handleGenerate = () => {
    if (names.length === 0) return;

    // Shuffle
    const shuffled = shuffleArray<Person>(names);

    // Chunk
    const newGroups: Group[] = [];
    let groupIndex = 1;

    for (let i = 0; i < shuffled.length; i += groupSize) {
      const chunk = shuffled.slice(i, i + groupSize);
      newGroups.push({
        id: groupIndex++,
        members: chunk
      });
    }

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // Create CSV content with BOM for Excel compatibility
    let csvContent = "\uFEFFGroup,Name\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `Group ${group.id},"${member.name}"\n`;
      });
    });

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'grouping_result.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modern Gradient Colors for Groups
  const cardColors = [
    "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/20 text-blue-800 dark:text-blue-100",
    "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-400/20 text-emerald-800 dark:text-emerald-100",
    "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-400/20 text-purple-800 dark:text-purple-100",
    "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-400/20 text-amber-800 dark:text-amber-100",
    "bg-gradient-to-br from-rose-500/20 to-rose-600/10 border-rose-400/20 text-rose-800 dark:text-rose-100",
    "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-400/20 text-cyan-800 dark:text-cyan-100",
  ];

  return (
    <div className="animate-pop-in space-y-8">
      {/* Settings Bar */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full md:w-auto">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            每組人數設定
          </label>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="2"
              max={Math.max(10, Math.ceil(names.length / 2))}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="w-16 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 shadow-inner text-xl">
              {groupSize}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 font-medium">總人數: {names.length} 人，預計產生 <span className="text-indigo-600 dark:text-indigo-400 underline">{Math.ceil(names.length / groupSize)}</span> 組</p>
        </div>

        <div className="flex gap-3">
          <Button size="lg" onClick={handleGenerate} className="px-8" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }>
            自動分組
          </Button>

          {isGenerated && (
            <Button size="lg" variant="secondary" onClick={downloadCSV} icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }>
              匯出 CSV
            </Button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {isGenerated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <div
              key={group.id}
              className={`rounded-2xl shadow-lg border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${cardColors[idx % cardColors.length]}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/10 dark:border-white/10">
                <h3 className="font-bold text-xl drop-shadow-sm">第 {group.id} 組</h3>
                <span className="text-xs font-bold bg-white/40 dark:bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">{group.members.length} 人</span>
              </div>
              <ul className="space-y-3">
                {group.members.map(member => (
                  <li key={member.id} className="flex items-center group">
                    <span className="w-2 h-2 rounded-full bg-current opacity-70 mr-3 group-hover:scale-125 transition-transform"></span>
                    <span className="font-medium opacity-90 group-hover:opacity-100">{member.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {!isGenerated && names.length > 0 && (
        <div className="text-center py-24 glass-card rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
          <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">準備就緒，請點擊上方按鈕進行分組</p>
        </div>
      )}
    </div>
  );
};