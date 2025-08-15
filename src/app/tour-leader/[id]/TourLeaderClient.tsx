'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import Rating from '@/components/ui/Rating';
import PersonalityMatch from '@/components/sections/PersonalityMatch';
import GuideCertifications from '@/components/sections/GuideCertifications';
import InterestTag from '@/components/ui/InterestTag';

interface TourLeaderProps {
  tourLeader: any;
}

const TourLeaderClient = ({ tourLeader }: TourLeaderProps) => {
  const router = useRouter();
  
  // Ensure data arrays exist
  const travelStories = tourLeader.travelStories || [];
  const countrySpecializations = tourLeader.countrySpecializations || [];
  const tours = tourLeader.tours || [];
  const personality = tourLeader.personality || [];
  const certifications = tourLeader.certifications || [];
  const specialties = tourLeader.specialties || [];
  const languages = tourLeader.languages || [];

  // Determine initial active tab based on available data
  const getInitialTab = () => {
    if (travelStories.length === 0 && tours.length === 0) {
      return 'about';
    }
    return 'about'; // Default to about tab
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
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

  // Validate tab change
  const handleTabChange = (tab: string) => {
    // Only allow switching to tabs that have data
    if (tab === 'stories' && travelStories.length === 0) return;
    if (tab === 'tours' && tours.length === 0) return;
    setActiveTab(tab);
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
                  {tourLeader.about && tourLeader.about.length > 300 ? (
                    <>
                      {showFullAbout ? tourLeader.about : `${tourLeader.about.substring(0, 300)}...`}
                      {!showFullAbout && (
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
                    </>
                  ) : (
                    tourLeader.about || tourLeader.description
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
                        {tourLeader.experience || `${tourLeader.yearsExperience} years`}
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
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-green-600 font-bold text-xs">$</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Rate</div>
                      <div className="font-medium text-gray-900 text-sm">
                        {tourLeader.rate || 'Contact for pricing'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center">
                <div className="flex items-center mr-6 mb-2">
                  <GlobeIcon size={16} className="text-gray-500 mr-1.5" />
                  <div className="text-sm text-gray-600">{languages.join(', ')}</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {specialties.map((specialty: string, index: number) => (
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
                onClick={() => handleTabChange('about')}
              >
                <UserIcon size={16} className="inline mr-1.5" />
                About Me
              </button>
              {travelStories.length > 0 && (
                <button
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'stories'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => handleTabChange('stories')}
                >
                  <CompassIcon size={16} className="inline mr-1.5" />
                  Travel Stories
                </button>
              )}
              {tours.length > 0 && (
                <button
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'tours'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => handleTabChange('tours')}
                >
                  <BookOpenIcon size={16} className="inline mr-1.5" />
                  Tours
                </button>
              )}
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
                  </div>
                  {/* Country Specializations */}
                  {countrySpecializations.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center">
                          <FlagIcon size={18} className="mr-2 text-blue-600" />
                          Country Specializations
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {countrySpecializations.map((spec: any, index: number) => (
                          <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl mr-3">{spec.icon || '🌍'}</div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-gray-900">{spec.name || spec.country}</h4>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    spec.level === 'Expert' || spec.expertise === 'Expert'
                                      ? 'bg-blue-100 text-blue-800'
                                      : spec.level === 'Advanced' || spec.expertise === 'Advanced'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {spec.level || spec.expertise} • {spec.yearCount || spec.years} years
                                </span>
                              </div>
                              {spec.regions && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Regions: {spec.regions.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {/* Personality Match */}
                  {personality.length > 0 && (
                    <PersonalityMatch
                      tourLeaderPersonality={personality}
                      className="p-5"
                    />
                  )}
                  {/* Guide Certifications Section */}
                  {certifications.length > 0 && (
                    <GuideCertifications certifications={certifications} className="p-5" />
                  )}
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
              {travelStories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No travel stories available yet.
                </div>
              ) : expandedStory === null ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {travelStories.map((story: any) => (
                    <div
                      key={story.id}
                      className="aspect-square relative cursor-pointer overflow-hidden rounded-md"
                      onClick={() => toggleStoryExpansion(story.id)}
                    >
                      <img
                        src={story.images && story.images.length > 0 ? story.images[0] : story.image}
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
                        src={(() => {
                          const story = travelStories.find((s: any) => s.id === expandedStory);
                          return story?.images && story.images.length > 0 ? story.images[0] : story?.image;
                        })()}
                        alt={travelStories.find((s: any) => s.id === expandedStory)?.title}
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
                          {travelStories.find((s: any) => s.id === expandedStory)?.location} •{' '}
                          {travelStories.find((s: any) => s.id === expandedStory)?.date}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      {travelStories.find((s: any) => s.id === expandedStory)?.title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {travelStories.find((s: any) => s.id === expandedStory)?.description ||
                        travelStories.find((s: any) => s.id === expandedStory)?.content}
                    </p>
                    {travelStories.find((s: any) => s.id === expandedStory)?.traits && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {travelStories
                          .find((s: any) => s.id === expandedStory)
                          ?.traits.map((trait: string, index: number) => (
                            <InterestTag
                              key={`${expandedStory}-trait-${index}`}
                              label={trait}
                              className="text-xs"
                            />
                          ))}
                      </div>
                    )}
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
                              ? (travelStories.find((s: any) => s.id === expandedStory)
                                  ?.likes || 0) + 1
                              : travelStories.find((s: any) => s.id === expandedStory)?.likes || 'Like'}
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
                {tours.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tours available yet.
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Curated Experiences</h2>
                    {tours.map((tour: any) => (
                      <div
                        key={tour.id}
                        className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => router.push(`/tour/${tour.id}`)}
                      >
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {tour.duration}
                          </div>
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{tour.title}</h3>
                            <Rating value={tour.rating} size="sm" />
                          </div>
                          <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                            <div className="flex items-center">
                              <UsersIcon size={14} className="mr-1" />
                              {tour.groupSize}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
                          {tour.includes && (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-700 mb-1.5">Includes:</div>
                              <div className="flex flex-wrap gap-2">
                                {tour.includes.map((item: string, index: number) => (
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
                          )}
                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-xs text-gray-500">From</div>
                              <div className="font-bold text-lg text-gray-900">{tour.price.toString().startsWith('$') ? tour.price : `$${tour.price}`}</div>
                              <div className="text-xs text-gray-500">per person</div>
                            </div>
                            {tour.dates && tour.dates.length > 0 ? (
                              <Link
                                href={`/booking/${tour.id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Book Now
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg text-sm cursor-not-allowed"
                                onClick={(e) => e.stopPropagation()}
                              >
                                No Dates Available
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Upcoming Tours */}
                    {tours.some((tour: any) => tour.dates && tour.dates.length > 0) && (
                      <>
                        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Upcoming Tours</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tours.flatMap((tour: any) =>
                            (tour.dates || []).map((date: any) => (
                              <div
                                key={`${tour.id}-${date.id}`}
                                className="border border-gray-200 rounded-lg p-4 flex items-center"
                              >
                                <div className="w-16 h-16 bg-blue-50 rounded-lg flex flex-col items-center justify-center mr-4 shrink-0">
                                  {(() => {
                                    const dateObj = new Date(date.date);
                                    const day = dateObj.getDate();
                                    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                                    return (
                                      <>
                                        <span className="text-blue-700 font-bold text-sm">
                                          {month}
                                        </span>
                                        <span className="text-blue-700 font-bold">
                                          {day}
                                        </span>
                                      </>
                                    );
                                  })()}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">{tour.title}</h3>
                                  <p className="text-gray-600 text-sm">{tour.duration}</p>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-sm font-medium text-gray-900">
                                      {tour.price.toString().startsWith('$') ? tour.price : `$${tour.price}`}/person
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
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourLeaderClient;