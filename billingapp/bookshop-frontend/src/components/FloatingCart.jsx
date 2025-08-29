import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, getTotalItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();

  if (getTotalItems() === 0) {
    return null; // Don't show floating cart if empty
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group relative"
        >
          <ShoppingCart className="h-6 w-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
              {getTotalItems()}
            </span>
          )}
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500"></div>
        </button>
      </div>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              Cart ({getTotalItems()})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-64 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="p-2">
                {cartItems.map((item) => (
                  <div key={item.itemsId} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <img
                      src={item.imageUrl || item.image || `https://via.placeholder.com/60x80/f3f4f6/6b7280?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      className="w-12 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/60x80/f3f4f6/6b7280?text=${encodeURIComponent(item.name)}`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-blue-600 font-semibold">${item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.itemsId, item.quantity - 1)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemsId, item.quantity + 1)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.itemsId)}
                      className="text-red-400 hover:text-red-600 transition-colors duration-200 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition-all duration-300"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingCart;
