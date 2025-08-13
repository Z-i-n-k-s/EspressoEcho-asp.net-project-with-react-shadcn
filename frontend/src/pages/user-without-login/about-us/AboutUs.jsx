import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Header from "../componets/Header";
import Footer from "../componets/footer";
import SliderAbout from "./slide-about/SliderAbout";
import missionImg from "../../../assets/staff/staff10.avif";
import missionImg1 from "../../../assets/staff/staff11.png";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // animate every scroll
  }, []);

  const teamMembers = [
    {
      name: "Janina",
      role: "Founder & CEO",
      description:
        "Alice founded our coffee shop with a dream to bring exceptional coffee experiences to everyone.",
    },
    {
      name: "Ayesha Rahman",
      role: "Chief Barista",
      description:
        "Ayesha crafts our signature blends and ensures every cup is perfect.",
    },
    {
      name: "Takwa Jahin Feeza",
      role: "Head of Community",
      description:
        "Takwa builds connections and organizes events to grow our coffee community.",
    },
    {
      name: "Sombit Mazumdar",
      role: "Operations Manager",
      description:
        "Sombit keeps the shop running smoothly and the team coordinated.",
    },
    {
      name: "Zishan Rezwan",
      role: "Marketing Director",
      description:
        "Emily spreads the love of our coffee through creative marketing and outreach.",
    },
  ];

  // Manual slider state
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - visibleCount < 0 ? teamMembers.length - visibleCount : prev - visibleCount
    );
  };

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= teamMembers.length ? 0 : prev + visibleCount
    );
  };

  const visibleMembers = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleMembers.push(teamMembers[(startIndex + i) % teamMembers.length]);
  }

  return (
    <div className="flex flex-col bg-[#e5c185] text-foreground min-h-screen mx-auto">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow py-12 mx-auto px-4 sm:px-6 max-w-7xl">
        {/* About Us Heading */}
        <div className="text-center mb-10 mt-10" data-aos="fade-down">
          <h2 className="text-4xl font-bold font-[Inter]">
            -- <span className="text-yellow-600">A</span>bout{" "}
            <span className="text-[#3e2a1a]">Us</span>--
          </h2>
          <p className="mt-4 text-lg text-black max-w-2xl mx-auto">
            At our coffee shop, we believe every cup tells a story. Our team blends
            passion, quality, and a love for rich flavors to create moments you’ll
            savor.
          </p>
        </div>

        <SliderAbout />

        {/* Mission & Vision */}
        <div className="md:px-8">
          <div
            className="grid md:grid-cols-2 gap-8 mb-12 items-center p-6 md:p-10"
            data-aos="fade-up"
          >
            {/* Image Section */}
            <div className="flex justify-center" data-aos="fade-right">
              <img
                src={missionImg}
                alt="Our Mission and Vision"
                className="rounded-xl max-w-full h-auto object-cover"
              />
            </div>

            {/* Text Section */}
            <div className="text-yellow-700" data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-4 font-[Inter]">
                <span className="text-[#4e342e]">Our</span> Mission
              </h2>
              <p className="text-black mb-6 leading-relaxed">
                Our mission is to bring people together over the perfect cup of
                coffee. We are dedicated to crafting rich, aromatic brews from
                ethically sourced beans, ensuring every sip delivers warmth,
                comfort, and connection. We believe coffee is more than a
                drink—it’s an experience that inspires conversations, sparks
                creativity, and fuels everyday moments.
              </p>

              <h2 className="text-3xl font-bold mb-4 font-[Inter]">
                <span className="text-[#4e342e]">Our</span> Vision
              </h2>
              <p className="text-black leading-relaxed">
                Our vision is to become the go-to coffee destination for
                enthusiasts around the world, blending tradition with
                innovation. We aim to create a welcoming space—both online and
                in-store—where coffee lovers can explore unique flavors, learn
                brewing techniques, and share their passion for quality coffee.
                Through sustainability, community engagement, and excellence,
                we aspire to make every coffee moment unforgettable.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="mb-12 md:px-8 bg-[#a97c50] pt-10 rounded-lg">
          <h2
            className="text-4xl font-bold text-center font-[Inter] mb-8 text-[#4e342e]"
            data-aos="fade-down"
          >
            --Our Story--
          </h2>
          <div
            className="grid md:grid-cols-2 gap-8 items-center font-[Inter]"
            data-aos="fade-up"
          >
            {/* Story Text - left */}
            <div className="text-black text-lg leading-relaxed">
              <p>
                Founded with a passion for great coffee and community, our story
                began in a small shop with a simple goal: to craft exceptional
                coffee that brings people together. Over the years, we have grown
                while staying true to our roots — focusing on quality,
                sustainability, and meaningful connections.
              </p>
              <p className="mt-4">
                Our dedicated team sources the finest beans, embraces traditional
                brewing methods, and continuously innovates to provide a unique
                coffee experience. Whether you’re here to enjoy a quiet moment or
                connect with friends, our story is one of warmth, creativity, and
                shared moments over coffee.
              </p>
            </div>

            {/* Image - right */}
            <div className="flex justify-center">
              <img
                src={missionImg1}
                alt="Our Story"
                className="rounded-xl max-w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Team Section with side arrows */}
        <section
          data-aos="fade-up"
          className="mb-16 relative max-w-7xl mx-auto px-4 sm:px-6"
        >
          <h2 className="text-3xl font-bold font-[Inter] text-center mb-8 text-[#4e342e]">
            --Meet Our Team--
          </h2>

          <div className="relative flex items-center justify-center px-12">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute left-0 z-10 p-2 rounded-full bg-[#4e342e] hover:bg-[#3b271f] text-white transition"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
              {visibleMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl shadow-md bg-[#a97c50] text-center flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="w-24 h-24 mx-auto rounded-full bg-primary mb-4 flex items-center justify-center text-white text-2xl font-bold uppercase">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <h3 className="text-xl text-white font-semibold">{member.name}</h3>
                    <p className="text-gray-700 mb-2">{member.role}</p>
                    <p className="text-sm text-black">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute right-0 z-10 p-2 rounded-full bg-[#4e342e] hover:bg-[#3b271f] text-white transition"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
