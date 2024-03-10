import { configureStore } from "@reduxjs/toolkit";
import productReducer from './productSlice';
import singleProductReducer from "./singleProductSlice";
import cartReducer from './cartSlice'

const store = configureStore({
    reducer:{
        product: productReducer,
        singleProduct : singleProductReducer,
        cart: cartReducer,
    }
});

export default store;