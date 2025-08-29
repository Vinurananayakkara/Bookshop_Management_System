import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlideshow = ({ images, height = 'h-96', showNavigation = true, autoPlay = true, interval = 4000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    if (!autoPlay) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [images.length, autoPlay, interval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className={`relative ${height} overflow-hidden rounded-lg mb-8 shadow-2xl`}>
      {/* Slideshow Images */}
      <div className="relative h-full">
        {images.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
            
            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-4xl px-6">
                <h1 
                  className={`text-4xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${
                    index === currentSlide 
                      ? 'animate-fadeInUp opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  {slide.title}
                </h1>
                <p 
                  className={`text-xl md:text-2xl text-gray-200 transition-all duration-1000 delay-300 ${
                    index === currentSlide 
                      ? 'animate-fadeInUp opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  {slide.description}
                </p>
                {slide.cta && (
                  <button 
                    className={`mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-1000 delay-500 transform hover:scale-105 ${
                      index === currentSlide 
                        ? 'animate-fadeInUp opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}
                    onClick={slide.ctaAction}
                  >
                    {slide.cta}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 group hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/50 hover:bg-white/75 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Animated overlay elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-8 w-8 h-8 border-2 border-white/25 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default HeroSlideshow;
