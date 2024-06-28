// productSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProduct, IProductState, IComment } from '../types';

export const fetchProducts = createAsyncThunk<IProduct[]>('products/fetchProducts', async () => {
  const response = await axios.get('/api/products');
  return response.data;
});

const initialState: IProductState = {
  items: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<IProduct>) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    },
    updateProduct: (state, action: PayloadAction<IProduct>) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
    addComment(state, action: PayloadAction<{ productId: number; comment: IComment }>) {
        const { productId, comment } = action.payload;
        const product = state.items.find((product) => product.id === productId);
        if (product) {
          product.comments.push(comment);
        }
    },
    deleteComment(state, action: PayloadAction<{ productId: number; commentId: number }>) {
        const { productId, commentId } = action.payload;
        const product = state.items.find((product) => product.id === productId);
        if (product) {
          product.comments = product.comments.filter((comment) => comment.id !== commentId);
        }
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { addProduct, removeProduct, updateProduct, addComment, deleteComment } = productSlice.actions;

export default productSlice.reducer;
