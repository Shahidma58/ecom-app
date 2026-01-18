// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  prd_cd: number;
  prd_img_lnk: string;
  prd_brand: string;
  prd_desc: string;
  max_rsp: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = state.items.find((i) => i.prd_cd === action.payload.prd_cd);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.prd_cd !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    updateQuantity: (state, action) => {
      const { prd_cd, quantity } = action.payload;
      const item = state.items.find((item) => item.prd_cd === prd_cd);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
