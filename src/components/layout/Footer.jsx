import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/oyadeliver_both_textandbird.png";

const Footer = () => {
  return (
    <footer className="bg-oya-teal text-oya-paper py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="rounded-lg border border-oya-paper/10 bg-oya-paper/10 p-5">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={logo}
              alt="Oya Deliver Logo"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-sm text-oya-paper/80">
            Fresh groceries delivered in minutes.
          </p>
        </div>

        <div className="rounded-lg border border-oya-paper/10 bg-oya-paper/10 p-5">
          <h3 className="text-lg font-bold mb-4 text-oya-amber">Shop</h3>
          <ul className="space-y-2 text-oya-paper/80">
            <li>
              <Link
                to="/products"
                className="hover:text-oya-amber transition-colors"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=Fruits"
                className="hover:text-oya-amber transition-colors"
              >
                Fruits & Veg
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=Dairy"
                className="hover:text-oya-amber transition-colors"
              >
                Dairy & Eggs
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-oya-paper/10 bg-oya-paper/10 p-5">
          <h3 className="text-lg font-bold mb-4 text-oya-amber">Company</h3>
          <ul className="space-y-2 text-oya-paper/80">
            <li>
              <Link to="#" className="hover:text-oya-amber transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-oya-amber transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-oya-amber transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-oya-paper/10 bg-oya-paper/10 p-5">
          <h3 className="text-lg font-bold mb-4 text-oya-amber">Legal</h3>
          <ul className="space-y-2 text-oya-paper/80">
            <li>
              <Link to="#" className="hover:text-oya-amber transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-oya-amber transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-oya-amber/20 text-center text-sm text-oya-paper/70">
        &copy; {new Date().getFullYear()} Oya Deliver. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
