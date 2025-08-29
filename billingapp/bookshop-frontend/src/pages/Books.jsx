import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Eye, Plus, Minus, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI } from '../services/api';
import toast from 'react-hot-toast';
import HeroSlideshow from '../components/HeroSlideshow';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [bookTypes, setBookTypes] = useState([]);
  const [selectedBookType, setSelectedBookType] = useState('');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // Animation refs (temporarily disabled)
  // const headerRef = useScrollAnimation();
  // const searchRef = useScrollAnimation();
  // const gridRef = useScrollAnimation();

  // Slideshow images for books page
  const slideshowImages = [
    {
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      title: "Discover Your Next Great Read",
      description: "Explore thousands of books across all genres and categories"
    },
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "Immerse Yourself in Stories",
      description: "From bestsellers to hidden gems, find your perfect book"
    },
    {
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
      title: "Knowledge at Your Fingertips",
      description: "Educational, inspirational, and entertaining books await"
    },
    {
      url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e",
      title: "Your Literary Journey Starts Here",
      description: "Browse our carefully curated collection of premium books"
    }
  ];

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchBookTypes();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, selectedBookType]);

  // Refresh data when the page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBooks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when component mounts or user navigates to this page
    const handleFocus = () => {
      fetchBooks();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, sortBy, filterBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBookType) params.bookType = selectedBookType;
      
      const response = await itemsAPI.getAll(params);
      const booksData = Array.isArray(response.data.content) ? response.data.content : 
                       Array.isArray(response.data) ? response.data : [];
      
      setBooks(booksData);
      
      if (booksData.length === 0) {
        toast('No books found in the database. Add some items through the admin panel.', {
          icon: 'ℹ️',
        });
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        toast.error('Unable to connect to server. Please check if the backend is running on port 8080.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please log in.');
      } else {
        toast.error(`Failed to load books: ${error.response?.data?.message || error.message}`);
      }
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await itemsAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchBookTypes = async () => {
    try {
      const response = await itemsAPI.getAll();
      const booksData = Array.isArray(response.data.content) ? response.data.content : 
                       Array.isArray(response.data) ? response.data : [];
      
      // Extract unique book types
      const uniqueBookTypes = [...new Set(
        booksData
          .map(book => book.bookType)
          .filter(type => type && type.trim() !== '')
      )].sort();
      
      setBookTypes(uniqueBookTypes);
    } catch (error) {
      console.error('Error fetching book types:', error);
      setBookTypes([]);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    // Filter by availability (local filtering for stock status)
    if (filterBy === 'available') {
      filtered = filtered.filter(book => book.stock > 0);
    } else if (filterBy === 'outofstock') {
      filtered = filtered.filter(book => book.stock === 0);
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const handleAddToCart = (book) => {
    if (book.stock <= 0) {
      toast.error('This book is out of stock');
      return;
    }
    
    addToCart({
      itemsId: book.itemsId || book.id,
      id: book.id,
      name: book.name,
      price: book.price,
      imageUrl: book.imageUrl || `https://via.placeholder.com/300x400/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`,
      image: book.imageUrl || `https://via.placeholder.com/300x400/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`,
      maxQuantity: book.stock
    });
    toast.success(`${book.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Slideshow */}
        <HeroSlideshow 
          images={slideshowImages}
          height="h-96 md:h-[500px]"
          showNavigation={true}
          autoPlay={true}
          interval={5000}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Book Collection</h1>
          <p className="text-xl text-gray-600">Discover your next favorite read from our curated selection</p>
        </div>

        {/* Search and Filters */}
        <section className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            
            <div className="flex gap-4 flex-wrap justify-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedBookType}
                onChange={(e) => setSelectedBookType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
              >
                <option value="">All Book Types</option>
                {bookTypes.map((bookType) => (
                  <option key={bookType} value={bookType}>
                    {bookType}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Price: Low to High</option>
                <option value="stock">Stock: High to Low</option>
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-400"
              >
                <option value="all">All Books</option>
                <option value="available">Available</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredBooks.length}</span> of <span className="font-semibold text-blue-600">{books.length}</span> books
            </p>
          </div>
        </div>
      </section>

        {/* Books by Category Section */}
        <section className="py-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Eye className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div>
              {/* Show books grouped by type if no specific filters are applied */}
              {!selectedBookType && !selectedCategory && !searchTerm ? (
                <div className="space-y-12">
                  {bookTypes.map((bookType) => {
                    const booksOfType = filteredBooks.filter(book => book.bookType === bookType);
                    if (booksOfType.length === 0) return null;
                    
                    return (
                      <div key={bookType} className="">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            {bookType}
                            <span className="text-sm font-normal text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                              {booksOfType.length} books
                            </span>
                          </h2>
                          <button
                            onClick={() => setSelectedBookType(bookType)}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors duration-200"
                          >
                            View All
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                          {booksOfType.slice(0, 12).map((book) => (
                            <BookCard key={book.id} book={book} handleAddToCart={handleAddToCart} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Books without type */}
                  {(() => {
                    const booksWithoutType = filteredBooks.filter(book => !book.bookType || book.bookType.trim() === '');
                    if (booksWithoutType.length === 0) return null;
                    
                    return (
                      <div className="">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            Other Books
                            <span className="text-sm font-normal text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                              {booksWithoutType.length} books
                            </span>
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                          {booksWithoutType.slice(0, 12).map((book) => (
                            <BookCard key={book.id} book={book} handleAddToCart={handleAddToCart} />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Regular grid view when filters are applied */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} handleAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// BookCard component for reusability
const BookCard = ({ book, handleAddToCart }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover-lift group relative">
    <div className="aspect-w-3 aspect-h-4 bg-gray-200 relative overflow-hidden">
      <img
        src={book.imageUrl || `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`}
        alt={book.name}
        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => {
          e.target.src = `https://via.placeholder.com/300x400/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`;
        }}
      />
      
      {/* Hover Cart Button */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button 
          onClick={() => handleAddToCart(book)}
          disabled={book.stock === 0}
          className="bg-white text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
    
    <div className="p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{book.name}</h3>
      {book.language && (
        <p className="text-xs text-blue-600 mb-1">{book.language}</p>
      )}
      {book.bookType && (
        <p className="text-xs text-gray-500 mb-2">{book.bookType}</p>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-blue-600">${book.price}</span>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < (book.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${
          book.stock > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
        </span>
      </div>
      
      <Link
        to={`/books/${book.id}`}
        className="w-full bg-gray-100 text-gray-800 py-1.5 px-2 rounded text-center text-xs font-medium hover:bg-gray-200 transition-all duration-300 block"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default Books;
