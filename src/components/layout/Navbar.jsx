import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/oyadeliver_both_textandbird.png';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isAuthenticated, profile, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  let clerkUser = { isSignedIn: false };
  try {
    clerkUser = useUser();
  } catch (e) {
    // ignore — Clerk not configured
  }

  const closeMobileNav = () => setIsMobileNavOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    closeMobileNav();
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-oya-paper/90 backdrop-blur-md border-b border-oya-teal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0" onClick={closeMobileNav}>
            <img
              src={logo}
              alt="Oya Deliver — home"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-oya-teal hover:text-oya-green font-medium transition-colors"
            >
              Groceries
            </Link>
            <Link
              to="/products?category=Deals"
              className="text-oya-teal hover:text-oya-green font-medium transition-colors"
            >
              Weekly Deals
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {!loading && (
              <>
                {clerkConfigured ? (
                  <>
                    {clerkUser?.isSignedIn ? (
                      <>
                        <Link
                          to="/profile"
                          className="text-oya-teal hover:text-oya-amber transition-colors flex items-center gap-1"
                        >
                          <UserButton />
                          <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                            {clerkUser?.user?.fullName ?? 'Account'}
                          </span>
                        </Link>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <SignInButton>
                          <button className="text-oya-teal hover:text-oya-amber transition-colors flex items-center gap-1">
                            <FiUser className="w-6 h-6" />
                            <span className="hidden sm:block text-sm font-medium">Log in</span>
                          </button>
                        </SignInButton>
                        <SignUpButton>
                          <button className="hidden sm:block text-sm font-medium text-oya-teal hover:text-oya-green">
                            Sign up
                          </button>
                        </SignUpButton>
                      </div>
                    )}
                  </>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-oya-teal hover:text-oya-amber transition-colors flex items-center gap-1"
                    >
                      <FiUser className="w-6 h-6" />
                      <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                        {profile?.name ?? 'Account'}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="hidden sm:block text-sm font-medium text-oya-teal hover:text-oya-green"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-oya-teal hover:text-oya-amber transition-colors flex items-center gap-1"
                  >
                    <FiUser className="w-6 h-6" />
                    <span className="hidden sm:block text-sm font-medium">Log in</span>
                  </Link>
                )}
              </>
            )}

            <Link
              to="/cart"
              className="relative text-oya-teal hover:text-oya-green transition-colors"
            >
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-oya-amber text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="md:hidden text-oya-teal p-1"
              aria-label={isMobileNavOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileNavOpen((open) => !open)}
            >
              {isMobileNavOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileNavOpen && (
          <div className="md:hidden pb-4 border-t border-oya-teal/10 pt-4 space-y-3">
            <Link
              to="/products"
              className="block text-oya-teal font-medium py-2"
              onClick={closeMobileNav}
            >
              Groceries
            </Link>
            <Link
              to="/products?category=Deals"
              className="block text-oya-teal font-medium py-2"
              onClick={closeMobileNav}
            >
              Weekly Deals
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block text-oya-teal font-medium py-2"
                  onClick={closeMobileNav}
                >
                  My profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block text-oya-teal font-medium py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-oya-teal font-medium py-2"
                onClick={closeMobileNav}
              >
                Log in
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
