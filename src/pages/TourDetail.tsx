import React, { useEffect, useState, Fragment } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
// Adventure tours data
const adventureTours = {
  'grand-canyon': {
    id: 'grand-canyon',
    title: 'Grand Canyon Adventure',
    code: 'GCA-001',
    breadcrumb: ['Home', 'Explore', 'Adventure', 'Grand Canyon Adventure'],
    heroImage:
      'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '3 days',
    price: 'RM 8,000',
    totalJoined: 108,
    rating: 4.9,
    reviewCount: 108,
    location: 'Arizona, USA',
    overview: [
      "Experience the majestic Grand Canyon like never before with our 3-day guided adventure tour. Descend into the heart of this natural wonder, where you'll hike along scenic trails, camp under starlit skies, and discover hidden viewpoints away from the tourist crowds.",
      "Our expert guides will share fascinating insights about the canyon's geology, wildlife, and cultural history while ensuring your safety and comfort throughout this unforgettable journey.",
      "Whether you're an experienced hiker or a first-time canyon explorer, this tour offers the perfect balance of challenge and accessibility, with flexible itineraries tailored to your group's preferences and fitness levels.",
    ],
    highlights: [
      'Hike along the iconic South Kaibab Trail with breathtaking panoramic views',
      'Camp at Bright Angel Campground near the Colorado River',
      'Witness stunning sunrise and sunset views from exclusive viewpoints',
      'Cool off in the crystal-clear waters of Havasu Falls',
      'Enjoy stargazing sessions with expert astronomy guides',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1575527048208-933d8f4f44c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1602088693770-867f3fed105c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1578249949530-6e169da42303?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    ],
    inclusions: [
      'Professional adventure guide throughout the tour',
      'Camping equipment (tents, sleeping bags, mats)',
      'All meals during the trek (breakfast, lunch, dinner)',
      'Permits and entrance fees to Grand Canyon National Park',
      'Transportation to and from trailheads',
      'Emergency satellite communication device',
    ],
    exclusions: [
      'Flights to/from Arizona',
      'Personal hiking gear and clothing',
      'Travel insurance (mandatory)',
      'Personal expenses and souvenirs',
      'Alcoholic beverages',
    ],
    itinerary: [
      {
        day: 1,
        title: 'South Rim & Descent',
        description:
          "Meet at the Grand Canyon Visitor Center for a safety briefing and orientation. Begin your descent down the South Kaibab Trail, enjoying stunning panoramic views. Reach Bright Angel Campground by late afternoon, where you'll set up camp near the Colorado River. Enjoy a hearty dinner and evening stargazing session.",
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Bright Angel Campground',
      },
      {
        day: 2,
        title: 'Phantom Ranch & Ribbon Falls',
        description:
          'After breakfast, hike along the Clear Creek Trail to the stunning Ribbon Falls. Enjoy a picnic lunch and swimming opportunity at this hidden oasis. Return to camp via a different route, passing through the historic Phantom Ranch. Evening includes dinner and stories around the campfire.',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Bright Angel Campground',
      },
      {
        day: 3,
        title: 'Ascent & Celebration',
        description:
          'Early morning start for the ascent via the Bright Angel Trail. Enjoy multiple rest stops with incredible views and geological insights from your guide. Reach the rim by mid-afternoon for a celebration meal and certificate presentation before departure.',
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Not included',
      },
    ],
    additionalInfo: [
      {
        title: 'Fitness requirements',
        content:
          'Moderate to good fitness level required. Participants should be able to hike 5-7 miles per day with elevation changes.',
      },
      {
        title: 'Weather considerations',
        content:
          'Tours operate April-October. Summer months can be extremely hot at the canyon bottom, while spring and fall offer milder temperatures.',
      },
      {
        title: 'Group size',
        content:
          'Maximum 8 participants per guide to ensure personalized attention and minimal environmental impact.',
      },
    ],
    guide: {
      id: 'james-wilson',
      name: 'James Wilson',
      image:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '8 years',
      specialties: ['Canyoneering', 'Wilderness Survival', 'Geology'],
      bio: 'James is a certified wilderness guide with over 8 years of experience leading tours in the Grand Canyon. With a background in geology and a passion for conservation, he provides fascinating insights into the natural history of this magnificent landscape.',
      languages: ['English', 'Spanish'],
    },
    dates: [
      {
        id: 'd1',
        date: 'Jun 15-17, 2023',
        spotsLeft: 3,
        price: 'RM 8,000',
      },
      {
        id: 'd2',
        date: 'Jun 22-24, 2023',
        spotsLeft: 6,
        price: 'RM 8,000',
      },
      {
        id: 'd3',
        date: 'Jul 5-7, 2023',
        spotsLeft: 2,
        price: 'RM 8,500',
      },
      {
        id: 'd4',
        date: 'Jul 12-14, 2023',
        spotsLeft: 8,
        price: 'RM 8,500',
      },
      {
        id: 'd5',
        date: 'Aug 2-4, 2023',
        spotsLeft: 4,
        price: 'RM 8,500',
      },
    ],
    reviews: [
      {
        id: 'r1',
        user: 'Michael T.',
        avatar:
          'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        rating: 5,
        date: 'May 2023',
        text: 'This Grand Canyon trek exceeded all my expectations! James was an incredible guide - knowledgeable, safety-conscious, and fun. The views were breathtaking, and camping by the Colorado River was magical. Highly recommend!',
      },
      {
        id: 'r2',
        user: 'Jessica L.',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        rating: 5,
        date: 'April 2023',
        text: 'As a first-time canyon hiker, I was nervous about this adventure, but it turned out to be the highlight of my year! The guides were supportive and encouraging, the food was surprisingly delicious for camping, and the scenery was absolutely unreal. Worth every penny.',
      },
      {
        id: 'r3',
        user: 'David K.',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        rating: 4,
        date: 'March 2023',
        text: "Great experience overall! The hike was challenging but rewarding, and our guide James shared fascinating information about the canyon's geology and history. The only reason for 4 stars instead of 5 is that some of the camping equipment could use an upgrade. Still, I'd definitely recommend this tour!",
      },
    ],
  },
  'swiss-alps': {
    id: 'swiss-alps',
    title: 'Swiss Alps Adventure',
    code: 'SAA-002',
    breadcrumb: ['Home', 'Explore', 'Adventure', 'Swiss Alps Adventure'],
    heroImage:
      'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    duration: '5 days',
    price: 'RM 12,000',
    totalJoined: 86,
    rating: 4.8,
    reviewCount: 86,
    location: 'Interlaken, Switzerland',
    overview: [
      "Immerse yourself in the breathtaking beauty of the Swiss Alps with our 5-day adventure tour based in Interlaken. Experience the perfect blend of adrenaline-pumping activities and serene alpine relaxation in one of Europe's most stunning mountain landscapes.",
      'From soaring above snow-capped peaks on a paragliding flight to exploring crystal-clear mountain lakes, this tour offers unforgettable experiences for nature lovers and adventure seekers alike.',
      'Stay in comfortable alpine accommodations, enjoy authentic Swiss cuisine, and benefit from the expertise of our local guides who will help you discover both famous landmarks and hidden gems throughout the Bernese Oberland region.',
    ],
    highlights: [
      'Paraglide over Interlaken with views of Lakes Thun and Brienz',
      'Hike through meadows and forests to stunning alpine viewpoints',
      'Experience canyoning in pristine mountain gorges',
      "Visit the famous Jungfraujoch – 'Top of Europe'",
      'Enjoy a traditional Swiss fondue dinner in a mountain chalet',
    ],
    contentImage:
      'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1527489377706-5bf97e608852?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1508953233729-33619e3ab2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      'https://images.unsplash.com/photo-1531793046469-1095a5b0ab4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    ],
    inclusions: [
      '4 nights accommodation in a 3-star alpine hotel',
      'Daily breakfast and 3 dinners including traditional Swiss fondue',
      'All adventure activities (paragliding, canyoning, hiking)',
      'Jungfraujoch excursion with mountain railway pass',
      'Professional, English-speaking adventure guides',
      'All necessary equipment for activities',
      'Transportation within the region',
    ],
    exclusions: [
      'Flights to/from Switzerland',
      'Lunches and 1 dinner',
      'Personal expenses and souvenirs',
      'Travel insurance',
      'Optional activities not listed in the itinerary',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Orientation Hike',
        description:
          'Arrive in Interlaken and check into your alpine hotel. Meet your guide for a welcome briefing, followed by an afternoon orientation hike to Harder Kulm for panoramic views of the region. Welcome dinner at a local restaurant.',
        meals: ['Dinner'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 2,
        title: 'Paragliding & Lake Exploration',
        description:
          'Morning paragliding experience over Interlaken (weather permitting). Afternoon boat trip on Lake Brienz with swimming opportunity at a secluded beach. Free evening to explore Interlaken.',
        meals: ['Breakfast'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 3,
        title: 'Jungfraujoch Excursion',
        description:
          'Full-day excursion to Jungfraujoch – Top of Europe (3,454m). Journey by scenic mountain railway through Kleine Scheidegg. Explore the Ice Palace, Sphinx Observatory, and enjoy snow activities on the glacier. Evening fondue dinner in a traditional chalet.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 4,
        title: 'Canyoning Adventure',
        description:
          'Morning canyoning experience in Grimsel region, navigating through gorges, natural slides, and waterfalls. Afternoon visit to Giessbach Falls and leisurely hike. Farewell dinner in Interlaken.',
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Alpine Hotel, Interlaken',
      },
      {
        day: 5,
        title: 'Grindelwald & Departure',
        description:
          'Morning visit to Grindelwald and the First Cliff Walk for spectacular mountain views. Return to Interlaken for departure in the afternoon.',
        meals: ['Breakfast'],
        accommodation: 'Not included',
      },
    ],
    additionalInfo: [
      {
        title: 'Best time to visit',
        content:
          'June to September offers the best weather for outdoor activities. Some activities are weather-dependent and may be rescheduled.',
      },
      {
        title: 'Physical requirements',
        content:
          'Moderate fitness level recommended. Paragliding and canyoning do not require previous experience.',
      },
      {
        title: 'What to bring',
        content:
          'Hiking boots, warm and waterproof clothing (layers recommended), swimwear, sunscreen, camera.',
      },
    ],
    guide: {
      id: 'lukas-meyer',
      name: 'Lukas Meyer',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      experience: '10 years',
      specialties: ['Mountaineering', 'Paragliding', 'Alpine Ecology'],
      bio: 'Born and raised in the Bernese Oberland, Lukas is a certified mountain guide with a passion for sharing the natural beauty and adventure opportunities of his homeland. His knowledge of local history, culture, and hidden spots will make your Swiss Alps experience truly special.',
      languages: ['English', 'German', 'French'],
    },
    dates: [
      {
        id: 'd1',
        date: 'Jun 10-14, 2023',
        spotsLeft: 4,
        price: 'RM 12,000',
      },
      {
        id: 'd2',
        date: 'Jun 24-28, 2023',
        spotsLeft: 2,
        price: 'RM 12,000',
      },
      {
        id: 'd3',
        date: 'Jul 8-12, 2023',
        spotsLeft: 6,
        price: 'RM 13,000',
      },
      {
        id: 'd4',
        date: 'Jul 22-26, 2023',
        spotsLeft: 5,
        price: 'RM 13,000',
      },
      {
        id: 'd5',
        date: 'Aug 5-9, 2023',
        spotsLeft: 8,
        price: 'RM 13,000',
      },
    ],
    reviews: [
      {
        id: 'r1',
        user: 'Emma S.',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        rating: 5,
        date: 'August 2022',
        text: 'The Swiss Alps Adventure was truly the trip of a lifetime! Paragliding over Interlaken was breathtaking, and the Jungfraujoch excursion was spectacular. Our guide Lukas was knowledgeable and personable, making sure everyone had an amazing experience regardless of their adventure level.',
      },
      {
        id: 'r2',
        user: 'Thomas B.',
        avatar:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        rating: 5,
        date: 'July 2022',
        text: 'This tour offered the perfect mix of adrenaline and relaxation. The canyoning was an unexpected highlight - so much fun! The hotel was comfortable and centrally located, and the fondue dinner was delicious. Highly recommend for anyone who loves mountains and adventure.',
      },
      {
        id: 'r3',
        user: 'Sophie L.',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        rating: 4,
        date: 'September 2022',
        text: "Beautiful scenery and well-organized activities. The paragliding was incredible! I'm giving 4 stars because our Jungfraujoch day was quite cloudy with limited visibility, but that's just bad luck with weather. Our guide Lukas was excellent and very knowledgeable about the region.",
      },
    ],
  },
};
// Add more tour data for other categories (cultural, relaxation, food) as needed
const tourData = {
  ...adventureTours,
  // Add other category tours here
};
const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate('/explore/adventure');
    }
    // Reset active tab when tour changes
    setActiveTab('overview');
    setShowAllDates(false);
    setSelectedDate(null);
    // Scroll to top when tour changes
    window.scrollTo(0, 0);
  }, [id, tour, navigate]);
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
                      to={index === 0 ? '/' : index === 1 ? '/explore/adventure' : '#'}
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
        <div className="absolute bottom-0 left-0 w-full pb-8">
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
                  to={`/tour-leader/${tour.guide.id}`}
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
                      to={`/tour-leader/${tour.guide.id}`}
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
              <button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg mb-4 transition-colors ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!selectedDate}
              >
                {selectedDate ? 'Book Now' : 'Select a date to book'}
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
          {Object.values(adventureTours)
            .filter((relatedTour) => relatedTour.id !== tour.id)
            .slice(0, 3)
            .map((relatedTour) => (
              <Link
                key={relatedTour.id}
                to={`/tour/${relatedTour.id}`}
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
