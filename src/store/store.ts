import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import shoppingListReducer from "./slices/ShoppingListSlice";
import shoppingItemReducer from "./slices/ShoppingItemsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingLists: shoppingListReducer,
    shoppingItems: shoppingItemReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;