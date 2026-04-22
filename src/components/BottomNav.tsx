import React from 'react';
import { Home, Edit3, BookOpen, BarChart2, User } from 'lucide-react';
import { useStore } from '../store';
import { Tab } from '../types';

export function BottomNav() {
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);

  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'log', icon: <Edit3 size={24} />, label: 'Hisab' },
    { id: 'library', icon: <BookOpen size={24} />, label: 'Kitaabein' },
    { id: 'stats', icon: <BarChart2 size={24} />, label: 'Stat' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 w-full h-20 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800 flex justify-around items-center z-[100] pb-safe">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 w-1/5 transition-colors font-semibold text-xs ${
            activeTab === item.id ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className={`transition-transform duration-300 ${activeTab === item.id ? '-translate-y-1 scale-110 drop-shadow-[0_4px_10px_rgba(0,230,118,0.3)]' : ''}`}>
            {item.icon}
          </div>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
