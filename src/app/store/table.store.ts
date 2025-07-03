import { create } from 'zustand';

interface TableState {
  table: string;
  setTable: (newTable: string) => void;
}

const useTableStore = create<TableState>((set) => ({
  table: "",
  setTable: (newTable: string) => set({ table: newTable }),
}));

export default useTableStore;
