import React, { useEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from '../componets/Header';
import './Branches.css';

import image from "../../../assets/branches/eeed-removebg-preview.png";          // main bottle image
import Footer from '../componets/Footer';

gsap.registerPlugin(ScrollTrigger);

const Branches = () => {
  useEffect(() => {
    const header = document.querySelector("header");

    // Mobile Menu Toggle (if needed)
    window.toggleMobileNav = function () {
      document.getElementById("mobileMenu")?.classList.toggle("show");
    };

    // Function to reset elements to initial hidden state
    function resetToInitialState(elements) {
      elements.forEach(element => {
        const selector = element.selector;
        gsap.set(selector, element.initialState);
      });
    }

    // Initial Page Load Animations
    function runInitialAnimations() {
      const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Set initial states for all animated elements
      gsap.set(".hero-content h1 span", {
        opacity: 0,
        z: -200,
        rotationY: -90,
        scale: 0.5,
        transformOrigin: "center center"
      });

      gsap.set(".hero-content p", {
        opacity: 0,
        y: 50
      });

      // Set bottle to be visible from start after initial animation
      gsap.set(".hero-bottle-wrapper", {
        opacity: 0,
        scale: 0.5
      });

      // Animate bottle on initial load
      gsap.to(".hero-bottle-wrapper", {
        opacity: 1,
        scale: 1,
        duration: 1.3,
        delay: 1,
        ease: "power3.out",
      });

      // Set initial states for intro section
      gsap.set(".intro-left .small-title", {
        opacity: 0,
        x: -150,
        z: -100,
        rotationY: 45
      });

      gsap.set(".intro-left .main-heading", {
        opacity: 0,
        x: -200,
        z: -150,
        rotationY: 60,
        scale: 0.8
      });

      gsap.set(".intro-left .description", {
        opacity: 0,
        x: -100,
        z: -80,
        rotationY: 30
      });

      gsap.set(".intro-right", {
        opacity: 0,
        x: 200,
        z: -100,
        rotationY: -45
      });

      // Only run header and nav animations on load
      onLoadTl
        .to("header", { "--border-width": "100%", duration: 3 }, 0)
        .from(".desktop-nav a", {
          y: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }, 0);
    }

    // Hero section animation function (without bottle animation)
    function animateHeroSection() {
      const heroTl = gsap.timeline();
      
      // Enhanced H1 forward animation
      heroTl
        .to(".hero-content h1 span", {
          opacity: 1,
          z: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.5,
          stagger: 0.3,
          ease: "back.out(1.7)",
        })
        // Add a subtle bounce effect to make it more dramatic
        .to(".hero-content h1 span", {
          z: 50,
          duration: 0.4,
          stagger: 0.2,
          ease: "power2.out",
        }, 1.5)
        .to(".hero-content h1 span", {
          z: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "bounce.out",
        }, 1.9)
        .to(".hero-content p", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }, 2.5);
        // Removed bottle animation from here - it stays visible
    }

    // Intro section animation function
    function animateIntroSection() {
      const introTl = gsap.timeline();
      
      introTl
        // Animate left side content coming from left
        .to(".intro-left .small-title", {
          opacity: 1,
          x: 0,
          z: 0,
          rotationY: 0,
          duration: 1,
          ease: "back.out(1.7)",
        })
        .to(".intro-left .main-heading", {
          opacity: 1,
          x: 0,
          z: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
        }, 0.2)
        .to(".intro-left .description", {
          opacity: 1,
          x: 0,
          z: 0,
          rotationY: 0,
          duration: 1,
          ease: "back.out(1.7)",
        }, 0.4)
        // Animate right side content coming from right
        .to(".intro-right", {
          opacity: 1,
          x: 0,
          z: 0,
          rotationY: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
        }, 0.3);
    }

    // Function to reset hero section to initial state (excluding bottle)
    function resetHeroSection() {
      gsap.set(".hero-content h1 span", {
        opacity: 0,
        z: -200,
        rotationY: -90,
        scale: 0.5,
        transformOrigin: "center center"
      });
      gsap.set(".hero-content p", {
        opacity: 0,
        y: 50
      });
      // Keep bottle visible - don't reset it
    }

    // Function to reset intro section to initial state
    function resetIntroSection() {
      gsap.set(".intro-left .small-title", {
        opacity: 0,
        x: -150,
        z: -100,
        rotationY: 45
      });
      gsap.set(".intro-left .main-heading", {
        opacity: 0,
        x: -200,
        z: -150,
        rotationY: 60,
        scale: 0.8
      });
      gsap.set(".intro-left .description", {
        opacity: 0,
        x: -100,
        z: -80,
        rotationY: 30
      });
      gsap.set(".intro-right", {
        opacity: 0,
        x: 200,
        z: -100,
        rotationY: -45
      });
    }

    // Scroll animations for all sections
    function setupScrollAnimations() {
      const headerOffset = header.offsetHeight - 1;

      // Hero section scroll animations - bidirectional
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          animateHeroSection();
        },
        onLeave: () => {
          resetHeroSection();
        },
        onEnterBack: () => {
          animateHeroSection();
        },
        onLeaveBack: () => {
          resetHeroSection();
        }
      });

      // Intro section scroll animations - bidirectional
      ScrollTrigger.create({
        trigger: ".section-intro",
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          animateIntroSection();
        },
        onLeave: () => {
          resetIntroSection();
        },
        onEnterBack: () => {
          animateIntroSection();
        },
        onLeaveBack: () => {
          resetIntroSection();
        }
      });

      // Original bottle pin animation for larger screens
      ScrollTrigger.matchMedia({
        "(min-width: 769px)": function () {
          gsap.timeline({
            scrollTrigger: {
              trigger: ".hero",
              start: `top top+=${headerOffset}`,
              endTrigger: ".section-intro",
              end: `top top+=${headerOffset}`,
              scrub: true,
              pin: ".hero-bottle-wrapper",
              pinSpacing: false,
              invalidateOnRefresh: true,
            },
          }).to(".hero-bottle", { rotate: 0, scale: 0.8 });
        },
      });
    }

    runInitialAnimations();
    setupScrollAnimations();
    ScrollTrigger.refresh();

    // Cleanup ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div>
      <Header />

      <main id="smooth-content">
        {/* Hero Bottle */}
        <div className="hero-bottle-wrapper">
          <img src={image} alt="Expresso Echo Coffee" className="hero-bottle" />
        </div>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            {/* <img src={stamp} alt="Expresso Echo Stamp" className="hero-stamp" /> */}
            <h1 style={{ perspective: '1000px' }}>
              <span className='block text-[#4e342e]' style={{ transformStyle: 'preserve-3d' }}>Espresso</span>
              <span className='block text-[#4e342e]' style={{ transformStyle: 'preserve-3d' }}>Echo</span>
            </h1>
            <p className='text-xl text-[#4e342e]'>
              Discover the rich heritage of our premium coffee shops spread across Bangladesh, 
              where every cup tells a story of tradition, quality, and community connection.
            </p>
          </div>
        </section>

        {/* Intro Section */}
        <section className="section-intro" style={{ perspective: '1200px' }}>
          <div className="intro-grid">
            <div className="intro-left" style={{ transformStyle: 'preserve-3d' }}>
              <p className="small-title" style={{ transformStyle: 'preserve-3d' }}>Our Story</p>
              <h2 className="main-heading" style={{ transformStyle: 'preserve-3d' }}>Coffee Culture</h2>
              <p className="description" style={{ transformStyle: 'preserve-3d' }}>
                Expresso Echo has been serving exceptional coffee experiences across Bangladesh since our founding. 
                We blend traditional brewing methods with modern coffee culture, creating spaces where communities 
                gather and connections flourish. Each of our branches reflects the unique character of its 
                neighborhood while maintaining our commitment to premium quality and authentic hospitality. 
                From the bustling streets of Dhaka to the serene corners of Chittagong, we bring the finest 
                coffee culture to every corner of our beautiful nation.
              </p>
            </div>

            <div className="intro-right" style={{ transformStyle: 'preserve-3d' }}>
              <div className="ingredients-log">
                <h3 className="ingredients-title">Our Locations</h3>

                <div className="ingredient-item">
                  <div className="ingredient-qty">1</div>
                  <div className="ingredient-text">
                    <strong>Dhaka Division</strong>
                    <p>Gulshan, Dhanmondi, Uttara, Banani, Old Dhaka, Wari, Mirpur, Mohammadpur, Tejgaon, Ramna, Motijheel, Farmgate</p>
                     <p>+0123456789</p>
                  </div>
                </div>

                <div className="ingredient-item">
                  <div className="ingredient-qty">2</div>
                  <div className="ingredient-text">
                    <strong>Chittagong Division</strong>
                    <p>Chittagong City, Cox's Bazar, Comilla, Feni, Brahmanbaria, Noakhali, Chandpur, Lakshmipur</p>
                    <p>+0123456789</p>
                  </div>
                </div>

                <div className="ingredient-item">
                  <div className="ingredient-qty">3</div>
                  <div className="ingredient-text">
                    <strong>Sylhet Division</strong>
                    <p>Sylhet City, Moulvibazar, Habiganj, Sunamganj, Bianibazar, Golapganj</p>
                    <p>+0123456789</p>
                  </div>
                </div>

                <div className="ingredient-item">
                  <div className="ingredient-qty">4</div>
                  <div className="ingredient-text">
                    <strong>Rajshahi Division</strong>
                    <p>Rajshahi City, Bogura, Pabna, Sirajganj, Natore</p>
                    <p>+0123456789</p>
                  </div>
                </div>

                <div className="ingredient-item">
                  <div className="ingredient-qty">5</div>
                  <div className="ingredient-text">
                    <strong>Khulna Division</strong>
                    <p>Khulna City, Jessore, Kushtia, Satkhira</p>
                    <p>+0123456789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
};


// https://youtu.be/19STv_39DbY?si=pD_VqkQxs7GrIonN


export default Branches;