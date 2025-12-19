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

  // Color palette for groups to make them visually distinct
  const cardColors = [
    "bg-blue-50 border-blue-100 text-blue-900",
    "bg-green-50 border-green-100 text-green-900",
    "bg-purple-50 border-purple-100 text-purple-900",
    "bg-amber-50 border-amber-100 text-amber-900",
    "bg-rose-50 border-rose-100 text-rose-900",
    "bg-cyan-50 border-cyan-100 text-cyan-900",
  ];

  return (
    <div className="animate-pop-in space-y-8">
      {/* Settings Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex-1 w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">每組人數設定 ({groupSize} 人/組)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="2" 
                max={Math.max(10, Math.ceil(names.length / 2))} 
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-12 h-10 flex items-center justify-center bg-gray-100 rounded-lg font-bold text-gray-700 border border-gray-200">
                {groupSize}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">總人數: {names.length} 人，預計產生 {Math.ceil(names.length / groupSize)} 組</p>
         </div>
         
         <div className="flex gap-2">
            <Button size="lg" onClick={handleGenerate} icon={
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
                className={`rounded-xl shadow-sm border p-4 transition hover:shadow-md ${cardColors[idx % cardColors.length]}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
             >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-black/5">
                   <h3 className="font-bold text-lg">第 {group.id} 組</h3>
                   <span className="text-xs font-medium bg-white/50 px-2 py-1 rounded-full">{group.members.length} 人</span>
                </div>
                <ul className="space-y-2">
                   {group.members.map(member => (
                     <li key={member.id} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 mr-2"></span>
                        <span className="font-medium">{member.name}</span>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>
      )}
      
      {!isGenerated && names.length > 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
           <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
           </svg>
           <p className="text-gray-500 text-lg">準備就緒，請點擊上方按鈕進行分組</p>
        </div>
      )}
    </div>
  );
};