import axios from 'axios';
import { createSlice } from "@reduxjs/toolkit";

export const STATUSES = Object.freeze({
    IDLE: 'idle',
    ERROR: 'error',
    LOADING: 'loading',
});

const singleProductSlice = createSlice({
    name: 'singleProduct',
    initialState:{
        product:{},
        status: STATUSES.IDLE,
    },
    reducers: {
        setProduct(state,action) {
            state.product = action.payload;
        },
        setStatus(state, action){
            state.status = action.payload;
        }
    }
});

export const {setProduct,setStatus} = singleProductSlice.actions;
export default singleProductSlice.reducer;



export function fetchSingleProduct(productId) {
    return async function fetchSingleProductThunk(dispatch, getState) {
      dispatch(setStatus(STATUSES.LOADING));
      try {
        console.log(productId);
        const response = await axios.get(`https://shopex-yfau.onrender.com/api/product/getSingleProduct/${productId}`);
        const newData = response.data;
        dispatch(setProduct(newData));
        dispatch(setStatus(STATUSES.IDLE));
        console.log(newData);
      } catch (err) {
        dispatch(setStatus(STATUSES.ERROR));
        console.log(err);
      }
    }
  }