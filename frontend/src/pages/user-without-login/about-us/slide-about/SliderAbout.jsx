import React, { useState, useEffect } from "react";
import "./SliderAbout.css";

import staff1 from "../../../../assets/staff/staff1.webp";
import staff2 from "../../../../assets/staff/staff2.jpg";
import staff3 from "../../../../assets/staff/staff3.jpg";
import staff4 from "../../../../assets/staff/staff4.avif";
import staff5 from "../../../../assets/staff/staff5.png";
import staff6 from "../../../../assets/staff/staff6.png";
import staff7 from "../../../../assets/staff/staff7.jpg";

const SliderAbout = () => {
  const images = [staff1, staff2, staff3, staff4, staff5, staff6, staff7];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 1500); 

    return () => clearInterval(interval); 
  }, [images.length]);

  const handleClick = (index) => {
    setActiveIndex(index); // set clicked image active immediately
  };

  return (
    <section className="slider-about-container bg-[#a97c50] py-12 px-6">
      {/* Image Slider */}
      <div className="slider-wrapper">
        {images.map((src, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`slider-item ${index === activeIndex ? "active" : ""}`}
          >
            <img src={src} alt={`Staff ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SliderAbout;
