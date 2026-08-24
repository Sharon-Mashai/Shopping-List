import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../../types";

interface ShoppingListState {
  shoppingLists: ShoppingList[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  shoppingLists: [],
  loading: false,
  error: null,
};

const shoppingListSlice = createSlice({
  name: "shoppingLists",
  initialState,

  reducers: {
    setShoppingLists: (
      state,
      action: PayloadAction<ShoppingList[]>,
    ) => {
      state.shoppingLists = action.payload;
    },

    addShoppingList: (
      state,
      action: PayloadAction<ShoppingList>,
    ) => {
      state.shoppingLists.push(action.payload);
    },

    updateShoppingList: (
      state,
      action: PayloadAction<ShoppingList>,
    ) => {
      const index = state.shoppingLists.findIndex(
        (list) => list.id === action.payload.id,
      );

      if (index !== -1) {
        state.shoppingLists[index] = action.payload;
      }
    },

    deleteShoppingList: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.shoppingLists = state.shoppingLists.filter(
        (list) => list.id !== action.payload,
      );
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },

    setError: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.error = action.payload;
    },
  },
});

export const {
  setShoppingLists,
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  setLoading,
  setError,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;