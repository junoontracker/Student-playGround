export interface LogEntry {
  id: number;
  date: string;
  mood: string;
  isRest: boolean;
  duration: number;
  subjects: string[];
  notes: string;
  bahana: string;
  isRev: boolean;
  grade: string;
}

export interface UserData {
  xp: number;
  shields: number;
  avatar: string;
}

export interface PdfFile {
  name: string;
  size: number;
  addedAt: number;
}

export type Tab = 'home' | 'log' | 'library' | 'stats' | 'profile';
