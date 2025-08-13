import React from 'react';

import shop1 from '../../../assets/shopImage/shop1.jpeg';
import shop2 from '../../../assets/shopImage/shop2.jpeg';
import shop3 from '../../../assets/shopImage/shop3.png';
import shop4 from '../../../assets/shopImage/shop4.jpeg';
import shop5 from '../../../assets/shopImage/shop5.webp';
import shop6 from '../../../assets/shopImage/shop6.jpg';
import shop7 from '../../../assets/shopImage/shop7.jpg';

// Repeat some images to help fill space naturally
const images = [
  shop1, shop2, shop3, shop4, shop5, shop6, shop7,
  shop1, shop4 // added some again
];

const InteriorImages = () => {
  return (
    <div className="py-16 px-6 bg-[#e5c185]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#3e2a1a] mb-4">--Our Cozy Corners--</h2>
        <p className="text-lg text-[#3e2a1a] max-w-2xl mx-auto">
          A glimpse of the warm and welcoming ambiance that makes our coffee shop a perfect place to relax, work, or catch up with friends.
        </p>
      </div>

      {/* Masonry layout with image repeat and clean spacing */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="mb-4 break-inside-avoid overflow-hidden rounded-lg shadow">
            <img
              src={src}
              alt={`Shop Interior ${index + 1}`}
              className="w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteriorImages;
