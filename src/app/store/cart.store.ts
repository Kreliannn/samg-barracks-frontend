import { create } from "zustand";
import { orderInterface } from "../types/orders.type";

interface OrderStore {
  orders: orderInterface[];
  addOrder: (order: orderInterface) => void;
  removeOrder: (index: number) => void;
  clearOrders: () => void;
}

const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),

  removeOrder: (index) =>
    set((state) => ({
      orders: state.orders.filter((_, i) => i !== index),
    })),

  clearOrders: () => set({ orders: [] }),
}));

export default useOrderStore;
