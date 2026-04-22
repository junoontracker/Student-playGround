import React from 'react';
import { useStore } from '../store';
import { Download, Upload, AlertTriangle } from 'lucide-react';

const RANKS = ["Noob", "Beginner", "Student", "Scholar", "Pro", "Expert", "Master", "Grandmaster", "Legend", "GOD MODE"];

export function ProfileTab() {
  const { user, updateUser, resetData, logs, examDate } = useStore();
  
  const lvl = Math.floor(user.xp / 100) + 1;
  const rank = RANKS[Math.min(lvl - 1, RANKS.length - 1)];
  const progress = user.xp % 100;

  const handleAvatarChange = () => {
    const newAv = prompt("Pick your God Mode emoji:", user.avatar);
    if (newAv) updateUser({ avatar: newAv });
  };

  const handleBackup = () => {
    const data = { user, logs, examDate };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sheebu_god_mode_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const handleReset = () => {
    if (prompt("Type 'RESET' to delete all your hard work:") === 'RESET') {
      resetData();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center shadow-lg">
        <div 
          onClick={handleAvatarChange}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-fuchsia-500 rounded-full flex items-center justify-center text-5xl border-4 border-zinc-900 shadow-[0_0_30px_rgba(213,0,249,0.4)] cursor-pointer hover:scale-105 transition-transform mb-4"
        >
          {user.avatar}
        </div>
        <h2 className="text-2xl font-black text-white tracking-wide mb-1">Sheebu</h2>
        <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6">{rank}</div>
        
        <div className="bg-black/50 h-3 rounded-full overflow-hidden border border-zinc-800 relative">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-fuchsia-500 transition-all duration-1000 shadow-[0_0_10px_rgba(213,0,249,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-2">
          <span>Level {lvl}</span>
          <span>Next Level</span>
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">💾 Data Management</div>
        
        <div className="space-y-3">
          <button 
            onClick={handleBackup}
            className="w-full flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 py-3 rounded-xl font-bold text-sm hover:bg-blue-500/20 transition-colors"
          >
            <Download size={16} /> Backup Data to Device
          </button>
          
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/30 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors"
          >
            <AlertTriangle size={16} /> Factory Reset
          </button>
        </div>
      </div>

    </div>
  );
}
