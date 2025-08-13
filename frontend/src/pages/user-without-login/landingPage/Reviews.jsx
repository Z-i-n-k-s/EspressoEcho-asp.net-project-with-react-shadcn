import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

// Coffee-themed testimonial data
const TestimonialData = [
  {
    id: 1,
    name: "Takwa",
    text: "Every visit to this café feels like a warm hug. The aroma, the ambiance, and the latte art — absolutely perfect!",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Sombit",
    text: "This place turned me into a coffee lover! The beans are rich, the brews are smooth, and the people are so welcoming.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Zishan",
    text: "I always stop by for their iced caramel macchiato. It's the perfect pick-me-up during a long day.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "Ayesha",
    text: "Feels like a hidden gem. Cozy corners, soft music, and coffee that speaks to your soul. Highly recommended!",
    img: "https://picsum.photos/103/103",
  },
];

const Reviews = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div id="reviews" className="py-20 bg-[#4e342e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-center text-[#e5c185] text-4xl font-bold font-cursive"
          >
            --From Our Coffee Lovers--
          </motion.h1>
        </div>

        {/*  Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div key={data.id} className="my-6">
                <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl  bg-[#e5c185] hover:bg-[#3e2a1a] transition-all hover:text-white relative shadow-xl duration-300  relative">
                  {/* Image */}
                  <div className="mb-4 flex justify-center">
                    <img
                      src={data.img}
                      alt={data.name}
                      className="rounded-full w-20 h-20"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col items-center gap-4 hover:text-gray-300">
                    <div className="space-y-3">
                      <p className="text-sm text-center">{data.text}</p>
                      <h1 className="text-lg font-bold font-cursive2 text-center">
                        {data.name}
                      </h1>
                    </div>
                  </div>

                  {/* Quotation mark */}
                  <p className="text-amber-900/20 text-9xl font-serif absolute top-0 right-4 select-none">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
