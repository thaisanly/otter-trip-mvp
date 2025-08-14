'use client'

import React, { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CalendarIcon,
  UsersIcon,
  StarIcon,
  ClockIcon,
  HeartIcon,
  ChevronRightIcon,
  CheckIcon,
  XIcon,
  PlayIcon,
  InfoIcon,
  MapPinIcon,
  DollarSignIcon,
  ShareIcon,
  GlobeIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react';
// Tour data moved to mock file
import { tourData } from '../../../mock/tours';
import { getAllTours } from '../../../mock/mockUtils';
const TourDetail = () => {
  const params = useParams(); const id = params.id;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Get the tour data based on ID
  const tour = tourData[id as string];
  useEffect(() => {
    // If tour not found, redirect to explore page
    if (!tour && id) {
      router.push('/explore/adventure');
    }
    // Reset active tab when tour changes
    setActiveTab('overview');
    setShowAllDates(false);
    setSelectedDate(null);
    // Scroll to top when tour changes
    window.scrollTo(0, 0);
  }, [id, tour]);
  if (!tour) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading tour details...</div>;
  }
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };
  const handleDateSelect = (dateId: string) => {
    setSelectedDate(dateId === selectedDate ? null : dateId);
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        {/* Breadcrumb */}
        <div className="absolute top-4 left-0 w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-white">
              {tour.breadcrumb.map((item, index) => (
                <Fragment key={index}>
                  {index > 0 && <span className="mx-2">&gt;</span>}
                  {index === tour.breadcrumb.length - 1 ? (
                    <span>{item}</span>
                  ) : (
                    <Link
                      href={index === 0 ? '/' : index === 1 ? '/explore/adventure' : '#'}
                      className="hover:text-blue-200"
                    >
                      {item}
                    </Link>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
              <div className="flex items-center text-white mb-4">
                <MapPinIcon size={18} className="mr-2" />
                <span>{tour.location}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <StarIcon size={18} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-white font-medium">{tour.rating}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon size={18} className="text-white/80 mr-1" />
                  <span className="text-white">{tour.duration}</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon size={18} className="text-white/80 mr-1" />
                  <span className="text-white">{tour.totalJoined}+ travelers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tour Guide Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={tour.guide.image}
                    alt={tour.guide.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">Your Guide: {tour.guide.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {tour.guide.experience} experience • {tour.guide.languages.join(', ')}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/tour-leader/${tour.guide.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
            {/* Content Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'itinerary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('itinerary')}
                  >
                    Itinerary
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'inclusions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('inclusions')}
                  >
                    What's Included
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                    <div className="space-y-4 text-gray-700">
                      {tour.overview.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                    {/* Tour Highlights */}
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Tour Highlights</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckIcon
                              size={18}
                              className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                            />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Gallery */}
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {tour.galleryImages.map((image, index) => (
                          <div key={index} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={image}
                              alt={`${tour.title} - image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Video/Featured Image */}
                    <div className="mt-8 relative rounded-xl overflow-hidden">
                      <img
                        src={tour.contentImage}
                        alt="Tour highlight"
                        className="w-full h-auto rounded-xl"
                      />
                      <button
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors"
                        onClick={() => setShowVideoModal(true)}
                      >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <PlayIcon size={28} className="text-blue-600 ml-1" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Itinerary</h2>
                    <p className="text-gray-600 mb-6">
                      A day-by-day breakdown of your {tour.title} adventure.
                    </p>
                    <div className="space-y-8">
                      {tour.itinerary.map((day, index) => (
                        <div
                          key={index}
                          className={`border-l-4 ${index === 0 ? 'border-blue-600' : 'border-gray-200'} pl-4`}
                        >
                          <h3 className="font-bold text-lg text-gray-900 mb-2">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-700 mb-3">{day.description}</p>
                          <div className="flex flex-wrap gap-4 mt-3">
                            {day.meals && day.meals.length > 0 && (
                              <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5 text-sm text-yellow-800">
                                <span className="font-medium">Meals:</span> {day.meals.join(', ')}
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 text-sm text-blue-800">
                                <span className="font-medium">Accommodation:</span>{' '}
                                {day.accommodation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Inclusions Tab */}
                {activeTab === 'inclusions' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
                        <ul className="space-y-3">
                          {tour.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckIcon
                                size={18}
                                className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                              />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Not Included</h2>
                        <ul className="space-y-3">
                          {tour.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <XIcon size={18} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Additional Information
                      </h2>
                      <div className="space-y-4">
                        {tour.additionalInfo.map((info, index) => (
                          <div key={index} className="flex items-start">
                            <InfoIcon
                              size={18}
                              className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{info.title}</h3>
                              <p className="text-gray-700">{info.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Guide Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Your Guide</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={tour.guide.image}
                    alt={tour.guide.name}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{tour.guide.name}</h3>
                  <p className="text-gray-600 mb-3">{tour.guide.experience} experience</p>
                  <p className="text-gray-700 mb-4">{tour.guide.bio}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tour.guide.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Languages:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tour.guide.languages.map((language, index) => (
                        <div key={index} className="flex items-center text-gray-700 text-sm">
                          <GlobeIcon size={14} className="mr-1" />
                          {language}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/tour-leader/${tour.guide.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm text-gray-500">From</div>
                  <div className="text-2xl font-bold text-gray-900">{tour.price}</div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
                <div className="flex items-center">
                  <StarIcon size={18} className="text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{tour.rating}</span>
                </div>
              </div>
              {tour.dates && tour.dates.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Select a date:</h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                    {(showAllDates ? tour.dates : tour.dates.slice(0, 3)).map((dateOption) => (
                      <button
                        key={dateOption.id}
                        className={`w-full flex items-center justify-between p-3 border rounded-lg text-left ${selectedDate === dateOption.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => handleDateSelect(dateOption.id)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{dateOption.date}</div>
                          <div
                            className={`text-sm ${dateOption.spotsLeft <= 3 ? 'text-red-600 font-medium' : 'text-gray-500'}`}
                          >
                            {dateOption.spotsLeft} spots left
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">{dateOption.price}</div>
                      </button>
                    ))}
                  </div>
                  {tour.dates.length > 3 && (
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                      onClick={() => setShowAllDates(!showAllDates)}
                    >
                      {showAllDates ? 'Show less dates' : `Show all dates (${tour.dates.length})`}
                    </button>
                  )}
                </div>
              )}
              <button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg mb-4 transition-colors ${
                  !tour.dates || tour.dates.length === 0 || !selectedDate
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={!tour.dates || tour.dates.length === 0 || !selectedDate}
              >
                {!tour.dates || tour.dates.length === 0
                  ? 'No dates available'
                  : selectedDate
                    ? 'Book Now'
                    : 'Select a date to book'}
              </button>
              <button
                className={`w-full flex items-center justify-center font-medium py-3 px-4 rounded-lg border transition-colors ${isWishlisted ? 'bg-red-50 text-red-600 border-red-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={toggleWishlist}
              >
                <HeartIcon
                  size={18}
                  className={`mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                />
                {isWishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
              </button>
              <div className="flex justify-center mt-4">
                <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                  <ShareIcon size={16} className="mr-1" />
                  Share this tour
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <TagIcon size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Key Information</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tour Code</span>
                    <span className="text-gray-900 font-medium">{tour.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-gray-900 font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="text-gray-900 font-medium">{tour.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Size</span>
                    <span className="text-gray-900 font-medium">Max 8 people</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this tour? Our travel experts are ready to assist you.
                </p>
                <button className="w-full border border-blue-600 text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-xl overflow-hidden max-w-4xl w-full max-h-[80vh]">
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 z-10"
              onClick={() => setShowVideoModal(false)}
            >
              <XIcon size={20} />
            </button>
            <div className="aspect-video">
              <img
                src={tour.contentImage}
                alt="Video placeholder"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <PlayIcon size={36} className="text-blue-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Similar Tours Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getAllTours()
            .filter((relatedTour) => relatedTour.id !== tour.id)
            .slice(0, 3)
            .map((relatedTour) => (
              <Link
                key={relatedTour.id}
                href={`/tour/${relatedTour.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={relatedTour.heroImage}
                    alt={relatedTour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full">
                    {relatedTour.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{relatedTour.title}</h3>
                    <div className="flex items-center">
                      <StarIcon size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {relatedTour.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {relatedTour.overview[0]}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-gray-900 font-bold">{relatedTour.price}</div>
                      <div className="text-gray-500 text-xs">per person</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default TourDetail;
