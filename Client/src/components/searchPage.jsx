import React, { useState,useEffect } from 'react';
import './searchPage.css';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import { FaStar, FaStarHalf } from 'react-icons/fa';

function SearchPage() {
    const [products, setProducts] = useState([]);
    const {input} = useParams();

    useEffect(() => {
        
        axios.get(`http://localhost:4040/api/search/${input}`)
        .then(response => {
          const data = response.data;
          console.log(data);
          setProducts(data);
        })
        .catch(error => {
          console.error(error);
        });
      
          
    }, []);

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
  <>
    <div className='search-container'>
        <div className='search-container-left'></div>
        <div className='search-container-right'>
            <div className='search-container-products'>
                {
                     products?.map(product => (
                        <div className="search-product">
                            <div className='search-product-left'>
                                <img src={product.imageUrls[0]} alt="product-image"/>
                            </div>
                            <div className='search-product-middle'>
                                <p className='search-product-middle-name'><Link to={`/api/product/${product._id}`} className='product-name'>{product.name}</Link></p>
                                <div className='search-product-middle-rating'>
                                    <div className='search-product-rating-star'>
                                    {getRatingStars(products && product.rating)}
                                    </div>
                                    {product.rating}
                                    <div>
                                        <div className='product-no-rating'>({product && product.no_rating}) Ratings & Reviews</div>
                                    </div>
                                </div>
                                <div className='product-description'>
                                    {product.description}
                                </div>
                            </div>
                            <div className='search-product-right'>
                                <p className='search-product-right-price'>₹ {product.price}</p>
                                <p className='serach-product-right-offer'>% 39{product.offer} off</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
      {/* <div>{input}</div>
      <div><Loader/></div> */}
  </>
  
  )
}

export default SearchPage;

// import { useState } from 'react';

// function ExampleComponent() {
//   const [showSecondDiv, setShowSecondDiv] = useState(false);

//   const handleIconClick = () => {
//     setShowSecondDiv(!showSecondDiv);
//   };

//   return (
//     <div>
//       <div>
//         {/* This is the first div */}
//       </div>

//       {/* This is the second div, which is hidden on small screens */}
//       <div style={{ display: showSecondDiv || window.innerWidth >= 768 ? 'block' : 'none' }}>
//         {/* Add content here */}
//       </div>

//       {/* This is the icon that toggles the second div on small screens */}
//       <div style={{ display: window.innerWidth < 768 ? 'block' : 'none' }}>
//         <button onClick={handleIconClick}>Show Second Div</button>
//       </div>
//     </div>
//   );
// }
