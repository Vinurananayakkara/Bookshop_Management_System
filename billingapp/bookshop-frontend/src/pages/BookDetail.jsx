import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { itemsAPI } from '../services/api';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await itemsAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (book && book.stock >= quantity) {
      addToCart({
        itemsId: book.itemsId || book.id,
        id: book.id,
        name: book.name,
        price: book.price,
        imageUrl: book.imageUrl || `https://via.placeholder.com/300x400/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`,
        image: book.imageUrl || `https://via.placeholder.com/300x400/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`,
        maxQuantity: book.stock
      }, quantity);
      toast.success(`${quantity} ${quantity === 1 ? 'copy' : 'copies'} of ${book.name} added to cart!`);
    } else {
      toast.error('Not enough stock available');
    }
  };

  const incrementQuantity = () => {
    if (quantity < book.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Book not found</h3>
          <button
            onClick={() => navigate('/books')}
            className="text-blue-600 hover:text-blue-500"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/books')}
          className="flex items-center text-blue-600 hover:text-blue-500 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Books
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Book Image */}
            <div className="p-8">
              <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${book.imageUrl ? 'hidden' : 'flex'}`}>
                  <BookOpen className="h-32 w-32 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">(4.5) • 128 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">${book.price}</span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  book.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              {/* Book Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="ml-2 text-gray-900">Paperback</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pages:</span>
                    <span className="ml-2 text-gray-900">320</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Language:</span>
                    <span className="ml-2 text-gray-900">English</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Publisher:</span>
                    <span className="ml-2 text-gray-900">BookShop Publishing</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector and Add to Cart */}
              {book.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= book.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Related books will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
