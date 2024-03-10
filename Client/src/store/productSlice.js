import axios from 'axios';
import { createSlice } from "@reduxjs/toolkit";

export const STATUSES = Object.freeze({
    IDLE: 'idle',
    ERROR: 'error',
    LOADING: 'loading',
});

const productSlice = createSlice({
    name: 'product',
    initialState:{
        data:[],
        status: STATUSES.IDLE,
    },
    reducers: {
        setProducts(state,action) {
            state.data = action.payload;
        },
        setStatus(state, action){
            state.status = action.payload;
        }
    }
});

export const {setProducts,setStatus} = productSlice.actions;
export default productSlice.reducer;

export function fetchProducts() {
    return async function fetchProductThunk(dispatch, getState) {
      dispatch(setStatus(STATUSES.LOADING));
      try {
        const response = await axios.get('https://shopex-yfau.onrender.com/api/product/getProducts');
        const newData = response.data;
        dispatch(setProducts(newData));
        dispatch(setStatus(STATUSES.IDLE));
        console.log(newData);
      } catch (err) {
        dispatch(setStatus(STATUSES.ERROR));
        console.log(err);
      }
    }
  }