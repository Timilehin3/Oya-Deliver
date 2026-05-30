import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Oyadeliver_logo.png';

const Footer = () => {
  return (
    <footer className="bg-oya-teal text-oya-paper py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Oya Deliver Logo" 
              className="h-16 w-auto object-contain bg-oya-paper rounded-xl p-1"
            />
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-oya-paper">oya</span>
              <span className="text-oya-green">deliver</span>
            </div>
          </Link>
          <p className="text-sm opacity-80 mt-2">
            Fresh groceries delivered in minutes.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-oya-amber">Shop</h3>
          <ul className="space-y-2 opacity-80">
            <li><Link to="/products" className="hover:text-oya-amber transition-colors">All Products</Link></li>
            <li><Link to="/products?category=Fruits" className="hover:text-oya-amber transition-colors">Fruits & Veg</Link></li>
            <li><Link to="/products?category=Dairy" className="hover:text-oya-amber transition-colors">Dairy & Eggs</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-oya-amber">Company</h3>
          <ul className="space-y-2 opacity-80">
            <li><Link to="#" className="hover:text-oya-amber transition-colors">About Us</Link></li>
            <li><Link to="#" className="hover:text-oya-amber transition-colors">Careers</Link></li>
            <li><Link to="#" className="hover:text-oya-amber transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-oya-amber">Legal</h3>
          <ul className="space-y-2 opacity-80">
            <li><Link to="#" className="hover:text-oya-amber transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-oya-amber transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/20 text-center opacity-60 text-sm">
        &copy; {new Date().getFullYear()} Oya Deliver. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
