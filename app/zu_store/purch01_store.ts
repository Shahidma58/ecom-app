import { create } from "zustand";
//import { PurchaseItem, PurchaseTotals } from "@/app/types/purchase";
//====================  Types ==================
interface PurchaseItem {
  itm_cd: number; // BARCODE
  itm_desc: string;
  itm_rsp: number;
  itm_qty: number;
  itm_disc: number;
  itm_net_price: number;
  itm_amt: number;
  itm_cost: number;
  itm_tax?: number;
}

interface PurchaseTotals {
  sal_id: number;
  sal_dt: Date;
  sal_qty: number;
  sal_amt: number;
  sal_items: number;
  sal_disc: number;
  inp_by: string;
  vendor_ac_no: string;
  vendor_name: string;
}


interface PurchaseStore {
  items: PurchaseItem[];
  totals: PurchaseTotals;

  addItem: (item: PurchaseItem) => void;
  incrementQty: (itm_cd: number) => void;
  decrementQty: (itm_cd: number) => void;
  removeItem: (itm_cd: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: PurchaseItem[]): PurchaseTotals => {
  const sal_qty = items.reduce((sum, i) => sum + i.itm_qty, 0);
  const sal_amt = items.reduce((sum, i) => sum + i.itm_amt, 0);
  const sal_disc = items.reduce((sum, i) => sum + i.itm_disc, 0);

  return {
    sal_id: 0,
    sal_dt: new Date(),
    sal_qty,
    sal_amt,
    sal_items: items.length,
    sal_disc,
    inp_by: "",
    vendor_ac_no: "",
    vendor_name: "",
  };
};


export const usePurchaseStore = create<PurchaseStore>((set, get) => ({

  items: [],

  totals: calculateTotals([]),

  addItem: (newItem) => {
    const items = [...get().items];
    const index = items.findIndex(i => i.itm_cd === newItem.itm_cd);

    if (index >= 0) {
      items[index].itm_qty += newItem.itm_qty;
      items[index].itm_amt =
        items[index].itm_qty * items[index].itm_net_price -
        items[index].itm_disc;
    } else {
      items.push({
        ...newItem,
        itm_amt:
          newItem.itm_qty * newItem.itm_net_price - newItem.itm_disc,
      });
    }

    set({
      items,
      totals: calculateTotals(items),
    });
  },

  incrementQty: (itm_cd) => {
    const items = get().items.map(item =>
      item.itm_cd === itm_cd
        ? {
            ...item,
            itm_qty: item.itm_qty + 1,
            itm_amt:
              (item.itm_qty + 1) * item.itm_net_price - item.itm_disc,
          }
        : item
    );

    set({
      items,
      totals: calculateTotals(items),
    });
  },

  decrementQty: (itm_cd) => {
    const items = get().items
      .map(item =>
        item.itm_cd === itm_cd
          ? {
              ...item,
              itm_qty: item.itm_qty - 1,
              itm_amt:
                (item.itm_qty - 1) * item.itm_net_price - item.itm_disc,
            }
          : item
      )
      .filter(item => item.itm_qty > 0);

    set({
      items,
      totals: calculateTotals(items),
    });
  },

  removeItem: (itm_cd) => {
    const items = get().items.filter(i => i.itm_cd !== itm_cd);

    set({
      items,
      totals: calculateTotals(items),
    });
  },

  clearCart: () => {
    set({
      items: [],
      totals: calculateTotals([]),
    });
  },
}));
