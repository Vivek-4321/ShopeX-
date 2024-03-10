import React,{useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import './Carousel.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Carousel() {

  const [index,setIndex] = useState(0);

  const images = [
    {src: 'https://picsum.photos/id/1019/400/300', alt: ''},
    {src: 'https://picsum.photos/id/1015/400/300', alt: ''},
    {src: 'https://picsum.photos/id/1021/400/300', alt: ''},
    {src: 'https://picsum.photos/id/1020/400/300', alt: ''}
  ];

  useEffect(()=>{
    const lastIndex = images.length -1;
    if(index<0){
        setIndex(lastIndex)
    }
    if(index > lastIndex){
        setIndex(0)
    }
  },[index,images])

  useEffect(()=>{
    let slider = setInterval(()=>{
        setIndex(index+1);
    },3000);
    return () => {
        clearInterval(slider)
    }
  },[index]);

  const accessToken = Cookies.get('access-token');

  return (
    <>
    <div className='section'>
    <div className='section-center'>
      
        {images.map((image,indexImage) => {
             let position = "nextSlide";
            if(indexImage === index){
                position = 'activeSlide'
            }
            if(indexImage === index-1 || (index === 0 && indexImage === images.length -1)){
                position = 'lastSlide'
            }
            return (<article className={position} key={indexImage}>
               <div className='banner-div'>
                <div className='banner-div-inner'>
                <h3 className='banner-div-inner-content'>Grab Upto 50% Off On<br></br>Selected Headphone</h3>
                <button className='sample-btn'>Get it now</button>
                </div>
               <img src={image.src} alt="banner_img" className='banner-img'/>
               </div>
            </article>)
        })}
    </div>
    <div className="prev" onClick={() => {setIndex(index - 1)}}>
        <ArrowBackIosIcon />
    </div>
    <div className='next' onClick={() => {setIndex(index + 1)}}>
        <ArrowForwardIosIcon />
    </div>
</div>
</>
  );

  }

export default Carousel;