import { create } from 'zustand';

type SelectionItem = { id: string; kind: 'image' | 'folder'; name: string; path: string[] };

type SelectionState = {
  images: Map<string, SelectionItem>;
  folders: Map<string, SelectionItem>;
  add: (it: SelectionItem) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useSelectionStore = create<SelectionState>((set, get) => ({
  images: new Map(),
  folders: new Map(),
  add: (it) => {
    // TODO
  },
  remove: (id) => {
    // TODO
  },
  clear: () => set({ images: new Map(), folders: new Map() })
}));
