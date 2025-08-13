import React, { useState, Children, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarIcon,
  GlobeIcon,
  MessageCircleIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  UsersIcon,
  StarIcon,
  ClockIcon,
  FlagIcon,
  UserIcon,
  CompassIcon,
  BookOpenIcon,
} from 'lucide-react';
import Rating from '../components/ui/Rating';
import PersonalityMatch from '../components/sections/PersonalityMatch';
import GuideCertifications from '../components/sections/GuideCertifications';
import InterestTag from '../components/ui/InterestTag';
// Add country specializations data
// Country specializations moved to mock file
// Mock data for a tour leader profile
// Tour leader data moved to mock file
import { countrySpecializations, tourLeaderProfile as tourLeader } from '../mock/tourLeaders';
const TourLeaderProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const toggleLike = (storyId: string) => {
    setLikedStories((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };
  const toggleStoryExpansion = (storyId: string) => {
    if (expandedStory === storyId) {
      setExpandedStory(null);
    } else {
      setExpandedStory(storyId);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src={tourLeader.coverImage}
          alt={`${tourLeader.name}'s tours in ${tourLeader.location}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Profile Header - Always visible at the top */}
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 mb-6 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mb-4 md:mb-0">
              <div className="flex items-start">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white overflow-hidden shadow-md mr-4 md:mr-0 md:mb-4">
                  <img
                    src={tourLeader.image}
                    alt={tourLeader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:hidden">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">{tourLeader.name}</h1>
                  <div className="flex items-center text-gray-600 mb-2 text-sm">
                    <MapPinIcon size={14} className="mr-1" />
                    {tourLeader.location}
                  </div>
                  <div className="flex items-center">
                    <Rating value={tourLeader.rating} size="sm" showCount={false} />
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{tourLeader.name}</h1>
                <p className="text-gray-600 mb-2 text-sm">{tourLeader.tagline}</p>
                <div className="flex items-center text-gray-600 mb-2 text-sm">
                  <MapPinIcon size={14} className="mr-1" />
                  {tourLeader.location}
                </div>
                <div className="flex items-center mb-4">
                  <Rating
                    value={tourLeader.rating}
                    reviewCount={tourLeader.reviewCount}
                    size="sm"
                  />
                </div>
              </div>
            </div>
            <div className="md:w-3/4 md:pl-6 md:border-l md:border-gray-200">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2">About {tourLeader.name}</h2>
                <div className="text-gray-600 text-sm">
                  {showFullAbout ? tourLeader.about : `${tourLeader.about.substring(0, 300)}...`}
                  {!showFullAbout && tourLeader.about.length > 300 && (
                    <button
                      className="text-blue-600 font-medium hover:text-blue-800 ml-1"
                      onClick={() => setShowFullAbout(true)}
                    >
                      Read more
                    </button>
                  )}
                  {showFullAbout && (
                    <button
                      className="text-blue-600 font-medium hover:text-blue-800 ml-1"
                      onClick={() => setShowFullAbout(false)}
                    >
                      Show less
                    </button>
                  )}
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
                      <div className="text-xs text-gray-500">Tours completed</div>
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
                      <div className="font-medium text-gray-900 text-sm">{tourLeader.rating}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center">
                <div className="flex items-center mr-6 mb-2">
                  <GlobeIcon size={16} className="text-gray-500 mr-1.5" />
                  <div className="text-sm text-gray-600">{tourLeader.languages.join(', ')}</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tourLeader.specialties.map((specialty, index) => (
                    <span
                      key={`specialty-${index}`}
                      className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('about')}
              >
                <UserIcon size={16} className="inline mr-1.5" />
                About Me
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'stories'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('stories')}
              >
                <CompassIcon size={16} className="inline mr-1.5" />
                Travel Stories
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'tours'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('tours')}
              >
                <BookOpenIcon size={16} className="inline mr-1.5" />
                Tours
              </button>
            </div>
          </div>
          {/* About Me Tab */}
          {activeTab === 'about' && (
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* My Travel Philosophy */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <CompassIcon size={18} className="mr-2 text-blue-600" />
                      My Travel Philosophy
                    </h3>
                    <p className="text-gray-700">{tourLeader.travelPhilosophy}</p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">My Travel Style</h4>
                      <div className="flex flex-wrap gap-2">
                        {tourLeader.personality.map((trait, index) => (
                          <InterestTag key={`trait-${index}`} label={trait} className="mb-0" />
                        ))}
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
                      {countrySpecializations.map((spec, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl mr-3">{spec.flagCode}</div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-900">{spec.country}</h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  spec.expertise === 'Expert'
                                    ? 'bg-blue-100 text-blue-800'
                                    : spec.expertise === 'Advanced'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {spec.expertise} • {spec.years} years
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Regions: {spec.regions.join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Personality Match */}
                  <PersonalityMatch
                    tourLeaderPersonality={tourLeader.personality}
                    className="p-5"
                  />
                  {/* Guide Certifications Section */}
                  <GuideCertifications certifications={tourLeader.certifications} className="p-5" />
                </div>
              </div>
            </div>
          )}
          {/* Travel Stories Tab - Instagram Grid Style */}
          {activeTab === 'stories' && (
            <div className="p-5">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">Travel Stories</h2>
                <p className="text-gray-600">Follow my adventures around the world</p>
              </div>
              {/* Grid Layout for Stories */}
              {expandedStory === null ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tourLeader.travelStories.map((story) => (
                    <div
                      key={story.id}
                      className="aspect-square relative cursor-pointer overflow-hidden rounded-md"
                      onClick={() => toggleStoryExpansion(story.id)}
                    >
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <h3 className="text-white font-medium text-sm">{story.title}</h3>
                        <p className="text-white/80 text-xs">{story.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Expanded Story View
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="relative">
                    <button
                      className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-1.5"
                      onClick={() => setExpandedStory(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <div className="aspect-[16/9] relative">
                      <img
                        src={tourLeader.travelStories.find((s) => s.id === expandedStory)?.image}
                        alt={tourLeader.travelStories.find((s) => s.id === expandedStory)?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img
                        src={tourLeader.image}
                        alt={tourLeader.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{tourLeader.name}</h3>
                        <p className="text-gray-600 text-xs">
                          {tourLeader.travelStories.find((s) => s.id === expandedStory)?.location} •{' '}
                          {tourLeader.travelStories.find((s) => s.id === expandedStory)?.date}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      {tourLeader.travelStories.find((s) => s.id === expandedStory)?.title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {tourLeader.travelStories.find((s) => s.id === expandedStory)?.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tourLeader.travelStories
                        .find((s) => s.id === expandedStory)
                        ?.traits.map((trait, index) => (
                          <InterestTag
                            key={`${expandedStory}-trait-${index}`}
                            label={trait}
                            className="text-xs"
                          />
                        ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center space-x-4">
                        <button
                          className="flex items-center text-gray-500 hover:text-red-500"
                          onClick={() => toggleLike(expandedStory)}
                        >
                          <HeartIcon
                            size={18}
                            className={`mr-1 ${
                              likedStories[expandedStory] ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                          <span>
                            {likedStories[expandedStory]
                              ? (tourLeader.travelStories.find((s) => s.id === expandedStory)
                                  ?.likes || 0) + 1
                              : tourLeader.travelStories.find((s) => s.id === expandedStory)?.likes}
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
                </div>
              )}
            </div>
          )}
          {/* Tours Tab */}
          {activeTab === 'tours' && (
            <div className="p-5">
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Curated Experiences</h2>
                {tourLeader.tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {tour.duration}
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{tour.title}</h3>
                        <Rating value={tour.rating} size="sm" />
                      </div>
                      <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <UsersIcon size={14} className="mr-1" />
                          {tour.groupSize}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-1.5">Includes:</div>
                        <div className="flex flex-wrap gap-2">
                          {tour.includes.map((item, index) => (
                            <div
                              key={`${tour.id}-include-${index}`}
                              className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                            >
                              <CheckIcon size={12} className="text-green-600 mr-1" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-gray-500">From</div>
                          <div className="font-bold text-lg text-gray-900">${tour.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                        <Link
                          to={`/booking/${tour.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Upcoming Tours</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tourLeader.tours.flatMap((tour) =>
                    tour.dates.map((date) => (
                      <div
                        key={`${tour.id}-${date.id}`}
                        className="border border-gray-200 rounded-lg p-4 flex items-center"
                      >
                        <div className="w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center mr-4 shrink-0">
                          <span className="text-blue-700 font-bold">
                            {date.date.split(', ')[0].split(' ')[0]}
                          </span>
                          <span className="text-blue-700 text-sm">
                            {date.date.split(', ')[0].split(' ')[1]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{tour.title}</h3>
                          <p className="text-gray-600 text-sm">{tour.duration}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm font-medium text-gray-900">
                              ${tour.price}/person
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                date.spotsLeft <= 3
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {date.spotsLeft} spots left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TourLeaderProfile;
