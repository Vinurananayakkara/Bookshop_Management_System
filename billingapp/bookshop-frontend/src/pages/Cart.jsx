import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
            <Link
              to="/books"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/books')}
              className="flex items-center text-blue-600 hover:text-blue-500 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-500 text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cart Items ({cartItems.length})
                </h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.itemsId} className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
                      <div className="w-16 h-20 mr-4 flex-shrink-0">
                        <img
                          src={item.imageUrl || item.image || `https://via.placeholder.com/64x80/f3f4f6/6b7280?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                          className="w-full h-full object-cover rounded shadow-sm"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/64x80/f3f4f6/6b7280?text=${encodeURIComponent(item.name)}`;
                          }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-blue-600 font-semibold">${item.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleQuantityChange(item.itemsId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.itemsId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <span className="text-lg font-semibold text-gray-900 w-20 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => handleRemoveItem(item.itemsId, item.name)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${(getTotalPrice() * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    <span>Free Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
