import React from 'react'

const ResponsiveMenu = ({ open, setOpen }) => {
    return (
        <div className={`${open ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 x-30 flex h-screen w-[75%] flex-col justify-between bg-amber-950 px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}>
            <div>
                <nav className='mt-12'>
                   <ul>
  <li><a href="/">Home</a></li>
  <li><a href="#menu">Menu</a></li>
  <li><a href="#about">About</a></li>
  <li><a href="#testimonial">Testimonial</a></li>
  <li><button>Contact</button></li>
</ul>

                </nav>
            </div>
        </div>
    )
}

export default ResponsiveMenu