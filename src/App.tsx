import React from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './tabs/HomeTab';
import { LogTab } from './tabs/LogTab';
import { LibraryTab } from './tabs/LibraryTab';
import { StatsTab } from './tabs/StatsTab';
import { ProfileTab } from './tabs/ProfileTab';
import { useStore } from './store';

export default function App() {
  const activeTab = useStore(state => state.activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-fuchsia-500/30 pb-24">
      <Header />
      
      <main className="max-w-md mx-auto">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'log' && <LogTab />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      <BottomNav />
    </div>
  );
}
