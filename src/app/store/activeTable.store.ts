import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TableStore {
activeTables: string[]
  addTable: (table: string) => void
  removeTable: (table: string) => void
}

const useActiveTableStore = create<TableStore>()(
  persist(
    (set) => ({
      activeTables: [],
      addTable: (table) =>
        set((state) => ({ activeTables: [...state.activeTables, table] })),
      removeTable: (table) =>
        set((state) => ({
          activeTables: state.activeTables.filter((t) => t !== table),
        })),
    }),
    {
      name: 'table-storage', // localStorage key
    }
  )
)

export default useActiveTableStore
