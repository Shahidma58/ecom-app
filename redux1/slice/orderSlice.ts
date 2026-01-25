import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface OrderData {
  orderNumber: string;
  orderDate: string;
  status: string;
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal?: number;
  tax: number;
  shippingCost: number;
  total: number;
}

// New interfaces for cart data from backend
export interface CartData {
  cart_id: number;
  cust_mbl: string;
  cust_email: string;
  cust_fname: string;
  cust_lname: string;
  cust_addr_1: string;
  cust_addr_2: string;
  cust_city: string;
  cust_ctry: string;
  tot_amt: number;
  tot_tax: number;
  tot_itms: number;
  dlvy_chgs: number;
  cust_comp: string;
  inp_by: string;
  cart_stat: string;
  cart_dt: string;
}

export interface CartItemData {
  cart_id: number;
  cart_id_serl: number;
  prd_cd: string;
  prd_qty: number;
  prd_rsp: number;
  prd_img_lnk: string;
  prd_desc: string;
  tot_amt: number;
  tax_amt: number;
  itm_stat: string;
}

interface CreateOrderPayload {
  customerData: {
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    city: string;
    country: string;
    company?: string;
    postalCode: string;
  };
  cartItems: any[];
  totals: {
    subtotal: number;
    shippingCost: number;
    total: number;
  };
}

interface OrderState {
  currentOrder: OrderData | null;
  currentCart: CartData | null;
  currentCartItems: CartItemData[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  currentCart: null,
  currentCartItems: [],
  loading: false,
  error: null,
};

// AsyncThunk for creating cart
export const createCart = createAsyncThunk(
  "order/createCart",
  async (payload: CreateOrderPayload) => {
    const { customerData, cartItems, totals } = payload;
    console.log("Payload", payload);
    // Step 1: Create Cart
    const cartResponse = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cust_mbl: customerData.phone,
        cust_email: customerData.email,
        cust_fname: customerData.firstName,
        cust_lname: customerData.lastName,
        cust_addr_1: customerData.address,
        cust_addr_2: customerData.address2 || "",
        cust_city: customerData.city,
        cust_ctry: customerData.country,
        tot_amt: totals.total,
        tot_tax: 0,
        tot_itms: cartItems.length,
        dlvy_chgs: totals.shippingCost,
        cust_comp: customerData.company || "",
        inp_by: "web",
        cart_stat: "A",
      }),
    });

    if (!cartResponse.ok) {
      throw new Error("Failed to create cart");
    }

    const cartData = await cartResponse.json();
    return { cartData, customerData, cartItems, totals };
  }
);

// AsyncThunk for creating cart details
export const createCartDetails = createAsyncThunk(
  "order/createCartDetails",
  async ({ cartId, cartItems }: { cartId: number; cartItems: any[] }) => {
    const cartDetailsPromises = cartItems.map((item, index) =>
      fetch("http://localhost:5000/cart-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId,
          cart_id_serl: index + 1,
          prd_cd: item.prd_cd,
          prd_qty: item.quantity,
          prd_rsp: item.max_rsp,
          prd_img_lnk: item.prd_img_lnk,
          prd_desc: item.prd_desc,
          tot_amt: item.max_rsp * item.quantity,
          itm_stat: "A",
          tax_amt: 0,
        }),
      })
    );

    const responses = await Promise.all(cartDetailsPromises);

    // Check if all requests were successful
    for (const response of responses) {
      if (!response.ok) {
        throw new Error("Failed to create cart details");
      }
    }

    return cartId;
  }
);

// AsyncThunk for getting cart by ID
export const getCartById = createAsyncThunk(
  "order/getCartById",
  async (cartId: string) => {
    const response = await fetch(`http://localhost:5000/cart/${cartId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const cartData = await response.json();
    return cartData;
  }
);

// AsyncThunk for getting cart items by cart ID
export const getCartItems = createAsyncThunk(
  "order/getCartItems",
  async (cartId: string) => {
    const response = await fetch(
      `http://localhost:5000/cart-details/${cartId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }

    const cartItems = await response.json();
    return cartItems;
  }
);

// AsyncThunk for getting full cart with items
export const getFullCart = createAsyncThunk(
  "order/getFullCart",
  async (cartId: string, { dispatch }) => {
    // Get cart data and cart items in parallel
    const [cartResponse, itemsResponse] = await Promise.all([
      dispatch(getCartById(cartId)),
      dispatch(getCartItems(cartId)),
    ]);

    return {
      cart: cartResponse.payload,
      items: itemsResponse.payload,
    };
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<OrderData>) => {
      state.currentOrder = action.payload;
      state.error = null;
    },
    setCart: (state, action: PayloadAction<CartData>) => {
      state.currentCart = action.payload;
      state.error = null;
    },
    setCartItems: (state, action: PayloadAction<CartItemData[]>) => {
      state.currentCartItems = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.currentOrder = null;
    },
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    clearCart: (state) => {
      state.currentCart = null;
      state.currentCartItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Cart
      .addCase(createCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;
        // Store cart creation data for next step
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create cart";
      })
      // Create Cart Details
      .addCase(createCartDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCartDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Order creation completed successfully
      })
      .addCase(createCartDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create cart details";
      })
      // Get Cart by ID
      .addCase(getCartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCart = action.payload;
      })
      .addCase(getCartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      // Get Cart Items
      .addCase(getCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart items";
      })
      // Get Full Cart
      .addCase(getFullCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFullCart.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCart = action.payload.cart;
        state.currentCartItems = action.payload.items;
      })
      .addCase(getFullCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch full cart";
      });
  },
});

