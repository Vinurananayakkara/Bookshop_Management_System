import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { BookOpen, ShoppingCart, User, LogOut, Shield, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to determine if a link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Helper function to get link classes
  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block px-3 py-2 rounded-md transition-all duration-300"
      : "transition-all duration-300";
    
    if (isActive(path)) {
      return isMobile
        ? `${baseClasses} bg-blue-100 text-blue-600 font-semibold text-lg`
        : `${baseClasses} text-blue-600 font-semibold text-lg`;
    }
    
    return isMobile
      ? `${baseClasses} hover:bg-blue-100 hover:text-blue-600`
      : `${baseClasses} hover:text-blue-600`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white text-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-blue-600">PahanaEdu</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={getLinkClasses('/')}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={getLinkClasses('/books')}
            >
              Books
            </Link>
            <Link
              to="/about"
              className={getLinkClasses('/about')}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={getLinkClasses('/contact')}
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "STAFF" && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 ${getLinkClasses('/admin')}`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/cart"
                  className="flex items-center space-x-1 relative hover:text-blue-600 transition-colors duration-300"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-black hover:text-blue-600 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-in-top">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border rounded-lg mt-2 shadow-md">
              <Link
                to="/"
                className={getLinkClasses('/', true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/books"
                className={getLinkClasses('/books', true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Books
              </Link>
              <Link
                to="/about"
                className={getLinkClasses('/about', true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={getLinkClasses('/contact', true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <>
                  {user.role === "STAFF" && (
                    <Link
                      to="/admin"
                      className={getLinkClasses('/admin', true)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </div>
                    </Link>
                  )}

                  <Link
                    to="/cart"
                    className="block px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Cart ({getTotalItems()})</span>
                    </div>
                  </Link>

                  <div className="px-3 py-2 text-base font-medium flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
