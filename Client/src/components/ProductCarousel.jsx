import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './ProductCarousel.css'; // import the CSS file for styling
import { FaStar, FaStarHalf } from 'react-icons/fa';

const ProductSlider = ({products,status}) => {

  // responsive configuration for carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 500, min: 0 },
      items: 2,
      slidesToSlide: 1,
    },
  };

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


 
    return (
      <div className="product-slider">
        <Carousel responsive={responsive}>
          {products &&
            products.products &&
            products.products.map(product => (
              <Link to={`/api/product/${product._id}`} className='product-item-link'>
                <div key={product.id} className="product-item">
              <div className='product-item-image-div'><img className="product-item-image" src={product.imageUrls[0]} alt={product.name} /></div>
              <h4 className='product-item-name'>{product.name}</h4>
              <h6 className='product-item-price'><span className='product-item-price-span'>{product.offer}% off</span>₹ {product.price}</h6>
              <div className='product-item-rating'>{getRatingStars(product.rating)}<div className='product-no-rating'>({product.no_rating})</div></div>
            </div>
              </Link>
            
          ))}
        </Carousel>
      </div>
    );
  
};

export default ProductSlider;

