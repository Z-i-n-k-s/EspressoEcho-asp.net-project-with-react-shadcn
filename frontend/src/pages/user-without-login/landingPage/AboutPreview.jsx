import React from 'react';
import Bg from '../../../assets/bg.png';
import Lottie from 'lottie-react';
import coffee from '../../../assets/Coffeeanime.json';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const bgImage = {
  backgroundImage: `url(${Bg})`,
  backgroundColor: "#a74f32ff",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const AboutPreview = () => {
    const navigate = useNavigate();
    
  return (
    <div id="about" className="md:py-20 py-40" style={bgImage}>
      <motion.h1
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="text-amber-900 font-cursive2 text-5xl text-center font-bold"
      >
        --About Us--
      </motion.h1>

      <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto">
        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <Lottie animationData={coffee} className="md:w-[600px]" />
        </motion.div>

        {/* Text Section */}
        <div className="space-y-4 px-4 md:px-0">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-2xl font-cursive text-amber-900 font-bold"
          >
            Welcome to EspressoEcho
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="text-brown-800 font-cursive2"
          >
            Founded in 2025, <strong>EspressoEcho</strong> is your new favorite spot for premium coffee, dreamy desserts, and cozy conversations.
            Whether you're craving artisanal espresso, freshly baked treats, or a warm space to unwind, our shop blends elegance with comfort to bring you the best café experience in town.
          </motion.p>

          {/* Show More Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
             <button
      onClick={() => navigate("/about-us")}
      className="mt-4 bg-amber-900 text-white hover:bg-[#3e2a1a] hover:text-white transition-colors duration-300 text-lg font-semibold rounded-xl shadow-md px-6 py-2"
    >
      Show More...
    </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPreview;
