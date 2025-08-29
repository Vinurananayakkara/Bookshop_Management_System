import React from 'react';
import { BookOpen, Users, Award, Heart, Target, Eye } from 'lucide-react';
import HeroSlideshow from '../components/HeroSlideshow';
import useScrollAnimation from '../hooks/useScrollAnimation';

const About = () => {
  // Animation refs
  const headerRef = useScrollAnimation();
  const storyRef = useScrollAnimation();
  const missionRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const teamRef = useScrollAnimation();

  // Slideshow images for about page
  const slideshowImages = [
    {
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
      title: "Our Story Begins",
      description: "Discover the journey that made us who we are today"
    },
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "Passion for Literature",
      description: "Connecting readers with stories that inspire and transform"
    },
    {
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
      title: "Building Community",
      description: "Creating spaces where book lovers come together"
    },
    {
      url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      title: "Excellence in Service",
      description: "Committed to providing the best experience for every reader"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Slideshow */}
        <HeroSlideshow 
          images={slideshowImages}
          height="h-96 md:h-[500px]"
          showNavigation={true}
          autoPlay={true}
          interval={4500}
        />

        {/* About Header */}
        <div ref={headerRef} className="text-center mb-12 scroll-animate">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About BookShop</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in discovering the perfect books for every reader
          </p>
        </div>

        {/* Our Story Section */}
        <section ref={storyRef} className="py-16 scroll-animate-left">
          <div className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2008, BookShop began as a small local bookstore with a simple mission: 
                to connect readers with the books they love. Over the years, we've grown into a 
                comprehensive online platform while maintaining our commitment to quality and 
                customer service.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that books have the power to transform lives, spark imagination, and 
                build bridges between different worlds and perspectives. Our carefully curated 
                collection spans across genres, ensuring there's something for every reader.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve thousands of customers worldwide, helping them 
                discover their next favorite read and supporting their literary journey.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 flex items-center justify-center">
              <BookOpen className="h-32 w-32 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

        {/* Mission & Vision */}
        <section ref={missionRef} className="py-16 bg-white scroll-animate-right">
          <div className="px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To make quality books accessible to everyone, fostering a love for reading 
                and learning in communities worldwide. We strive to provide exceptional 
                service and create meaningful connections between readers and books.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the world's most trusted and beloved bookstore, where every 
                reader finds their perfect match and every book finds its ideal reader. 
                We envision a world where reading is celebrated and knowledge is shared freely.
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* Values Section */}
        <section ref={valuesRef} className="py-16 bg-gray-50 scroll-animate-scale">
          <div className="px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape our commitment to our customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion for Books</h3>
              <p className="text-gray-600">
                We're genuine book lovers who understand the joy and importance of reading. 
                Our passion drives us to curate the best selection for our customers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We're committed to 
                providing exceptional service and creating positive experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in everything from book selection to 
                customer service, ensuring excellence in every interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* Team Section */}
        <section ref={teamRef} className="py-16 bg-white scroll-animate">
          <div className="px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated team of book enthusiasts is here to help you find your next great read
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">JS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Smith</h3>
              <p className="text-blue-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Book lover and entrepreneur with over 15 years in the publishing industry.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">MJ</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mary Johnson</h3>
              <p className="text-blue-600 mb-2">Head of Curation</p>
              <p className="text-gray-600 text-sm">
                Literature expert who carefully selects each book in our collection.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">DB</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">David Brown</h3>
              <p className="text-blue-600 mb-2">Customer Success Manager</p>
              <p className="text-gray-600 text-sm">
                Dedicated to ensuring every customer has an exceptional experience.
              </p>
            </div>
          </div>
        </div>
        </section>
      </div>
    </div>
  );
};

export default About;
