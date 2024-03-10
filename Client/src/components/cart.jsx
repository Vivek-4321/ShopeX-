import React,{useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {removeItem,increaseItemQuantity,decreaseItemQuantity,getCartTotal} from '../store/cartSlice';
import './cart.css';
import EmptyCart from './empty_cart.jpg'

function Cart() {

  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.cart);
  const basket = useSelector(state => state.cart.cart);
  const total =  useSelector(state => state.cart.totalPrice);
  const handleRemove = (productId) => {
    dispatch(removeItem(productId));
    dispatch(getCartTotal());
  }
  const handleIncrement =(productId) => {
    dispatch(increaseItemQuantity(productId));
    dispatch(getCartTotal());
  }
  const handleDecrement =(val,productId) => {
    if(val > 1){
      dispatch(decreaseItemQuantity(productId));
      dispatch(getCartTotal());
    }
  }

  if(products.length === 0){
        return (
            <div className='cart-empty-container'>
                <span className='cart-empty-title'>Empty Cart !!!</span>
               <img className="cart-empty-photo" src={EmptyCart} alt="image"/> 
            </div>
        )
  }

  return (
    <>
        <div className='cart-container'>
            <div className='cart-container-left'>
                <span className='cart-container-left-heading'>Your Shopping Cart{ console.log(products)}</span>
                <div className='cart-container-left-products-container'>
                {  
                    products.map(product => (
                    <div className="checkoutProduct">
                        <div className='checkoutProduct__img__div'>
                        <img src={product.image} className="checkoutProduct__img" />
                        </div>
                        <div className='checkoutProduct__info'>
                        <p className='checkoutProduct__title'>
                            {product.title}
                        </p>
                        <div className="pr__left">
                        <button className="remove-from-cart-btn" onClick={() => handleRemove(product.id)}>Remove</button>

                            <div className='pr__left__left'>
                                <button className="pr__left__left__btn" onClick={() => handleIncrement(product.id)}>+</button>
                                <h5>{product.quantity}</h5>
                                <button className="pr__left__left__btn" onClick={() => handleDecrement(product.quantity,product.id)}>-</button>
                            </div>
                            <div className='pr__left__right'>
                                <p className='checkoutProduct__price'>
                                <strong>
                                ₹ {product.price * product.quantity}
                                </strong>
                                </p>
                            </div>
                        </div>                  
                        </div>
                    </div>
                    ))
                    }
                </div>
            </div>
            <div className='cart-container-right'>
                <div className='cart-container-right-wrapper'>
                    <span className='cart-container-right-wrapper-title'>Order Summary</span>
                    <div className='cart-container-right-info'>
                        <div className='no-items'>
                            <p>No. of items</p>
                            <p className='no-items-p'>: {basket.length}</p>
                        </div>
                        <div className='total-price'>
                            <p>Total Price</p>
                            <p className='total-price-p'>: ₹ {total}</p>
                        </div>
                        <div className='coupon-discount'>
                            <p>Coupon deduction</p>
                            <p className="coupon-discount-p"> : ₹ 0</p>    
                        </div>
                        <div className='last-price'>
                            ₹ {total}
                        </div>
                    </div>
                    <div className='cart-container-right-coupon'>
                        <input placeholder="Enter the coupon code here" className='order-input-bar'/>
                        <button className='order-coupon-btn'>Check</button>
                    </div>
                    <div className='proceed-to-checkout-div'>
                        <button className='proceed-to-checkout-btn'>Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Cart;