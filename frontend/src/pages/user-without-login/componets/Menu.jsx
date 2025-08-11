import React from "react";
import Img1 from "../../../assets/coffee-white.png";
import Img2 from "../../../assets/coffee2.png";
import { motion } from "framer-motion";
import {  useNavigate } from "react-router-dom";

const MenuData = [
  {
    id: 1,
    img: Img1,
    name: "Espresso",
    description: "A rich and bold shot of pure coffee bliss, perfect to kickstart your day.",
    price: 150, 
  },
  {
    id: 2,
    img: Img2,
    name: "Cappuccino",
    description: "Creamy, frothy, and perfectly brewed with steamed milk and espresso.",
    price: 220,
  },
  {
    id: 1,
    img: Img1,
    name: "Cheesecake Slice",
    description: "Smooth and creamy cheesecake with a buttery graham cracker crust.",
    price: 250,
  }

];

const Menu = () => {
  const navigate = useNavigate();
  return (
    <div id="menu" className="py-20 bg-[#4e342e]"> {/* dark brown background */}
      <div className="max-w-7xl mx-auto">
        {/* Heading section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-4xl font-bold font-cursive text-[#e5c185]"
          >
           -- Best Coffee & Sweets for You--
          </motion.h1>
        </div>

        {/* menu card section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 md:gap-5 place-items-center"
        >
          {MenuData.map((menu) => (
            <div
              key={menu.id}
              className="rounded-2xl bg-[#e5c185] hover:bg-[#3e2a1a] transition-all hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
            >
              <div className="h-[122px]">
                <img
                  src={menu.img}
                  alt={menu.name}
                  className="max-w-[200px] block mx-auto transform -translate-y-14 group-hover:scale-105 group-hover:rotate-6 duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h1 className="text-xl font-bold">{menu.name}</h1>
                <p className="text-gray-700 group-hover:text-white duration-300 text-sm line-clamp-3">
                  {menu.description}
                </p>
                <div className="flex justify-between mt-5 px-6 items-center">
                  <p className="text-lg font-semibold">{menu.price} BDT</p>
                  <button className="bg-amber-900 text-white px-3 py-2 rounded-md group-hover:bg-white group-hover:text-amber-900 transition-colors duration-300">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>


{/* View All Menu Button */}
<div className="flex justify-center mt-10">
<button
  className="px-6 py-3 bg-amber-900 text-white hover:bg-[#3e2a1a] hover:text-white transition-colors duration-300 text-lg font-semibold rounded-xl shadow-md border border-[#3e2a1a]"
  onClick={() => navigate("/menu-user")}
>
  View Full Menu
</button>

</div>

      </div>
    </div>
  );
};

export default Menu;
