import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import coffeeImg from "../../../assets/coffee-white.png";
import sweetImg from "../../../assets/landingScroll/img1.png";
import coffeeImg2 from "../../../assets/coffee5.png";

import bg1 from "../../../assets/landingScroll/chocolate.webp";
import bg2 from "../../../assets/landingScroll/pink.jpg";
import bg3 from "../../../assets/landingScroll/chocolate1.jpg";

import "./ScrollSection.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollSection = () => {
  useEffect(() => {
    const leftSections = gsap.utils.toArray(".left-side-col > div");
    const rightContainer = document.querySelector(".right-side-col");
    const sectionCount = leftSections.length;

    function setupScrollAnimations() {
      const sectionHeight = window.innerHeight;
      const scrollLength = sectionHeight * sectionCount;

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([leftSections, rightContainer]);

      gsap.set(rightContainer, {
        y: -sectionHeight * (sectionCount - 1),
      });

      gsap.to(leftSections, {
        yPercent: -100 * (sectionCount - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: true,
          pin: ".sticky-container",
          invalidateOnRefresh: true,
        },
      });

      gsap.to(rightContainer, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Image "inside-to-outside" animation
      gsap.utils.toArray(".pop-image").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 0, opacity: 0, transformOrigin: "center" },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: img,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    setupScrollAnimations();
    window.addEventListener("resize", setupScrollAnimations);

    return () => {
      window.removeEventListener("resize", setupScrollAnimations);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="scroll-section scroll-container">
      <div className="sticky-container">
        {/* Left Side */}
        <div className="left-side-col">
          {/* Section 1 Left - Text behind image */}
          <div className="section-1-l behind-text">
            <div
              className="bg-img"
              style={{
                backgroundImage: `url(${bg1})`,
              }}
            ></div>
            <div className="content-parent">
              <h2>Chocolate Coffee</h2>
              <a href="#">
                <h1>
                  A rich blend of premium cocoa and aromatic coffee for a bold,
                  smooth taste.
                </h1>
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>

          {/* Section 2 Left - Text above image */}
          <div className="section-2-l">
            <img
              src={sweetImg}
              width="500"
              height="700"
              alt="Sweets"
              className="pop-image"
            />
            <div className="bg-text">Strawberry Choco Delight</div>
          </div>

          {/* Section 3 Left - Text behind image */}
          <div className="section-3-l behind-text">
            <div
              className="bg-img"
              style={{
                backgroundImage: `url(${bg2})`,
              }}
            ></div>
            <div className="content-parent">
              
              <h2>Sweets Paradise</h2>
              <a href="#">
               
                <h1>
                  A delightful selection of handcrafted sweets to brighten your
                  day.
                </h1>
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side-col">
          {/* Section 3 Right - Text above image */}
          <div className="section-3-r">
            <img
              src={coffeeImg}
              width="500"
              height="700"
              alt="Chocolate Coffee"
              className="pop-image"
            />
            <div className="bg-text">Cappuccino Bliss</div>
          </div>

          {/* Section 2 Right - Text behind image */}
          <div className="section-2-r behind-text">
            <div
              className="bg-img"
              style={{
                backgroundImage: `url(${bg3})`,
              }}
            ></div>
            <div className="content-parent">
              <h2>Dark Roast Mocha</h2>
              <a href="#">
                <h1>
                  Indulge in a perfect mix of dark chocolate and fresh-brewed
                  coffee aroma.
                </h1>
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>

          {/* Section 1 Right - Text above image */}
          <div className="section-1-r">
            <div className="bg-text">Espresso Magic</div>
            <img
              src={coffeeImg2}
              width="500"
              height="700"
              alt="Chocolate Coffee"
              className="pop-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollSection;
