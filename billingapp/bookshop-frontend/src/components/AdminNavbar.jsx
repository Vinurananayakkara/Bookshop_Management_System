import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, BarChart3, Users, Settings, LogOut, Menu, X, Shield } from "lucide-react";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-200" />
              <span className="font-bold text-xl">PahanaEdu Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/admin"
              className="flex items-center space-x-1 hover:text-blue-200 transition-colors duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center space-x-1 hover:text-blue-200 transition-colors duration-300"
            >
              <BookOpen className="h-4 w-4" />
              <span>Books</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center space-x-1 hover:text-blue-200 transition-colors duration-300"
            >
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </Link>
            <Link
              to="/"
              className="hover:text-blue-200 transition-colors duration-300"
            >
              View Store
            </Link>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-700 px-3 py-1 rounded-full">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">{user.username}</span>
                  <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">{user.role}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-blue-200 transition-colors duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-200 transition-colors duration-300"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-800 border border-blue-700 rounded-lg mt-2 shadow-lg">
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Books</span>
                </div>
              </Link>
              <Link
                to="/admin"
                className="block px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Customers</span>
                </div>
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                View Store
              </Link>

              {user && (
                <>
                  <div className="px-3 py-2 text-sm flex items-center space-x-2 bg-blue-700 rounded-md">
                    <Shield className="h-4 w-4" />
                    <span>{user.username}</span>
                    <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">{user.role}</span>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
