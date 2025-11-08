import { create } from 'zustand'

// ✅ Export interface so you can import it elsewhere
export interface CartItem {
  cart_id: number
  cart_id_serl: number
  prd_cd: number
  prd_desc: string
  prd_rsp: number
  prd_qty: number
  prd_img_lnk?: string
  tax_amt?: number
  tot_amt: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (prd_cd: number) => void
  clearCart: () => void
  totalAmount: () => number
  updateQty: (prd_cd: number, delta: number) => void // ✅ new method
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.prd_cd === item.prd_cd)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.prd_cd === item.prd_cd
              ? { ...i, prd_qty: i.prd_qty + item.prd_qty }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  removeItem: (prd_cd) =>
    set((state) => ({
      items: state.items.filter((item) => item.prd_cd !== prd_cd),
    })),

  clearCart: () => set({ items: [] }),

  totalAmount: () =>
    get().items.reduce(
      (sum, item) => sum + (item.tot_amt ?? item.prd_rsp * item.prd_qty),
      0
    ),

  // ✅ NEW METHOD to update quantity (positive or negative)
  updateQty: (prd_cd, delta) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.prd_cd === prd_cd
            ? { ...item, prd_qty: Math.max(item.prd_qty + delta, 1) } // prevent qty < 1
            : item
        )
        .filter((item) => item.prd_qty > 0), // optional safeguard
    })),
}))
