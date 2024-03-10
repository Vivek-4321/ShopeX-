import React,{useState,useEffect} from 'react';
import './home.css';
import Carousel from './Carousel';
import ProductSlider from './ProductCarousel';
import { fetchProducts } from '../store/productSlice';
import { useDispatch,useSelector} from 'react-redux';
import { STATUSES } from '../store/productSlice';
import { PuffLoader } from 'react-spinners';

function Home() {

  const {data: products = [],status} = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    setIsLoading(true);
    dispatch(fetchProducts());
    },[]);

    if(status === STATUSES.LOADING){
      // return <Loading/> //<h1>Loading....</h1>
      return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <PuffLoader color="#fff" />
        </div>
      )
    }

    else{
      return (
        <>
        <div className='home-container'>
          <Carousel/>
          <h4>Top Rated Products</h4>
          {products && <ProductSlider products={products} status={status}/>}
          <h4>Best Deals</h4>
          {products && <ProductSlider products={products} />}
        </div>
        </>
      );
    }

  }

export default Home;
