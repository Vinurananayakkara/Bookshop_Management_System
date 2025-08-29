import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, ArrowRight, Users, Award, Clock, Sparkles, ShoppingCart } from 'lucide-react';
import { itemsAPI } from '../services/api';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    // Observe all sections with data-animate attribute
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return visibleSections;
};

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestBooks, setLatestBooks] = useState([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [sinhalaBooks, setSinhalaBooks] = useState([]);
  const [sinhalaLoading, setSinhalaLoading] = useState(true);
  const [englishBooks, setEnglishBooks] = useState([]);
  const [englishLoading, setEnglishLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const visibleSections = useScrollAnimation();

  // Background images for featured section
  const backgroundImages = [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570", // Library with books
    "https://images.unsplash.com/photo-1505063366573-38928ae5567e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Cozy reading corner
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da", // Modern library
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f", // Classic library
    "https://images.unsplash.com/photo-1544822688-c5f41d2c1972?q=80&w=1119&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  // Bookstore interior
  ];

  const heroSlides = [
    {
      title: "Welcome to PahanaEdu",
      subtitle: "Your Gateway to Knowledge and Learning Excellence - Discover premium educational resources",
      buttonText: "Browse Books",
      buttonLink: "/books",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      alt: "Beautiful library with books"
    },
    {
      title: "Latest Educational Resources",
      subtitle: "Explore the newest academic titles and learning materials",
      buttonText: "New Arrivals",
      buttonLink: "/books?filter=new",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      alt: "Modern library interior"
    },
    {
      title: "Bestselling Academic Books",
      subtitle: "Discover the most popular educational titles trusted by students and educators",
      buttonText: "View Bestsellers",
      buttonLink: "/books?filter=bestsellers",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      alt: "Cozy reading corner"
    },
    {
      title: "Educational Excellence",
      subtitle: "Empowering minds with quality books and learning resources for academic success",
      buttonText: "Explore Collection",
      buttonLink: "/books",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
      alt: "Modern library interior"
    }
  ];

  useEffect(() => {
    fetchFeaturedBooks();
    fetchLatestBooks();
    fetchSinhalaBooks();
    fetchEnglishBooks();
  }, []);

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage(prev => (prev + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Auto slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const fetchFeaturedBooks = async () => {
    try {
      const response = await itemsAPI.getAll();
      const booksData = Array.isArray(response.data.content) ? response.data.content : 
                       Array.isArray(response.data) ? response.data : [];
      const shuffledBooks = booksData.sort(() => 0.5 - Math.random());
      setFeaturedBooks(shuffledBooks.slice(0, 8));
    } catch (error) {
      console.error('Error fetching featured books:', error);
      setFeaturedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBooks = async () => {
    try {
      const response = await itemsAPI.getAll();
      const booksData = Array.isArray(response.data.content) ? response.data.content : 
                       Array.isArray(response.data) ? response.data : [];
      const sortedBooks = booksData.sort((a, b) => (b.itemsId || b.id) - (a.itemsId || a.id));
      setLatestBooks(sortedBooks.slice(0, 12));
    } catch (error) {
      console.error('Error fetching latest books:', error);
      setLatestBooks([]);
    } finally {
      setLatestLoading(false);
    }
  };

  const fetchSinhalaBooks = async () => {
    try {
      const response = await itemsAPI.getAll();
      const booksData = Array.isArray(response.data.content) ? response.data.content : 
                       Array.isArray(response.data) ? response.data : [];
      const sinhalaBooks = booksData.filter(book => 
        book.language && book.language.toLowerCase().includes('sinhala')
      );
      const sortedBooks = sinhalaBooks.sort((a, b) => (b.itemsId || b.id) - (a.itemsId || a.id));
      setSinhalaBooks(sortedBooks.slice(0, 12));
    } catch (error) {
      console.error('Error fetching Sinhala books:', error);
      setSinhalaBooks([]);
    } finally {
      setSinhalaLoading(false);
    }
  };

  const fetchEnglishBooks = async () => {
    try {
      const response = await itemsAPI.getAll();
      const booksData = Array.isArray(response.data.content) ? response.data.content : 
                       Array.isArray(response.data) ? response.data : [];
      const englishBooks = booksData.filter(book => 
        book.language && book.language.toLowerCase().includes('english')
      );
      const sortedBooks = englishBooks.sort((a, b) => (b.itemsId || b.id) - (a.itemsId || a.id));
      setEnglishBooks(sortedBooks.slice(0, 12));
    } catch (error) {
      console.error('Error fetching English books:', error);
      setEnglishBooks([]);
    } finally {
      setEnglishLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Auto Slideshow */}
      <section className="relative text-white py-20 overflow-hidden group">
        {/* Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/70 transition-all duration-700"></div>
          </div>
        ))}
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="absolute top-10 left-10 animate-float hover-wiggle">
            <Sparkles className="h-8 w-8 text-blue-300 animate-heartbeat drop-shadow-lg" />
          </div>
          <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
            <Sparkles className="h-6 w-6 text-purple-300 hover:animate-wiggle drop-shadow-lg" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
            <Sparkles className="h-10 w-10 text-blue-200 hover:animate-heartbeat drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-shimmer backdrop-blur-sm"></div>
          </div>
        </div>

        {/* Slideshow Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 
              key={`title-${currentSlide}`}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slideInUp drop-shadow-2xl"
            >
              {heroSlides[currentSlide].title}
            </h1>
            <p 
              key={`subtitle-${currentSlide}`}
              className="text-xl md:text-2xl mb-8 max-w-3xl animate-slideInUp drop-shadow-lg" 
              style={{ animationDelay: '0.3s' }}
            >
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link
              key={`button-${currentSlide}`}
              to={heroSlides[currentSlide].buttonLink}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slideInUp relative overflow-hidden group backdrop-blur-sm"
              style={{ animationDelay: '0.6s' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
              <span className="relative z-10 drop-shadow-sm">{heroSlides[currentSlide].buttonText}</span>
            </Link>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 backdrop-blur-sm ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-2xl ring-2 ring-white/50' 
                  : 'bg-white/50 hover:bg-white/75 hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300 z-30 group hover:scale-110 shadow-xl"
          aria-label="Previous slide"
        >
          <ArrowRight className="h-6 w-6 text-white rotate-180 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300 z-30 group hover:scale-110 shadow-xl"
          aria-label="Next slide"
        >
          <ArrowRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
        </button>
      </section>

      {/* Stats Section */}
      <section 
        id="stats-section" 
        data-animate 
        className={`py-20 bg-white/80 backdrop-blur-lg transition-all duration-1000 animate-pulse ${
          visibleSections.has('stats-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: BookOpen, value: "10,000+", label: "Books Available", color: "bg-blue-100 text-blue-600" },
            { icon: Users, value: "50,000+", label: "Happy Customers", color: "bg-green-100 text-green-600" },
            { icon: Award, value: "15+", label: "Years of Excellence", color: "bg-yellow-100 text-yellow-600" },
          ].map((item, i) => (
            <div 
              key={i} 
              className={`relative group transition-all duration-700 ${
                visibleSections.has('stats-section')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: visibleSections.has('stats-section') ? `${i * 200}ms` : '0ms' 
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg text-center transform group-hover:-translate-y-2 transition duration-500">
                <div className={`relative max-w-7xl mx-auto px-6 text-center flex flex-col justify-center items-center z-20 ${item.color} transform transition-all duration-500 ${
                  visibleSections.has('stats-section') ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                }`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className={`text-4xl font-bold text-gray-900 transition-all duration-500 ${
                  visibleSections.has('stats-section') ? 'opacity-100' : 'opacity-0'
                }`} style={{ transitionDelay: visibleSections.has('stats-section') ? `${i * 200 + 300}ms` : '0ms' }}>
                  {item.value}
                </h3>
                <p className={`text-gray-600 transition-all duration-500 ${
                  visibleSections.has('stats-section') ? 'opacity-100' : 'opacity-0'
                }`} style={{ transitionDelay: visibleSections.has('stats-section') ? `${i * 200 + 400}ms` : '0ms' }}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books Section */}
      <section 
        id="featured-section" 
        data-animate 
        className={`relative py-40 transition-all duration-1000 group ${
          visibleSections.has('featured-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 group">
          {backgroundImages.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Library Background ${index + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-all duration-[2000ms] ease-out ${
                index === currentBgImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: index === currentBgImage ? '1000ms, 2000ms' : '1000ms, 2000ms'
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/70 group-hover:from-white/40 group-hover:via-white/30 group-hover:to-white/40 transition-all duration-700"></div>
          
          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBgImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBgImage 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center transition-all duration-800 ${
            visibleSections.has('featured-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 
              className={`text-3xl md:text-4xl font-light text-gray-900 mb-4 transition-all duration-700 group-hover:font-bold ${
                visibleSections.has('featured-section') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`} 
              style={{ transitionDelay: visibleSections.has('featured-section') ? '200ms' : '0ms' }}
            >
              Featured Books
            </h2>
            <p 
              className={`text-gray-700 max-w-2xl mx-auto text-lg font-light transition-all duration-700 group-hover:font-medium ${
                visibleSections.has('featured-section') ? 'opacity-100' : 'opacity-0'
              }`} 
              style={{ transitionDelay: visibleSections.has('featured-section') ? '400ms' : '0ms' }}
            >
              Discover our handpicked selection of bestsellers and must-read titles
            </p>
          </div>
        </div>
      </section>

      {/* Moving Books Carousel Section */}
      <section 
        id="moving-books-section" 
        data-animate 
        className={`py-16 bg-white transition-all duration-1000 ${
          visibleSections.has('moving-books-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-12 transition-all duration-800 ${
            visibleSections.has('moving-books-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              visibleSections.has('moving-books-section') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ transitionDelay: visibleSections.has('moving-books-section') ? '200ms' : '0ms' }}>
              Latest Arrivals
            </h2>
            <p className={`text-gray-600 max-w-2xl mx-auto text-lg transition-all duration-700 ${
              visibleSections.has('moving-books-section') ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: visibleSections.has('moving-books-section') ? '400ms' : '0ms' }}>
              Discover our newest collection of books across all genres
            </p>
          </div>

          {/* Latest Books Horizontal Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            {latestLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : latestBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No books available yet.</p>
              </div>
            ) : (
              <div className="flex animate-scroll-right gap-4 pb-4" style={{ 
                animation: 'scrollRight 30s linear infinite',
                width: 'fit-content'
              }}>
                {/* Duplicate books for seamless loop */}
                {[...latestBooks, ...latestBooks].map((book, index) => (
                  <div 
                    key={`${book.itemsId}-${index}`}
                    className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 latest-book-card relative"
                  >
                    {/* Book Cover */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={book.imageUrl || `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`}
                        alt={book.name}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`;
                        }}
                      />
                      {/* New badge for latest books */}
                      {index < 6 && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                      
                      {/* Hover Cart Button */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-white text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-sm">
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {book.name}
                      </h3>
                      
                      {/* Language and Type */}
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {book.language && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {book.language}
                          </span>
                        )}
                        {book.bookType && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {book.bookType}
                          </span>
                        )}
                      </div>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-blue-600">
                          ${book.price}
                        </span>
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

                      {/* Stock Status */}
                      <div className="text-center mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          (book.stock > 0 || book.quentity > 0)
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(book.stock > 0 || book.quentity > 0) ? `${book.stock || book.quentity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      {/* View Details Button */}
                      <Link
                        to={`/books/${book.itemsId || book.id}`}
                        className="w-full bg-blue-600 text-white py-1.5 px-2 rounded text-center text-xs font-medium hover:bg-blue-700 transition-all duration-300 block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className={`text-center mt-8 transition-all duration-800 ${
            visibleSections.has('moving-books-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: visibleSections.has('moving-books-section') ? '1200ms' : '0ms' }}>
            <Link
              to="/books"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group text-sm sm:text-base"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
              <span className="relative z-10">View All Books</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sinhala Arrivals Section */}
      <section 
        id="sinhala-books-section" 
        data-animate 
        className={`py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 transition-all duration-1000 ${
          visibleSections.has('sinhala-books-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-12 transition-all duration-800 ${
            visibleSections.has('sinhala-books-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: visibleSections.has('sinhala-books-section') ? '200ms' : '0ms' }}>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              visibleSections.has('sinhala-books-section') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ transitionDelay: visibleSections.has('sinhala-books-section') ? '200ms' : '0ms' }}>
              Sinhala Arrivals
            </h2>
            <p className={`text-gray-600 max-w-2xl mx-auto text-lg transition-all duration-700 ${
              visibleSections.has('sinhala-books-section') ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: visibleSections.has('sinhala-books-section') ? '400ms' : '0ms' }}>
              Discover our newest collection of Sinhala books and literature
            </p>
          </div>

          {/* Sinhala Books Horizontal Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-orange-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-orange-50 to-transparent z-10 pointer-events-none"></div>
            
            {sinhalaLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : sinhalaBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No Sinhala books available yet.</p>
              </div>
            ) : (
              <div className="flex animate-scroll-right gap-4 pb-4" style={{ 
                animation: 'scrollRight 30s linear infinite',
                width: 'fit-content'
              }}>
                {/* Duplicate books for seamless loop */}
                {[...sinhalaBooks, ...sinhalaBooks].map((book, index) => (
                  <div 
                    key={`${book.itemsId}-${index}`}
                    className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 sinhala-book-card relative"
                  >
                    {/* Book Cover */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={book.imageUrl || `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`}
                        alt={book.name}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`;
                        }}
                      />
                      {/* Sinhala badge */}
                      {index < 6 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                          සිංහල
                        </div>
                      )}
                      
                      {/* Hover Cart Button */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-white text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-sm">
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {book.name}
                      </h3>
                      
                      {/* Language and Type */}
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {book.language && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                            {book.language}
                          </span>
                        )}
                        {book.bookType && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {book.bookType}
                          </span>
                        )}
                      </div>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-orange-600">
                          ${book.price}
                        </span>
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

                      {/* Stock Status */}
                      <div className="text-center mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          (book.stock > 0 || book.quentity > 0)
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(book.stock > 0 || book.quentity > 0) ? `${book.stock || book.quentity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      {/* View Details Button */}
                      <Link
                        to={`/books/${book.itemsId || book.id}`}
                        className="w-full bg-orange-600 text-white py-1.5 px-2 rounded text-center text-xs font-medium hover:bg-orange-700 transition-all duration-300 block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className={`text-center mt-8 transition-all duration-800 ${
            visibleSections.has('sinhala-books-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: visibleSections.has('sinhala-books-section') ? '1200ms' : '0ms' }}>
            <Link
              to="/books?language=Sinhala"
              className="inline-flex items-center bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group text-sm sm:text-base"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
              <span className="relative z-10">View All Sinhala Books</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Link>
          </div>
        </div>
      </section>

      {/* English Arrivals Section */}
      <section 
        id="english-books-section" 
        data-animate 
        className={`py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-all duration-1000 ${
          visibleSections.has('english-books-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-12 transition-all duration-800 ${
            visibleSections.has('english-books-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: visibleSections.has('english-books-section') ? '200ms' : '0ms' }}>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              visibleSections.has('english-books-section') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ transitionDelay: visibleSections.has('english-books-section') ? '200ms' : '0ms' }}>
              English Arrivals
            </h2>
            <p className={`text-gray-600 max-w-2xl mx-auto text-lg transition-all duration-700 ${
              visibleSections.has('english-books-section') ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: visibleSections.has('english-books-section') ? '400ms' : '0ms' }}>
              Explore our latest collection of English books and international bestsellers
            </p>
          </div>

          {/* English Books Horizontal Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none"></div>
            
            {englishLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : englishBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No English books available yet.</p>
              </div>
            ) : (
              <div className="flex animate-scroll-right gap-4 pb-4" style={{ 
                animation: 'scrollRight 30s linear infinite',
                width: 'fit-content'
              }}>
                {/* Duplicate books for seamless loop */}
                {[...englishBooks, ...englishBooks].map((book, index) => (
                  <div 
                    key={`${book.itemsId}-${index}`}
                    className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 english-book-card relative"
                  >
                    {/* Book Cover */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={book.imageUrl || `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`}
                        alt={book.name}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/240x320/f3f4f6/6b7280?text=${encodeURIComponent(book.name)}`;
                        }}
                      />
                      {/* English badge */}
                      {index < 6 && (
                        <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
                          ENG
                        </div>
                      )}
                      
                      {/* Hover Cart Button */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-white text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-sm">
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {book.name}
                      </h3>
                      
                      {/* Language and Type */}
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {book.language && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                            {book.language}
                          </span>
                        )}
                        {book.bookType && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {book.bookType}
                          </span>
                        )}
                      </div>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-indigo-600">
                          ${book.price}
                        </span>
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

                      {/* Stock Status */}
                      <div className="text-center mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          (book.stock > 0 || book.quentity > 0)
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(book.stock > 0 || book.quentity > 0) ? `${book.stock || book.quentity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      {/* View Details Button */}
                      <Link
                        to={`/books/${book.itemsId || book.id}`}
                        className="w-full bg-indigo-600 text-white py-1.5 px-2 rounded text-center text-xs font-medium hover:bg-indigo-700 transition-all duration-300 block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className={`text-center mt-8 transition-all duration-800 ${
            visibleSections.has('english-books-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: visibleSections.has('english-books-section') ? '1200ms' : '0ms' }}>
            <Link
              to="/books?language=English"
              className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group text-sm sm:text-base"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
              <span className="relative z-10">View All English Books</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Category Sections */}
      <section 
        id="categories-section" 
        data-animate 
        className={`py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 transition-all duration-1000 ${
          visibleSections.has('categories-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-800 ${
            visibleSections.has('categories-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-700 ${
              visibleSections.has('categories-section') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ transitionDelay: visibleSections.has('categories-section') ? '200ms' : '0ms' }}>
              Explore by Category
            </h2>
            <p className={`text-gray-600 max-w-3xl mx-auto text-xl transition-all duration-700 ${
              visibleSections.has('categories-section') ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: visibleSections.has('categories-section') ? '400ms' : '0ms' }}>
              Discover books tailored to your interests across different languages and genres
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Latest Arrivals",
                description: "Fresh releases and newest additions to our collection",
                icon: "📚",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                link: "/books?filter=latest",
                books: "500+ New Books"
              },
              {
                title: "Sinhala Novels",
                description: "Rich collection of Sinhala literature and contemporary novels",
                icon: "🇱🇰",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50",
                link: "/books?language=Sinhala&type=Fiction",
                books: "200+ Novels"
              },
              {
                title: "English Fiction",
                description: "Bestselling English novels and captivating stories",
                icon: "📖",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50",
                link: "/books?language=English&type=Fiction",
                books: "800+ Books"
              },
              {
                title: "Educational Books",
                description: "Academic textbooks and learning resources",
                icon: "🎓",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-50 to-red-50",
                link: "/books?type=Educational",
                books: "300+ Resources"
              },
              {
                title: "Children's Books",
                description: "Engaging stories and educational content for young readers",
                icon: "🧸",
                gradient: "from-yellow-500 to-orange-500",
                bgGradient: "from-yellow-50 to-orange-50",
                link: "/books?type=Children",
                books: "150+ Stories"
              },
              {
                title: "Non-Fiction",
                description: "Biographies, self-help, and informative reads",
                icon: "💡",
                gradient: "from-indigo-500 to-blue-500",
                bgGradient: "from-indigo-50 to-blue-50",
                link: "/books?type=Non-Fiction",
                books: "400+ Titles"
              }
            ].map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-700 hover:scale-105 hover:shadow-2xl transform ${
                  visibleSections.has('categories-section')
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                }`}
                style={{ 
                  transitionDelay: visibleSections.has('categories-section') ? `${index * 150 + 600}ms` : '0ms' 
                }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent transform rotate-12 scale-150 group-hover:rotate-6 transition-transform duration-700"></div>
                </div>

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col justify-between min-h-[280px]">
                  {/* Icon and title */}
                  <div>
                    <div className={`text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${
                      visibleSections.has('categories-section') ? 'rotate-0' : 'rotate-12'
                    }`}>
                      {category.icon}
                    </div>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-all duration-300 ${
                      visibleSections.has('categories-section') ? 'opacity-100' : 'opacity-0'
                    }`} style={{ transitionDelay: visibleSections.has('categories-section') ? `${index * 150 + 800}ms` : '0ms' }}>
                      {category.title}
                    </h3>
                    <p className={`text-gray-700 mb-4 group-hover:text-gray-600 transition-all duration-300 ${
                      visibleSections.has('categories-section') ? 'opacity-100' : 'opacity-0'
                    }`} style={{ transitionDelay: visibleSections.has('categories-section') ? `${index * 150 + 900}ms` : '0ms' }}>
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom section */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold text-gray-600 bg-white/70 px-3 py-1 rounded-full transition-all duration-300 ${
                      visibleSections.has('categories-section') ? 'opacity-100' : 'opacity-0'
                    }`} style={{ transitionDelay: visibleSections.has('categories-section') ? `${index * 150 + 1000}ms` : '0ms' }}>
                      {category.books}
                    </span>
                    <div className={`bg-gradient-to-r ${category.gradient} text-white p-3 rounded-full transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            ))}
          </div>

          {/* Call to action */}
          <div className={`text-center mt-16 transition-all duration-800 ${
            visibleSections.has('categories-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: visibleSections.has('categories-section') ? '1200ms' : '0ms' }}>
            <Link
              to="/books"
              className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white px-10 py-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
              <span className="relative z-10">Browse All Categories</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 relative z-10" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section 
        id="why-choose-section" 
        data-animate 
        className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-1000 ${
          visibleSections.has('why-choose-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-800 ${
            visibleSections.has('why-choose-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700 ${
              visibleSections.has('why-choose-section') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`} style={{ transitionDelay: visibleSections.has('why-choose-section') ? '200ms' : '0ms' }}>
              Why Choose BookShop?
            </h2>
            <p className={`text-gray-600 max-w-2xl mx-auto text-lg transition-all duration-700 ${
              visibleSections.has('why-choose-section') ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: visibleSections.has('why-choose-section') ? '400ms' : '0ms' }}>
              We're committed to providing the best reading experience for our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Fast Delivery",
                description: "Get your books delivered within 2-3 business days with our express shipping service.",
                color: "from-blue-100 to-blue-200",
                iconColor: "text-blue-600"
              },
              {
                icon: Award,
                title: "Quality Guarantee",
                description: "All our books are carefully inspected to ensure the highest quality for our customers.",
                color: "from-green-100 to-green-200",
                iconColor: "text-green-600"
              },
              {
                icon: Users,
                title: "24/7 Support",
                description: "Our customer support team is always ready to help you with any questions or concerns.",
                color: "from-purple-100 to-purple-200",
                iconColor: "text-purple-600"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-700 hover-lift ${
                  visibleSections.has('why-choose-section')
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                }`}
                style={{ 
                  transitionDelay: visibleSections.has('why-choose-section') ? `${index * 200 + 600}ms` : '0ms' 
                }}
              >
                <div className={`bg-gradient-to-br ${item.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale transition-all duration-500 ${
                  visibleSections.has('why-choose-section') ? 'rotate-0' : 'rotate-12'
                }`}>
                  <item.icon className={`h-10 w-10 ${item.iconColor}`} />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-2 transition-all duration-500 ${
                  visibleSections.has('why-choose-section') ? 'opacity-100' : 'opacity-0'
                }`} style={{ transitionDelay: visibleSections.has('why-choose-section') ? `${index * 200 + 800}ms` : '0ms' }}>
                  {item.title}
                </h3>
                <p className={`text-gray-600 transition-all duration-500 ${
                  visibleSections.has('why-choose-section') ? 'opacity-100' : 'opacity-0'
                }`} style={{ transitionDelay: visibleSections.has('why-choose-section') ? `${index * 200 + 900}ms` : '0ms' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
