import React, { useState } from "react";
import "react-multi-carousel/lib/styles.css";
// import "./carousel.css";
import "./SingleProduct.css";
import './ImageCarousel.css'

function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="top-single-product-container">
    <div className="single-image-carousel">
      <div className="single-image" style={{ padding:"1rem" ,width: "30rem", height: "500px" }}>
      <img src={images && images[activeIndex]} style={{ width: "100%", height: "100%" , objectFit:'contain'}} />
      </div>
      <div className="image-array"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {images && images.map((image, index) => (
          <img
            key={index}
            src={image}
            style={{
              width: "30px",
              height: "50px",
              margin: "10px",
              border: index === activeIndex ? "3px solid black" : "1px solid gray",
              cursor: "pointer",
            }}
            onClick={() => handleClick(index)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        ))}
      </div>
    </div>
    </div>
  );
}

export default ImageCarousel;