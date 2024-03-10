import React from 'react';
import { describe, it , expect} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Cart from './Cart';
import {removeItem,increaseItemQuantity,decreaseItemQuantity,getCartTotal} from '../store/cartSlice';

const mockStore = configureMockStore();

describe('Test component', () => {
    it('displays empty cart message when there are no products', () => {
        const store = mockStore({ cart: { cart: [], totalPrice: 0 } });
        render(
            <Provider store={store}>
            <Cart />
            </Provider>
        );
        expect(screen.getByText('Empty Cart !!!')).toBeInTheDocument();
        expect(screen.getByAltText('image')).toBeInTheDocument();
    });

    it('removes product from cart when "Remove" button is clicked', () => {
        const products = [
          { id: 1, title: 'Product 1', image: 'image1.png', price: 100, quantity: 2 },
          { id: 2, title: 'Product 2', image: 'image2.png', price: 200, quantity: 1 },
        ];
        const store = mockStore({ cart: { cart: products, totalPrice: 400 } });
        render(
          <Provider store={store}>
            <Cart />
          </Provider>
        );
        fireEvent.click(screen.getAllByText('Remove')[0]);
        expect(store.getActions()).toContainEqual(removeItem(1));
      });
      
      it('increases product quantity when "+" button is clicked', () => {
        const products = [
          { id: 1, title: 'Product 1', image: 'image1.png', price: 100, quantity: 2 },
          { id: 2, title: 'Product 2', image: 'image2.png', price: 200, quantity: 1 },
        ];
        const store = mockStore({ cart: { cart: products, totalPrice: 400 } });
        render(
          <Provider store={store}>
            <Cart />
          </Provider>
        );
        fireEvent.click(screen.getAllByText('+')[0]);
        expect(store.getActions()).toContainEqual(increaseItemQuantity(1));
      });
      
});
  