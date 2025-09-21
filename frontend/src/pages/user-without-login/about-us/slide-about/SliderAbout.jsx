import React, { useState, useEffect } from 'react';
import './SliderAbout.css';

import staff1 from "../../../../assets/staff/staff1.webp";
import staff2 from "../../../../assets/staff/staff2.jpg";
import staff3 from "../../../../assets/staff/staff3.jpg";
import staff4 from "../../../../assets/staff/staff4.avif";
import staff5 from "../../../../assets/staff/staff5.png";
import staff6 from "../../../../assets/staff/staff6.png";
import staff7 from "../../../../assets/staff/staff7.jpg";

const SliderAbout = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [staff1, staff2, staff3, staff4, staff5, staff6, staff7];

  // Automatic sliding effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1500); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="slider-about-container bg-[#a97c50] py-12 px-6">
      {/* Image Slider */}
      <div className="slider-wrapper">
        {images.map((src, index) => (
          <div
            key={index}
            className={`slider-item ${index === activeIndex ? 'active' : ''}`}
          >
            <img src={src} alt={`Staff ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SliderAbout;