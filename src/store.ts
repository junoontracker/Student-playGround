import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogEntry, UserData, PdfFile, Tab } from './types';

interface AppState {
  user: UserData;
  logs: LogEntry[];
  examDate: string | null;
  todos: { id: number; text: string; done: boolean }[];
  activeTab: Tab;
  pdfs: PdfFile[];
  
  // Actions
  setActiveTab: (tab: Tab) => void;
  updateUser: (data: Partial<UserData>) => void;
  addLog: (log: LogEntry) => void;
  updateLog: (id: number, log: LogEntry) => void;
  deleteLog: (id: number) => void;
  setExamDate: (date: string | null) => void;
  updateTodo: (id: number, text: string, done: boolean) => void;
  addPdf: (pdf: PdfFile) => void;
  removePdf: (name: string) => void;
  resetData: () => void;
}

const initialUser: UserData = { xp: 0, shields: 0, avatar: '😎' };

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: initialUser,
      logs: [],
      examDate: null,
      todos: [
        { id: 1, text: '', done: false },
        { id: 2, text: '', done: false },
      ],
      activeTab: 'home',
      pdfs: [],

      setActiveTab: (tab) => set({ activeTab: tab }),
      updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) })),
      updateLog: (id, log) => set((state) => ({ logs: state.logs.map((l) => (l.id === id ? log : l)) })),
      deleteLog: (id) => set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),
      setExamDate: (date) => set({ examDate: date }),
      updateTodo: (id, text, done) => set((state) => ({ todos: state.todos.map((t) => (t.id === id ? { ...t, text, done } : t)) })),
      addPdf: (pdf) => set((state) => ({ pdfs: [pdf, ...state.pdfs] })),
      removePdf: (name) => set((state) => ({ pdfs: state.pdfs.filter((p) => p.name !== name) })),
      resetData: () => set({ user: initialUser, logs: [], examDate: null, todos: [{ id: 1, text: '', done: false }, { id: 2, text: '', done: false }], pdfs: [] }),
    }),
    {
      name: 'sheebu-god-mode-v6',
    }
  )
);
