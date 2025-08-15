import React, { useEffect } from "react";
import Header from "@/pages/user-without-login/componets/Header";
import AOS from "aos";
import "aos/dist/aos.css";

const Offers = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const offersData = [
    {
      id: 1,
      title: "Buy 1 Get 1 Free",
      description: "Applicable on all espresso drinks this week.",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
      discount: "50% OFF"
    },
    {
      id: 2,
      title: "Weekend Special",
      description: "Free dessert with any large coffee order.",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      discount: "FREE DESSERT"
    },
    {
      id: 3,
      title: "Happy Hour",
      description: "Half price on cappuccinos from 3-5 PM daily.",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
      discount: "50% OFF"
    }
  ];

  return (
    <div className="bg-[#e5c185] min-h-screen">
      <Header />

      {/* === Banner Section === */}
      <section className="relative h-72 bg-gradient-to-r from-[#4e342e] to-[#3e2723] flex items-center justify-center overflow-hidden mt-10">
        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
          alt="Offers Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div
          className="relative z-10 text-center text-white px-4"
          data-aos="fade-up"
        >
          <h1 className="text-4xl text-[#e5c185] sm:text-5xl font-bold mb-3 animate-bounce">
            Exclusive Coffee Offers
          </h1>
          <p className="text-lg sm:text-xl font-light">
            Enjoy the best deals, fresh from our roastery!
          </p>
        </div>
      </section>

      {/* === Offers List === */}
      <section className="max-w-7xl mx-auto py-12 px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {offersData.map((offer) => (
          <div
            key={offer.id}
            className="bg-[#3e2723] text-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:bg-[#5d4037] hover:scale-105"
            data-aos="fade-up"
          >
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full mb-2">
                {offer.discount}
              </span>
              <h2 className="text-xl font-semibold mb-2">{offer.title}</h2>
              <p className="text-sm opacity-90">{offer.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Offers;
