import React, { useState, Children, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, GlobeIcon, MessageCircleIcon, HeartIcon, ShareIcon, CheckIcon, UsersIcon, ChevronRightIcon, StarIcon, ClockIcon, FlagIcon, UserIcon, CompassIcon, BookOpenIcon } from 'lucide-react';
import Rating from '../components/ui/Rating';
import PersonalityMatch from '../components/sections/PersonalityMatch';
import TravelStories from '../components/sections/TravelStories';
import GuideCertifications from '../components/sections/GuideCertifications';
import InterestTag from '../components/ui/InterestTag';
// Add country specializations data
const countrySpecializations = [{
  country: 'Indonesia',
  regions: ['Bali', 'Java', 'Lombok'],
  expertise: 'Expert',
  years: 5,
  flagCode: '🇮🇩'
}, {
  country: 'Thailand',
  regions: ['Bangkok', 'Chiang Mai', 'Phuket'],
  expertise: 'Advanced',
  years: 3,
  flagCode: '🇹🇭'
}, {
  country: 'Vietnam',
  regions: ['Hanoi', 'Ho Chi Minh City'],
  expertise: 'Intermediate',
  years: 2,
  flagCode: '🇻🇳'
}];
// Mock data for a tour leader profile
const tourLeader = {
  id: '1',
  name: 'Sarah Johnson',
  tagline: 'Adventure photographer & cultural explorer',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
  coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  location: 'Bali, Indonesia',
  rating: 4.9,
  reviewCount: 127,
  yearsExperience: 5,
  tripsCompleted: 342,
  languages: ['English', 'Indonesian', 'Spanish'],
  responseTime: '< 1 hour',
  about: "Hi there! I'm Sarah, a passionate photographer and adventurer who has called Bali home for the past 5 years. After falling in love with the island's incredible landscapes and rich culture, I decided to share my knowledge and passion with travelers looking for authentic experiences beyond the tourist traps.\n\nI specialize in adventure photography tours, taking you to hidden waterfalls, secret beaches, and stunning rice terraces while helping you capture amazing photos. Whether you're a photography enthusiast or just want to experience the real Bali, I'll customize each tour to match your interests and energy level.\n\nWhen I'm not guiding tours, you'll find me surfing at sunrise, exploring new hiking trails, or immersing myself in local ceremonies. I believe travel should be transformative, and I'm here to help you create meaningful memories that will last a lifetime.",
  travelPhilosophy: "I believe travel should be about meaningful connections with both people and places. My approach is to go slow, immerse deeply, and leave a positive impact. I'm passionate about responsible tourism that benefits local communities and preserves natural environments.",
  personality: ['High-energy', 'Adventurous', 'Educational', 'Photography', 'Nature-focused', 'Cultural'],
  specialties: ['Adventure', 'Photography', 'Culture', 'Nature', 'Hidden Gems'],
  travelStories: [{
    id: 'story1',
    title: 'Finding Serenity at a Hidden Waterfall',
    location: 'Munduk, Bali',
    date: 'March 2023',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    content: "Last month, I ventured deep into the jungles of Munduk to find a waterfall that locals had told me about but isn't on any tourist map. After a challenging 2-hour trek through dense vegetation, I was rewarded with the most breathtaking sight: a 50-meter waterfall cascading into a pristine emerald pool, completely untouched by tourism. I spent the entire afternoon swimming, meditating, and capturing the magical light as it filtered through the canopy. These are the moments that remind me why I fell in love with Bali - there's always another hidden gem waiting to be discovered if you're willing to venture off the beaten path.",
    likes: 156,
    traits: ['Adventurous', 'Nature-focused', 'Photography']
  }, {
    id: 'story2',
    title: 'Sunrise Ceremony with a Balinese Priest',
    location: 'Tirta Empul Temple, Bali',
    date: 'January 2023',
    image: 'https://images.unsplash.com/photo-1604480133435-25b86862d276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    content: "I was incredibly honored to be invited to participate in a private purification ceremony at Tirta Empul temple before it opened to the public. A local priest who has become a dear friend guided me through the sacred rituals as the sun rose over the ancient springs. We made offerings, prayed, and then immersed ourselves in the holy water. The experience was deeply spiritual and gave me a much deeper understanding of Balinese Hinduism. What made this experience special wasn't just the ceremony itself, but the personal stories and wisdom the priest shared with me about how these traditions have shaped Balinese culture for centuries.",
    likes: 89,
    traits: ['Cultural', 'Spiritual', 'Educational']
  }, {
    id: 'story3',
    title: 'Teaching Photography to Local Children',
    location: 'Sidemen Village, Bali',
    date: 'December 2022',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    content: 'One of my most rewarding experiences has been volunteering at a small school in Sidemen, teaching photography to local children. Last month, we organized a special project where each child was given a simple camera to document their daily life and what makes their village special. The results were incredible - seeing their community through their eyes revealed so many beautiful details I had never noticed before. We created an exhibition of their work for the whole village, and the pride on their faces as they showed their families their photographs was unforgettable. These children have taught me that the most authentic way to understand a place is through the eyes of those who call it home.',
    likes: 203,
    traits: ['Educational', 'Cultural', 'Photography']
  }, {
    id: 'story4',
    title: 'Sunset at Mount Batur',
    location: 'Mount Batur, Bali',
    date: 'November 2022',
    image: 'https://images.unsplash.com/photo-1604608678051-64d46d8d0eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    content: 'The view from Mount Batur at sunset is absolutely breathtaking. The colors reflecting off Lake Batur create a magical atmosphere.',
    likes: 178,
    traits: ['Nature-focused', 'Photography']
  }, {
    id: 'story5',
    title: 'Traditional Dance Performance',
    location: 'Ubud, Bali',
    date: 'October 2022',
    image: 'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    content: 'Watching traditional Balinese dance performances in Ubud is a cultural experience not to be missed. The intricate movements tell ancient stories.',
    likes: 134,
    traits: ['Cultural', 'Educational']
  }, {
    id: 'story6',
    title: 'Rice Terrace Exploration',
    location: 'Tegallalang, Bali',
    date: 'September 2022',
    image: 'https://images.unsplash.com/photo-1476158085676-e67f57ed9ed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    content: 'The Tegallalang rice terraces are a testament to traditional Balinese farming techniques. The layered landscape is perfect for photography.',
    likes: 221,
    traits: ['Nature-focused', 'Photography', 'Cultural']
  }],
  tours: [{
    id: 'tour1',
    title: 'Hidden Waterfalls & Rice Terraces',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '1 day (8 hours)',
    groupSize: 'Small group (max 6)',
    includes: ['Transportation', 'Lunch', 'Photography tips', 'Water'],
    price: 85,
    rating: 4.9,
    reviewCount: 78,
    description: "Discover Bali's most beautiful hidden waterfalls and rice terraces on this full-day adventure. We'll trek through lush jungles, swim in pristine natural pools, and capture stunning photos away from the tourist crowds. This tour is perfect for nature lovers and photography enthusiasts of all skill levels.",
    dates: [{
      id: 'd1',
      date: 'Jun 15, 2023',
      spotsLeft: 3
    }, {
      id: 'd2',
      date: 'Jun 22, 2023',
      spotsLeft: 6
    }, {
      id: 'd3',
      date: 'Jul 5, 2023',
      spotsLeft: 2
    }]
  }, {
    id: 'tour2',
    title: 'Sunrise Volcano Hike & Hot Springs',
    image: 'https://images.unsplash.com/photo-1604608678051-64d46d8d0eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '1 day (10 hours)',
    groupSize: 'Small group (max 8)',
    includes: ['Transportation', 'Breakfast', 'Guide', 'Hot springs entry'],
    price: 95,
    rating: 4.8,
    reviewCount: 56,
    description: "Experience the magic of sunrise from Mount Batur, an active volcano with breathtaking views. After a moderate 2-hour hike in the pre-dawn darkness, we'll reach the summit just in time to watch the sun rise over Mount Agung and Lake Batur. Afterward, we'll soothe our muscles in natural hot springs before returning to your accommodation.",
    dates: [{
      id: 'd1',
      date: 'Jun 18, 2023',
      spotsLeft: 4
    }, {
      id: 'd2',
      date: 'Jun 25, 2023',
      spotsLeft: 8
    }, {
      id: 'd3',
      date: 'Jul 2, 2023',
      spotsLeft: 5
    }]
  }, {
    id: 'tour3',
    title: 'Cultural Villages & Local Crafts',
    image: 'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '1 day (7 hours)',
    groupSize: 'Small group (max 6)',
    includes: ['Transportation', 'Lunch', 'Craft workshop', 'Local guide'],
    price: 75,
    rating: 4.9,
    reviewCount: 42,
    description: "Immerse yourself in authentic Balinese culture by visiting traditional villages and meeting local artisans. We'll learn about daily life, witness ancient crafting techniques, and even try our hand at making traditional crafts. This tour provides deep cultural insights while supporting local communities.",
    dates: [{
      id: 'd1',
      date: 'Jun 20, 2023',
      spotsLeft: 6
    }, {
      id: 'd2',
      date: 'Jun 27, 2023',
      spotsLeft: 4
    }, {
      id: 'd3',
      date: 'Jul 4, 2023',
      spotsLeft: 6
    }]
  }],
  reviews: [{
    id: 'r1',
    user: 'Michael T.',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
    rating: 5,
    date: 'May 2023',
    text: "Sarah was an incredible guide! She took us to the most beautiful waterfalls I've ever seen, and they weren't crowded with tourists. Her photography tips were super helpful - I got the best photos of my entire trip. She's also very knowledgeable about Balinese culture and made sure we had an authentic experience. Highly recommend!"
  }, {
    id: 'r2',
    user: 'Jessica L.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
    rating: 5,
    date: 'April 2023',
    text: 'We did the sunrise volcano hike with Sarah and it was the highlight of our trip! She made the early morning and challenging hike so much fun with her positive energy. The views were breathtaking and Sarah knew all the best spots for photos. The hot springs afterward were the perfect way to relax. Sarah is friendly, professional, and truly passionate about what she does.'
  }, {
    id: 'r3',
    user: 'David K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
    rating: 4,
    date: 'March 2023',
    text: "Great cultural tour with Sarah! She has deep connections with the local villages and artisans, which gave us access to experiences we couldn't have found on our own. The craft workshop was a highlight - my kids loved making traditional Balinese offerings. Sarah is very knowledgeable and accommodating. The only reason for 4 stars instead of 5 is that the day was quite hot, but that's Bali for you!"
  }],
  certifications: [{
    id: 'cert1',
    name: 'Certified Adventure Guide',
    issuer: 'International Adventure Guide Association',
    year: '2020',
    icon: 'award',
    verified: true
  }, {
    id: 'cert2',
    name: 'Wilderness First Responder',
    issuer: 'Red Cross',
    year: '2021',
    icon: 'shield',
    verified: true
  }, {
    id: 'cert3',
    name: 'Professional Photography Certification',
    issuer: 'Photography Institute',
    year: '2019',
    icon: 'check',
    verified: false
  }]
};
const TourLeaderProfile = () => {
  const {
    id
  } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [isSaved, setIsSaved] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const handleSaveGuide = () => {
    setIsSaved(!isSaved);
  };
  const toggleLike = (storyId: string) => {
    setLikedStories(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };
  const toggleStoryExpansion = (storyId: string) => {
    if (expandedStory === storyId) {
      setExpandedStory(null);
    } else {
      setExpandedStory(storyId);
    }
  };
  return <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="relative h-[300px] md:h-[400px]">
        <img src={tourLeader.coverImage} alt={`${tourLeader.name}'s tours in ${tourLeader.location}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Profile Header - Always visible at the top */}
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 mb-6 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mb-4 md:mb-0">
              <div className="flex items-start">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white overflow-hidden shadow-md mr-4 md:mr-0 md:mb-4">
                  <img src={tourLeader.image} alt={tourLeader.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:hidden">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {tourLeader.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2 text-sm">
                    <MapPinIcon size={14} className="mr-1" />
                    {tourLeader.location}
                  </div>
                  <div className="flex items-center">
                    <Rating value={tourLeader.rating} reviewCount={tourLeader.reviewCount} size="sm" />
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {tourLeader.name}
                </h1>
                <p className="text-gray-600 mb-2 text-sm">
                  {tourLeader.tagline}
                </p>
                <div className="flex items-center text-gray-600 mb-2 text-sm">
                  <MapPinIcon size={14} className="mr-1" />
                  {tourLeader.location}
                </div>
                <div className="flex items-center mb-4">
                  <Rating value={tourLeader.rating} reviewCount={tourLeader.reviewCount} size="sm" />
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg flex items-center text-sm">
                    <MessageCircleIcon size={14} className="mr-1.5" />
                    Message
                  </button>
                  <button className={`border ${isSaved ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-medium py-1.5 px-3 rounded-lg flex items-center text-sm`} onClick={handleSaveGuide}>
                    <HeartIcon size={14} className={`mr-1.5 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium p-1.5 rounded-lg">
                    <ShareIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="md:w-3/4 md:pl-6 md:border-l md:border-gray-200">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  About {tourLeader.name}
                </h2>
                <div className="text-gray-600 text-sm">
                  {showFullAbout ? tourLeader.about : `${tourLeader.about.substring(0, 300)}...`}
                  {!showFullAbout && tourLeader.about.length > 300 && <button className="text-blue-600 font-medium hover:text-blue-800 ml-1" onClick={() => setShowFullAbout(true)}>
                      Read more
                    </button>}
                  {showFullAbout && <button className="text-blue-600 font-medium hover:text-blue-800 ml-1" onClick={() => setShowFullAbout(false)}>
                      Show less
                    </button>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <CalendarIcon size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Experience</div>
                      <div className="font-medium text-gray-900 text-sm">
                        {tourLeader.yearsExperience} years
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <CheckIcon size={14} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Tours completed
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {tourLeader.tripsCompleted}+
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <ClockIcon size={14} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Response time</div>
                      <div className="font-medium text-gray-900 text-sm">
                        {tourLeader.responseTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                      <StarIcon size={14} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Rating</div>
                      <div className="font-medium text-gray-900 text-sm">
                        {tourLeader.rating} ({tourLeader.reviewCount})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center">
                <div className="flex items-center mr-6 mb-2">
                  <GlobeIcon size={16} className="text-gray-500 mr-1.5" />
                  <div className="text-sm text-gray-600">
                    {tourLeader.languages.join(', ')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tourLeader.specialties.map((specialty, index) => <span key={`specialty-${index}`} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {specialty}
                    </span>)}
                </div>
              </div>
              <div className="md:hidden flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center text-sm">
                  <MessageCircleIcon size={14} className="mr-1.5" />
                  Message
                </button>
                <button className={`flex-1 border ${isSaved ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-medium py-1.5 px-3 rounded-lg flex items-center justify-center text-sm`} onClick={handleSaveGuide}>
                  <HeartIcon size={14} className={`mr-1.5 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium p-1.5 rounded-lg">
                  <ShareIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('about')}>
                <UserIcon size={16} className="inline mr-1.5" />
                About Me
              </button>
              <button className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'stories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('stories')}>
                <CompassIcon size={16} className="inline mr-1.5" />
                Travel Stories
              </button>
              <button className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'tours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('tours')}>
                <BookOpenIcon size={16} className="inline mr-1.5" />
                Tours
              </button>
              <button className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab('reviews')}>
                <StarIcon size={16} className="inline mr-1.5" />
                Reviews ({tourLeader.reviewCount})
              </button>
            </div>
          </div>
          {/* About Me Tab */}
          {activeTab === 'about' && <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* My Travel Philosophy */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <CompassIcon size={18} className="mr-2 text-blue-600" />
                      My Travel Philosophy
                    </h3>
                    <p className="text-gray-700">
                      {tourLeader.travelPhilosophy}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        My Travel Style
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tourLeader.personality.map((trait, index) => <InterestTag key={`trait-${index}`} label={trait} icon={<div className="w-4 h-4 bg-blue-100 rounded-full"></div>} iconPosition="top" className="mb-0" />)}
                      </div>
                    </div>
                  </div>
                  {/* Country Specializations */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-900 flex items-center">
                        <FlagIcon size={18} className="mr-2 text-blue-600" />
                        Country Specializations
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {countrySpecializations.map((spec, index) => <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl mr-3">{spec.flagCode}</div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-900">
                                {spec.country}
                              </h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${spec.expertise === 'Expert' ? 'bg-blue-100 text-blue-800' : spec.expertise === 'Advanced' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {spec.expertise} • {spec.years} years
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Regions: {spec.regions.join(', ')}
                            </p>
                          </div>
                        </div>)}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Personality Match */}
                  <PersonalityMatch tourLeaderPersonality={tourLeader.personality} className="p-5" />
                  {/* Guide Certifications Section */}
                  <GuideCertifications certifications={tourLeader.certifications} className="p-5" />
                </div>
              </div>
            </div>}
          {/* Travel Stories Tab - Instagram Grid Style */}
          {activeTab === 'stories' && <div className="p-5">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Travel Stories
                </h2>
                <p className="text-gray-600">
                  Follow my adventures around the world
                </p>
              </div>
              {/* Grid Layout for Stories */}
              {expandedStory === null ? <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tourLeader.travelStories.map(story => <div key={story.id} className="aspect-square relative cursor-pointer overflow-hidden rounded-md" onClick={() => toggleStoryExpansion(story.id)}>
                      <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <h3 className="text-white font-medium text-sm">
                          {story.title}
                        </h3>
                        <p className="text-white/80 text-xs">
                          {story.location}
                        </p>
                      </div>
                    </div>)}
                </div> :
          // Expanded Story View
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <button className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-1.5" onClick={() => setExpandedStory(null)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <div className="aspect-[16/9] relative">
                      <img src={tourLeader.travelStories.find(s => s.id === expandedStory)?.image} alt={tourLeader.travelStories.find(s => s.id === expandedStory)?.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img src={tourLeader.image} alt={tourLeader.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {tourLeader.name}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {tourLeader.travelStories.find(s => s.id === expandedStory)?.location}{' '}
                          •{' '}
                          {tourLeader.travelStories.find(s => s.id === expandedStory)?.date}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      {tourLeader.travelStories.find(s => s.id === expandedStory)?.title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {tourLeader.travelStories.find(s => s.id === expandedStory)?.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tourLeader.travelStories.find(s => s.id === expandedStory)?.traits.map((trait, index) => <InterestTag key={`${expandedStory}-trait-${index}`} label={trait} className="text-xs" />)}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-500 hover:text-red-500" onClick={() => toggleLike(expandedStory)}>
                          <HeartIcon size={18} className={`mr-1 ${likedStories[expandedStory] ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>
                            {likedStories[expandedStory] ? (tourLeader.travelStories.find(s => s.id === expandedStory)?.likes || 0) + 1 : tourLeader.travelStories.find(s => s.id === expandedStory)?.likes}
                          </span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-500">
                          <MessageCircleIcon size={18} className="mr-1" />
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-500">
                          <ShareIcon size={18} className="mr-1" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>}
          {/* Tours Tab */}
          {activeTab === 'tours' && <div className="p-5">
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Curated Experiences
                </h2>
                {tourLeader.tours.map(tour => <div key={tour.id} className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {tour.duration}
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {tour.title}
                        </h3>
                        <Rating value={tour.rating} size="sm" />
                      </div>
                      <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <UsersIcon size={14} className="mr-1" />
                          {tour.groupSize}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {tour.description}
                      </p>
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-1.5">
                          Includes:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tour.includes.map((item, index) => <div key={`${tour.id}-include-${index}`} className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              <CheckIcon size={12} className="text-green-600 mr-1" />
                              {item}
                            </div>)}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-gray-500">From</div>
                          <div className="font-bold text-lg text-gray-900">
                            ${tour.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            per person
                          </div>
                        </div>
                        <Link to={`/booking/${tour.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>)}
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Upcoming Tours
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tourLeader.tours.flatMap(tour => tour.dates.map(date => <div key={`${tour.id}-${date.id}`} className="border border-gray-200 rounded-lg p-4 flex items-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center mr-4 shrink-0">
                          <span className="text-blue-700 font-bold">
                            {date.date.split(', ')[0].split(' ')[0]}
                          </span>
                          <span className="text-blue-700 text-sm">
                            {date.date.split(', ')[0].split(' ')[1]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {tour.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {tour.duration}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm font-medium text-gray-900">
                              ${tour.price}/person
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${date.spotsLeft <= 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {date.spotsLeft} spots left
                            </span>
                          </div>
                        </div>
                      </div>))}
                </div>
              </div>
            </div>}
          {/* Reviews Tab */}
          {activeTab === 'reviews' && <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {tourLeader.rating}
                    </div>
                    <Rating value={tourLeader.rating} showCount={false} />
                  </div>
                  <div className="text-gray-600 text-sm">
                    Based on {tourLeader.reviewCount} reviews
                  </div>
                </div>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-1.5 px-3 rounded-lg text-sm">
                  Filter Reviews
                </button>
              </div>
              <div className="space-y-5">
                {tourLeader.reviews.map(review => <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start mb-3">
                      <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.user}
                        </div>
                        <div className="flex items-center">
                          <Rating value={review.rating} size="sm" showCount={false} />
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.text}</p>
                  </div>)}
              </div>
              <div className="mt-6 text-center">
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-5 rounded-lg text-sm">
                  Load More Reviews
                </button>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default TourLeaderProfile;