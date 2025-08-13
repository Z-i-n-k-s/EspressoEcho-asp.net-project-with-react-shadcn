import { motion } from "framer-motion";
import Bean1 from "../../../assets/bean1.png";
import Bean2 from "../../../assets/bean2.png";
import coffee from "../../../assets/coffee2.png";
import Footer from "../componets/footer";
import Header from "../componets/Header";
import AboutPreview from "./AboutPreview";
import Contact from "./Contact";
import InteriorImages from "./InteriorImages";
import Menu from "./Menu";
import Reviews from "./Reviews";
import ScrollSection from "./scroll-section/ScrollSection";

const LandingPage = () => {
  return (
    <div className="">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#e5c185] via-[#a97c50] to-[#4e342e] mt-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center justify-center min-h-screen px-4 relative">
          {/* Text Section */}
          <div className="space-y-5 px-4 md:px-0">
            <motion.h3
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-amber-900 font-semibold font-cursive text-lg"
            >
              Welcome to EspressoEcho___
            </motion.h3>
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold font-cursive2"
            >
              Experience Artisanal{" "}
              <span className="text-amber-900">Coffee</span> at EspressoEcho
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="text-balance text-brown-800"
            >
              Where Every Sip Tells a Story.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.8 }}
              className="flex gap-2"
            >
              <a href="#menu">
                <button className="bg-amber-900 text-white px-4 py-2 rounded-md">
                  View Menu
                </button>
              </a>
              <a href="#story">
                <button className="bg-transparent border border-amber-900 text-amber-900 rounded-md px-4 py-2">
                  Our Story
                </button>
              </a>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.img
            src={coffee}
            alt="Coffee Cup"
            className="w-[500px]"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: "linear",
            }}
          />
          {/* Decorative Beans */}
          <motion.img
            initial={{ opacity: 0, x: 400, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 45 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            src={Bean2}
            alt="Bean Decoration"
            className="absolute hidden md:block bottom-20 left-36 w-20 rotate-45"
          />
          <motion.img
            initial={{ opacity: 0, x: 600, y: 200, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            src={Bean1}
            alt="Bean Decoration"
            className="absolute hidden md:block top-14 left-0 w-20"
          />
          <motion.img
            initial={{ opacity: 0, x: -100, y: 100, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 45 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            src={Bean2}
            alt="Bean Decoration"
            className="absolute hidden md:block w-20 top-0 right-0 -rotate-45"
          />
        </div>
      </div>

      {/* other components */}
      <ScrollSection></ScrollSection>
      <Menu></Menu>
      <AboutPreview></AboutPreview>
      <InteriorImages></InteriorImages>
      <Reviews></Reviews>
      <Contact></Contact>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
