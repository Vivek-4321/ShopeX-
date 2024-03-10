import React from 'react';
import './PageNotFound.css';
import Image from './404-image.jpg';

function PageNotFound() {
  return (
    <div className='page-not-found-cont'>
      <div className='page-not-found-cont-left'>
        <h1>Oops Wrong Turn</h1>
        <p className='p-des'></p>
      </div>
      <img className="page-not-found" src={Image} alt="404-image"/></div>
  )
}

export default PageNotFound;