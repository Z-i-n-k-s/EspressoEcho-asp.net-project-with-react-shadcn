import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-center md:text-left">
        
        {/* Brand / Logo */}
        <div>
          <h2 className="text-xl font-bold text-primary">MyApp</h2>
          <p className="text-sm text-muted-foreground mt-2">
            © {new Date().getFullYear()} MyApp. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition">Home</a></li>
            <li><a href="#" className="hover:text-primary transition">About</a></li>
            <li><a href="#" className="hover:text-primary transition">Services</a></li>
            <li><a href="#" className="hover:text-primary transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-primary transition">Facebook</a>
            <a href="#" className="hover:text-primary transition">Twitter</a>
            <a href="#" className="hover:text-primary transition">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
