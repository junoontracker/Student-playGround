import React from 'react';
import { useStore } from '../store';

const RANKS = ["Noob", "Beginner", "Student", "Scholar", "Pro", "Expert", "Master", "Grandmaster", "Legend", "GOD MODE"];

export function Header() {
  const user = useStore(state => state.user);
  const lvl = Math.floor(user.xp / 100) + 1;
  const rank = RANKS[Math.min(lvl - 1, RANKS.length - 1)];

  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex justify-between items-center p-4 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 flex items-center justify-center text-2xl border-2 border-white shadow-[0_4px_10px_rgba(213,0,249,0.3)] cursor-pointer hover:scale-95 transition-transform">
          {user.avatar}
        </div>
        <div>
          <div className="text-xs text-emerald-400 font-extrabold tracking-wider uppercase">{greet}</div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            Sheebu
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/20">{rank}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-zinc-400 font-bold">LEVEL <span className="text-white">{lvl}</span></div>
        <div className="text-lg font-black text-fuchsia-500 drop-shadow-[0_0_10px_rgba(213,0,249,0.4)]">
          {Math.round(user.xp)} XP
        </div>
      </div>
    </div>
  );
}