export const {
  setOrder,
  setCart,
  setCartItems,
  setLoading,
  setError,
  clearOrder,
  clearCart,
} = orderSlice.actions;

export default orderSlice.reducer;

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// export interface OrderItem {
//   id: number;
//   name: string;
//   image: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

// export interface Customer {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   company: string;
// }

// export interface ShippingAddress {
//   address: string;
//   city: string;
//   country: string;
//   postalCode: string;
// }

// export interface OrderData {
//   orderNumber: string;
//   orderDate: string;
//   status: string;
//   customer: Customer;
//   shippingAddress: ShippingAddress;
//   items: OrderItem[];
//   subtotal: number;
//   tax: number;
//   shippingCost: number;
//   total: number;
// }

// interface CreateOrderPayload {
//   customerData: {
//     phone: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     address: string;
//     address2: string;
//     city: string;
//     country: string;
//     company?: string;
//     postalCode: string;
//   };
//   cartItems: any[];
//   totals: {
//     subtotal: number;
//     shippingCost: number;
//     total: number;
//   };
// }

// interface OrderState {
//   currentOrder: OrderData | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: OrderState = {
//   currentOrder: null,
//   loading: false,
//   error: null,
// };

// // AsyncThunk for creating cart
// export const createCart = createAsyncThunk(
//   "order/createCart",
//   async (payload: CreateOrderPayload) => {
//     const { customerData, cartItems, totals } = payload;

//     // Step 1: Create Cart
//     const cartResponse = await fetch("http://localhost:5000/cart", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         cust_mbl: customerData.phone,
//         cust_email: customerData.email,
//         cust_fname: customerData.firstName,
//         cust_lname: customerData.lastName,
//         cust_addr_1: customerData.address,
//         cust_addr_2: customerData.address2 || "",
//         cust_city: customerData.city,
//         cust_ctry: customerData.country,
//         tot_amt: totals.total,
//         tot_tax: 0,
//         tot_itms: cartItems.length,
//         dlvy_chgs: totals.shippingCost,
//         cust_comp: customerData.company || "",
//         inp_by: "web",
//         cart_stat: "A",
//       }),
//     });

//     if (!cartResponse.ok) {
//       throw new Error("Failed to create cart");
//     }

//     const cartData = await cartResponse.json();
//     return { cartData, customerData, cartItems, totals };
//   }
// );

// // AsyncThunk for creating cart details
// export const createCartDetails = createAsyncThunk(
//   "order/createCartDetails",
//   async ({ cartId, cartItems }: { cartId: number; cartItems: any[] }) => {
//     const cartDetailsPromises = cartItems.map((item, index) =>
//       fetch("http://localhost:5000/cart-details", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           cart_id: cartId,
//           cart_id_serl: index + 1,
//           prd_cd: item.prd_cd,
//           prd_qty: item.quantity,
//           prd_rsp: item.max_rsp,
//           prd_img_lnk: item.prd_img_lnk,
//           prd_desc: item.prd_desc,
//           tot_amt: item.max_rsp * item.quantity,
//           itm_stat: "A",
//           tax_amt: 0,
//         }),
//       })
//     );

//     const responses = await Promise.all(cartDetailsPromises);

//     // Check if all requests were successful
//     for (const response of responses) {
//       if (!response.ok) {
//         throw new Error("Failed to create cart details");
//       }
//     }

//     return cartId;
//   }
// );

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     setOrder: (state, action: PayloadAction<OrderData>) => {
//       state.currentOrder = action.payload;
//       state.error = null;
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//       state.currentOrder = null;
//     },
//     clearOrder: (state) => {
//       state.currentOrder = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create Cart
//       .addCase(createCart.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createCart.fulfilled, (state, action) => {
//         state.loading = false;
//         // Store cart creation data for next step
//       })
//       .addCase(createCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to create cart";
//       })
//       // Create Cart Details
//       .addCase(createCartDetails.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createCartDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         // Order creation completed successfully
//       })
//       .addCase(createCartDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to create cart details";
//       });
//   },
// });

// export const { setOrder, setLoading, setError, clearOrder } =
//   orderSlice.actions;
// export default orderSlice.reducer;
