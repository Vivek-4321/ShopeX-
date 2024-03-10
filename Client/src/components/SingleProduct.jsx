import React, { useState,useEffect } from "react";
import "react-multi-carousel/lib/styles.css";
import {useParams,useNavigate,Link} from 'react-router-dom';
import "./SingleProduct.css";
import { FaStar, FaStarHalf } from 'react-icons/fa';
import ImageCarousel from "./ImageCarousel";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import { fetchSingleProduct } from '../store/singleProductSlice';
import { useDispatch,useSelector} from 'react-redux';
import { STATUSES } from '../store/singleProductSlice';
import { PuffLoader } from 'react-spinners';
import { addToCart,getCartTotal } from '../store/cartSlice';

function SingleProduct() {

  const {id} = useParams();
  const { product: singleProduct, status } = useSelector(
    (state) => state.singleProduct
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = ({ id, title, image, price, rating, quantity }) => {
    console.log(quantity);
    dispatch(addToCart({ id, title, image, price, rating, quantity }));
    dispatch(getCartTotal());
  }

  useEffect(()=>{
    setIsLoading(true);
    dispatch(fetchSingleProduct(id));
    },[]);

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key={stars.length} className="star" />);
    }
    return stars;
  };

      if(status === STATUSES.LOADING){
        // return <Loading/> //<h1>Loading....</h1>
        return (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
              <PuffLoader color="#fff" />
          </div>
        )
      }
  else {
    console.log(singleProduct);
    return (
      <>
      <div className="image-cont">
          <ImageCarousel images={singleProduct && singleProduct.imageUrls}/>
          <div className="single-product-details">
        <span className="single-product-title">{singleProduct && singleProduct.name}</span>
        <div className="single-product-description">{singleProduct && singleProduct.description}</div>
        <div className='single-product-rating'>{getRatingStars(singleProduct && singleProduct.rating)}<div className='product-no-rating'>({singleProduct && SingleProduct.no_rating}) Ratings & Reviews</div></div>
        <div className="single-product-price">₹ {singleProduct && singleProduct.price}</div>
        <div className="single-product-features">
          <div className="feature-icon"><LocalShippingOutlinedIcon/></div>
          <div className="feature-icon-des">
            <span className="icon-des-title">Free Delivery</span>
            <span className="icon-des-description">Enjoy our free delivery service for your order</span>
          </div>
        </div>
        <div className="single-product-features">
          <div className="feature-icon"><AssignmentReturnOutlinedIcon/></div>
          <div className="feature-icon-des">
            <span className="icon-des-title">Return Policy</span>
            <span className="icon-des-description">Easy return for our product without any extra charges</span>
          </div>
        </div>
        <div className="product-buttons">
          <button className="product-buttons-buy">Buy Now</button>
          <button  onClick={() => handleAdd({id: singleProduct._id,title: singleProduct.name,image: singleProduct.imageUrls[0],price: singleProduct.price,rating: singleProduct.rating,quantity: 1})} className="product-buttons-cart">Add to Cart</button>
        </div>
      </div>
      </div>
      </>
    )
  }
  
}

export default SingleProduct;