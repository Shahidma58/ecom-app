import { create } from "zustand";
/* =========================
   INTERFACES
========================= */
export interface Pur_Detl {
  itm_cd: number; // BARCODE
  itm_desc: string
  itm_rsp: number
  itm_qty: number
  itm_disc: number    // not used
  itm_tot_amt: number 
  itm_prc: number
  cur_rsp: number
  cur_pur_prc: number
  itm_tax?: number
}

export interface Pur_Batch {
  bch_qty: number
  bch_amt: number
  bch_items: number
  bch_disc: number
  bch_mbl: string
  vnd_ac_no: string
  paid_amt: number
  net_amt: number
}

/* =========================
   DEFAULT OBJECTS
========================= */

const emptyItem: Pur_Detl = {
  itm_cd: 0,
  itm_desc: "",
  itm_rsp: 0,
  itm_qty: 1,
  itm_disc: 0,   // Not Used 
//  itm_net_price: 0,  // not used
  itm_tot_amt: 0,
  itm_prc: 0,  // pur_prc (today's)
  cur_rsp: 0,
  cur_pur_prc: 0,
  itm_tax: 0,
//  returnMode: false
};

const emptyTotals: Pur_Batch = {
  bch_qty: 0,
  bch_amt: 0,
  bch_items: 0,
  bch_disc: 0,
  bch_mbl: "",
  vnd_ac_no: "",
  paid_amt: 0,
  net_amt: 0
};

/* =========================
   HELPERS
========================= */

const recalcItem = (item: Pur_Detl): Pur_Detl => {
//  const net = item.itm_prc - item.itm_disc;
  return {
    ...item,
//    itm_prc: net,
    itm_tot_amt: item.itm_prc * item.itm_qty,
  };
};

const calculateTotals = (items: Pur_Detl[]): Pur_Batch => ({
  ...emptyTotals,
//  sal_dt: new Date(),
  bch_items: items.length,
  bch_qty: items.reduce((s, i) => s + i.itm_qty, 0),
  bch_disc: items.reduce((s, i) => s + i.itm_disc, 0),
  bch_amt: items.reduce((s, i) => s + i.itm_prc, 0),
});


/* =========================
   STORE INTERFACE
========================= */

interface PurchaseStore {
  /* STATE */
  items: Pur_Detl[];
  currentItem: Pur_Detl;
  totals: Pur_Batch;

  customerMobile: string;
  returnMode: boolean;
  loading: boolean;

  /* ACTIONS */
  setCurrentItem: (field: keyof Pur_Detl, value: any) => void;
  resetCurrentItem: () => void;

  addItem: (item: Pur_Detl) => void;
  incrementQty: (itm_cd: number) => void;
  decrementQty: (itm_cd: number) => void;
  removeItem: (itm_cd: number) => void;
  clearCart: () => void;

  setCustomerMobile: (value: string) => void;
  updStorePaidAmt: (value: number) => void;
  toggleReturnMode: () => void;
  finalizeSale: () => Promise<void>;
}

/* =========================
   ZUSTAND STORE
========================= */

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  /* ---------- STATE ---------- */
  items: [],
  currentItem: emptyItem,
  totals: emptyTotals,

  customerMobile: "",
  returnMode: false,
  loading: false,

  /* ---------- INPUT ROW ---------- */
  setCurrentItem: (field, value) => {
    const updated = recalcItem({
      ...get().currentItem,
      [field]: value,
    });
    set({ currentItem: updated });
  },

  resetCurrentItem: () => set({ currentItem: emptyItem }),

  updStorePaidAmt: (amount: number) => {
    const { totals } = get();
    const paid = Math.max(0, amount);
    const net = Math.max(0, totals.bch_amt - paid);
    set({
      totals: {
        ...totals,
        paid_amt: paid,
        net_amt: net,
      },
    });
    console.log(totals.paid_amt);
    console.log("paid_amt from store");
  },
  /* ---------- CART ---------- */
  addItem: (item) => {
    const items = [...get().items];
    const idx = items.findIndex(i => i.itm_cd === item.itm_cd);

    if (idx >= 0) {
      items[idx] = recalcItem({
        ...items[idx],
        itm_qty: items[idx].itm_qty + item.itm_qty,
      });
    } else {
      items.push(recalcItem(item));
    }

    set({
      items,
      totals: calculateTotals(items),
    });
  },

  incrementQty: (itm_cd) => {
    const items = get().items.map(item =>
      item.itm_cd === itm_cd
        ? recalcItem({ ...item, itm_qty: item.itm_qty + 1 })
        : item
    );

    set({ items, totals: calculateTotals(items) });
  },

  decrementQty: (itm_cd) => {
    const items = get().items
      .map(item =>
        item.itm_cd === itm_cd
          ? recalcItem({ ...item, itm_qty: item.itm_qty - 1 })
          : item
      )
      .filter(item => item.itm_qty > 0);

    set({ items, totals: calculateTotals(items) });
  },

  removeItem: (itm_cd) => {
    const items = get().items.filter(i => i.itm_cd !== itm_cd);
    set({ items, totals: calculateTotals(items) });
  },

  clearCart: () => {
    set({
      items: [],
      totals: emptyTotals,
      currentItem: emptyItem,
    });
  },

  /* ---------- FOOTER / FINALIZE ---------- */


  setCustomerMobile: (value) => set({ customerMobile: value }),

  toggleReturnMode: () =>
    set(state => ({ returnMode: !state.returnMode })),

  finalizeSale: async () => {
    const { items } = get();
    if (items.length === 0) return;

    set({ loading: true });

    try {
      // 🔥 Replace with real API / Prisma call
      await new Promise(res => setTimeout(res, 800));

      set({
        items: [],
        totals: emptyTotals,
        currentItem: emptyItem,
        customerMobile: "",
        returnMode: false,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
