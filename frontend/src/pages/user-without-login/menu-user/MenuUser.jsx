import React, { useEffect } from 'react';
import Header from '../componets/Header';
import './Menu.css';

import menu1 from '../../../assets/menu/menu1.jpg';
import menu2 from '../../../assets/menu/menu5.jpg';
import menu3 from '../../../assets/menu/menu3.jpg';
import menu4 from '../../../assets/menu/menu4.jpg';
import menu5 from '../../../assets/menu/menu5.jpg';
import menu6 from '../../../assets/menu/menu6.jpg';
import AllMenu from './AllMenu';
import Footer from '../componets/Footer';

const MenuUser = () => {
  const products = [
    { name: 'Espresso', description: 'Strong and bold espresso shot, perfect to kickstart your day.', img: menu1 },
    { name: 'Chocolate Muffin', description: 'Soft, moist, and loaded with rich chocolate chunks.', img: menu2 },
    { name: 'Blueberry Tart', description: 'Fresh blueberries baked in a creamy tart shell.', img: menu3 },
    { name: 'Cappuccino', description: 'Smooth espresso topped with steamed milk foam.', img: menu4 },
    { name: 'Whipped Cream Delight', description: 'Light and fluffy whipped cream topping, perfect for desserts.', img: menu5 },
    { name: 'Caramel Drizzle', description: 'Sweet and sticky caramel sauce to drizzle over your favorites.', img: menu6 },
  ];

  useEffect(() => {
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const image = document.querySelector('.images');
    const contents = document.querySelectorAll('.content .item');

    let rotate = 0;
    let active = 0;
    const countItem = products.length;
    const rotateAdd = -360 / countItem;

    function show() {
      image.style.setProperty('--rotate', rotate + 'deg');
      contents.forEach((content, key) => {
        content.classList.toggle('active', key === active);
      });
    }

    function nextSlider() {
      active = (active + 1) % countItem;
      rotate += rotateAdd;
      show();
    }

    function prevSlider() {
      active = (active - 1 + countItem) % countItem;
      rotate -= rotateAdd;
      show();
    }

    next.onclick = nextSlider;
    prev.onclick = prevSlider;

    const autoNext = setInterval(nextSlider, 2000);
    return () => clearInterval(autoNext);
  }, []);

  return (
    <div>
      <Header />
      <div className="slider">
        <div className="title">Espresso Echo!</div>

        {/* Content */}
        <div className="content">
          {products.map((p, i) => (
            <div className={`item ${i === 0 ? 'active' : ''}`} key={i}>
              <h1>{p.name}</h1>
              <div className="des">{p.description}</div>
              <button>See more</button>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="images">
          {products.map((p, i) => (
            <div className="item" style={{ '--i': i + 1 }} key={i}>
              <img src={p.img} alt={p.name} />
            </div>
          ))}
        </div>

        <button id="prev">&#10094;</button>
        <button id="next">&#10095;</button>
      </div>

      <AllMenu />
      <Footer />
    </div>
  );
};


export default MenuUser;
