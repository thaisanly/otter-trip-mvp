import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
const testimonials = [{
  id: 1,
  name: 'Emma Thompson',
  location: 'London, UK',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  rating: 5,
  text: 'My tour guide Sarah was absolutely amazing! She knew all the hidden spots in Bali and customized the experience based on my interests. It felt like traveling with a knowledgeable friend rather than a guide.',
  guide: {
    name: 'Sarah Johnson',
    location: 'Bali, Indonesia'
  }
}, {
  id: 2,
  name: 'David Chen',
  location: 'Toronto, Canada',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  rating: 5,
  text: "Miguel's food tour in Mexico City was the highlight of our trip. His passion for local cuisine and knowledge of the best street food vendors made for an unforgettable culinary adventure.",
  guide: {
    name: 'Miguel Santos',
    location: 'Mexico City, Mexico'
  }
}, {
  id: 3,
  name: 'Sophia Rodriguez',
  location: 'Barcelona, Spain',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  rating: 5,
  text: "Aisha's knowledge of Moroccan culture and history made our Marrakech trip so much more meaningful. She introduced us to local artisans and took us to places we would never have discovered on our own.",
  guide: {
    name: 'Aisha Patel',
    location: 'Marrakech, Morocco'
  }
}];
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, []);
  return <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from travelers who found their perfect guide match
          </p>
        </div>
        <div className="max-w-5xl mx-auto relative">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
            transform: `translateX(-${activeIndex * 100}%)`
          }}>
              {testimonials.map(testimonial => <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="flex items-center mb-4">
                          <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {testimonial.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {testimonial.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => <StarIcon key={i} size={18} className={`${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <p className="text-sm text-gray-700 mb-3">
                            Connected with:
                          </p>
                          <div className="font-medium text-gray-900">
                            {testimonial.guide.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {testimonial.guide.location}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="text-xl text-gray-600 italic leading-relaxed">
                          "{testimonial.text}"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
          {/* Navigation Buttons */}
          <button className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-md p-3 hover:bg-gray-50 focus:outline-none" onClick={goToPrev}>
            <ChevronLeftIcon size={24} className="text-gray-700" />
          </button>
          <button className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-md p-3 hover:bg-gray-50 focus:outline-none" onClick={goToNext}>
            <ChevronRightIcon size={24} className="text-gray-700" />
          </button>
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => <button key={index} className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => setActiveIndex(index)} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default TestimonialsSection;