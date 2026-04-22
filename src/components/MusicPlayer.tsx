import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Music } from 'lucide-react';

const TRACKS = [
  { name: 'Rain on Roof', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
  { name: 'Space Room Hum', url: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3' },
  { name: 'Fireplace', url: 'https://assets.mixkit.co/active_storage/sfx/1330/1330-preview.mp3' },
  { name: 'Forest Morning', url: 'https://assets.mixkit.co/active_storage/sfx/2444/2444-preview.mp3' },
  { name: 'Ocean Waves', url: 'https://assets.mixkit.co/active_storage/sfx/1196/1196-preview.mp3' },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIdx]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-fuchsia-400 font-bold text-sm">
          <Music size={16} />
          <span>Padhai Ka Sangeet</span>
        </div>
        <select 
          className="bg-zinc-800 text-xs text-white rounded p-1 border border-zinc-700 outline-none"
          value={currentTrackIdx}
          onChange={(e) => setCurrentTrackIdx(Number(e.target.value))}
        >
          {TRACKS.map((t, i) => (
            <option key={i} value={i}>{t.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 shadow-[0_0_15px_rgba(213,0,249,0.3)]' : 'bg-zinc-800 text-white'
          }`}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        
        <div className="flex-1 flex items-center gap-2 bg-black/30 p-2 rounded-lg">
          <Volume2 size={16} className="text-zinc-400" />
          <input 
            type="range" 
            min="0" max="1" step="0.05" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrackIdx].url} 
        loop 
      />
    </div>
  );
}
