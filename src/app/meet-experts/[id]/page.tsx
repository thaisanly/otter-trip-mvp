'use client'

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  MapPinIcon,
  GlobeIcon,
  CheckCircleIcon,
  StarIcon,
  VideoIcon,
  ShoppingBagIcon,
  MessageCircleIcon,
  CalendarIcon,
  PauseIcon,
  PlayIcon,
  VolumeIcon,
  Volume2Icon,
  Volume1Icon,
  VolumeXIcon,
  MailIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  ClockIcon,
  ChevronDownIcon,
  CheckIcon,
  UserIcon,
} from 'lucide-react';
import ConsultationBookingModal from '@/components/booking/ConsultationBookingModal';
import ExpertInquiryForm from '@/components/forms/ExpertInquiryForm';
import VideoModal from '@/components/ui/VideoModal';
import { formatViewCount } from '@/utils/formatters';
// Default cover images from Unsplash (travel/adventure themed)
const defaultCoverImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Mountains
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Travel planning
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Lake and mountains
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Boat on water
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Road trip
  'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Norway coast
];

const getRandomDefaultCover = (expertId: string) => {
  // Use expert ID to consistently get the same image for the same expert
  const index = expertId ? expertId.charCodeAt(0) % defaultCoverImages.length : 0;
  return defaultCoverImages[index];
};

const getNextAvailableDate = (dates?: Array<{ date: string; spotsLeft?: number }> | string[]): { date: string; spotsLeft: number } | null => {
  if (!dates) return null;
  
  // Handle both array of strings and array of objects
  let dateArray: Array<{ date: string; spotsLeft?: number }> = [];
  
  if (Array.isArray(dates)) {
    if (dates.length === 0) return null;
    
    // Check if it's an array of objects or strings
    if (typeof dates[0] === 'string') {
      dateArray = (dates as string[]).map(d => ({ date: d }));
    } else if (typeof dates[0] === 'object' && 'date' in dates[0]) {
      dateArray = dates as Array<{ date: string; spotsLeft?: number }>;
    } else {
      return null;
    }
  } else {
    return null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find the first date that is today or in the future
  for (const dateObj of dateArray) {
    const tourDate = new Date(dateObj.date);
    tourDate.setHours(0, 0, 0, 0);
    
    if (tourDate >= today) {
      // Use provided spots or generate random
      const spotsLeft = dateObj.spotsLeft !== undefined ? dateObj.spotsLeft : Math.floor(Math.random() * 6) + 3;
      
      // Format the date
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      };
      const formattedDate = tourDate.toLocaleDateString('en-US', options);
      
      return { date: formattedDate, spotsLeft };
    }
  }
  
  // If no future dates, return the last date as "Next available"
  if (dateArray.length > 0) {
    const lastDateObj = dateArray[dateArray.length - 1];
    const lastDate = new Date(lastDateObj.date);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    const formattedDate = lastDate.toLocaleDateString('en-US', options);
    return { date: formattedDate, spotsLeft: 0 };
  }
  
  return null;
};

const ExpertDetail = () => {
  const params = useParams(); const expertId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(true);
  const [expertData, setExpertData] = useState<{
    id: string;
    name: string;
    image: string;
    banner?: string;
    location: string;
    countryCode?: string;
    rating: number;
    reviews: number;
    specialties: string[];
    experience: string;
    languages: string[];
    hourlyRate?: string;
    consultationPrice: string;
    verified: boolean;
    tours?: number;
    bio?: string;
    socialLinks?: {
      instagram?: string;
      youtube?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
    };
    latestVideos?: Array<{
      id: string;
      title: string;
      thumbnail: string;
      url: string;
      views: number;
      duration: string;
    }>;
    featuredTours?: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      duration: string;
      price: string;
      rating: number;
      dates?: Array<{ date: string; spotsLeft?: number }> | string[];
      spotsLeft?: number;
    }>;
    isLive: boolean;
    audioTrack?: string;
  } | null>(null);
  const [relatedExperts, setRelatedExperts] = useState<Array<{
    id: string;
    name: string;
    image: string;
    location: string;
    rating: number;
    specialties: string[];
    verified?: boolean;
  }>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [tourFilter, setTourFilter] = useState('upcoming');
  // New states for booking flow
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Video modal states
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  // Refs for scrolling to sections
  const aboutRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchExpertData = async () => {
      setIsLoading(true);
      try {
        // Fetch expert data from API
        const response = await fetch(`/api/experts?id=${expertId}`);
        if (!response.ok) {
          throw new Error('Expert not found');
        }
        const expert = await response.json();
        
        // Transform database expert to match expected format
        const transformedExpert = {
          ...expert,
          countryCode: '', // Could be derived from location or use flag emoji
          verified: true,
          specialties: expert.expertise || [],
          reviews: expert.reviewCount || 0,
          tours: expert.featuredTours?.length || 0,
          audioTrack: null,
          isLive: false,
          consultationPrice: expert.hourlyRate || '$250',
          socialLinks: expert.socialMedia ? {
            instagram: expert.socialMedia.instagram,
            youtube: expert.socialMedia.youtube,
            twitter: expert.socialMedia.twitter,
            facebook: expert.socialMedia.facebook,
            linkedin: expert.socialMedia.linkedin,
          } : {},
          latestVideos: expert.latestVideos || [],
          featuredTours: [], // Will be fetched separately
        };
        
        setExpertData(transformedExpert);
        // Update document title for SEO
        document.title = `${expert.name} - Travel Expert | OtterTrip`;
        
        // Fetch featured tours if available
        if (expert.featuredTours && expert.featuredTours.length > 0) {
          try {
            const toursResponse = await fetch(`/api/admin/experts/${expertId}/featured-tours`);
            if (toursResponse.ok) {
              const toursData = await toursResponse.json();
              setExpertData((prev) => prev ? {
                ...prev,
                featuredTours: toursData.featuredTours.map((tour: {
                  id: string;
                  title: string;
                  overview?: string | string[];
                  heroImage: string;
                  duration: string;
                  price: string;
                  rating?: number;
                  dates?: Array<{ date: string; spotsLeft?: number }> | string[];
                  spotsLeft?: number;
                }) => ({
                  id: tour.id,
                  title: tour.title,
                  description: tour.overview ? (Array.isArray(tour.overview) ? tour.overview[0] : tour.overview) : 'Experience an amazing tour',
                  image: tour.heroImage,
                  duration: tour.duration,
                  price: tour.price,
                  rating: tour.rating || 4.5,
                  dates: tour.dates || [],
                  spotsLeft: tour.spotsLeft
                }))
              } : null);
            }
          } catch (error) {
            console.error('Error fetching featured tours:', error);
          }
        }
        
        // Fetch related experts
        const relatedResponse = await fetch('/api/experts?active=true');
        if (relatedResponse.ok) {
          const allExperts = await relatedResponse.json();
          // Get 3 random experts excluding current one
          const filtered = allExperts.filter((e: { id: string }) => e.id !== expertId);
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          setRelatedExperts(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching expert:', error);
        // Handle expert not found
        router.push('/meet-experts');
      } finally {
        setIsLoading(false);
      }
    };

    if (expertId) {
      fetchExpertData();
    }
    
    // Check if coming from edit mode and clean up URL
    const refresh = searchParams.get('refresh');
    if (refresh === 'true') {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    // Handle sticky navigation
    const handleScroll = () => {
      if (navRef.current) {
        const navPosition = navRef.current.getBoundingClientRect().top;
        setIsNavSticky(navPosition <= 0);
      }
      // Update active tab based on scroll position
      const scrollPosition = window.scrollY + 100;
      if (
        aboutRef.current &&
        scrollPosition < aboutRef.current.offsetTop + aboutRef.current.offsetHeight
      ) {
        setActiveTab('about');
      } else if (
        toursRef.current &&
        scrollPosition < toursRef.current.offsetTop + toursRef.current.offsetHeight
      ) {
        setActiveTab('tours');
      } else if (
        socialRef.current &&
        scrollPosition < socialRef.current.offsetTop + socialRef.current.offsetHeight
      ) {
        setActiveTab('social');
      } else if (contactRef.current) {
        setActiveTab('contact');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [expertId, router, searchParams]);
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    let ref = null;
    switch (sectionId) {
      case 'about':
        ref = aboutRef;
        break;
      case 'tours':
        ref = toursRef;
        break;
      case 'social':
        ref = socialRef;
        break;
      case 'contact':
        ref = contactRef;
        break;
      default:
        ref = null;
    }
    if (ref && ref.current) {
      const yOffset = -70; // Account for sticky header
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };
  const handleBackClick = () => {
    router.push('/meet-experts');
  };
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeXIcon size={18} />;
    if (volume < 33) return <VolumeIcon size={18} />;
    if (volume < 66) return <Volume1Icon size={18} />;
    return <Volume2Icon size={18} />;
  };
  // New function to handle booking button click
  const handleBookConsultation = () => {
    setIsBookingModalOpen(true);
  };

  // Function to handle video clicks
  const handleVideoClick = (video: {
    id: string;
    title?: string;
    url: string;
  }) => {
    if (!video.url) return;
    
    // Check if it's YouTube or Vimeo for modal playback
    if (video.url.includes('youtube.com') || video.url.includes('youtu.be') || video.url.includes('vimeo.com')) {
      setCurrentVideoUrl(video.url);
      setCurrentVideoTitle(video.title || 'Video');
      setIsVideoModalOpen(true);
    } 
    // For other URLs, just open in new tab
    else {
      window.open(video.url, '_blank');
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expert profile...</p>
        </div>
      </div>
    );
  }
  if (!expertData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-5xl mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expert Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the expert you&apos;re looking for. They may have moved or the link might be
            incorrect.
          </p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Experts
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section with Cover Photo - Enhanced Profile Header */}
      <div className="relative h-[450px] md:h-[500px]">
        <Image
          src={expertData?.banner || getRandomDefaultCover(expertId as string)}
          alt={`${expertData?.name || 'Expert'}&apos;s banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        {/* Breadcrumb */}
        <div className="absolute top-4 left-0 w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-white">
              <button
                onClick={handleBackClick}
                className="flex items-center hover:text-blue-200 transition-colors mr-2"
              >
                <ArrowLeftIcon size={16} className="mr-1" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <Link href="/" className="hover:text-blue-200">
                Home
              </Link>
              <span className="mx-2">&gt;</span>
              <Link href="/meet-experts" className="hover:text-blue-200">
                Meet Experts
              </Link>
              <span className="mx-2">&gt;</span>
              <span>{expertData?.name || 'Expert'}</span>
            </div>
          </div>
        </div>
        {/* Audio controls */}
        {expertData?.audioTrack && (
          <div className="absolute bottom-4 right-4 flex items-center bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-white">
            <button
              onClick={togglePlay}
              className="mr-2"
              aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
            >
              {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            </button>
            <button onClick={toggleMute} className="mr-2" aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {getVolumeIcon()}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              aria-label="Volume control"
            />
          </div>
        )}
        {/* Expert info overlay - Enhanced Profile Header */}
        <div className="absolute bottom-0 left-0 w-full pb-16 md:pb-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white overflow-hidden mb-4 md:mb-0 md:mr-6 relative z-10 bg-white shadow-lg group cursor-pointer">
                <Image
                  src={expertData?.image || '/placeholder.jpg'}
                  alt={expertData?.name || 'Expert'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {expertData?.verified && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full">
                    <CheckCircleIcon size={16} />
                  </div>
                )}
                {expertData?.isLive && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-pulse"></div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-sm font-medium">View</div>
                </div>
              </div>
              <div className="text-center md:text-left text-white flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1 flex items-center justify-center md:justify-start">
                      {expertData?.name || 'Expert'}
                      {expertData?.verified && (
                        <CheckCircleIcon size={20} className="ml-2 text-blue-400" />
                      )}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start mb-3">
                      <MapPinIcon size={16} className="mr-1" />
                      <span>{expertData?.location || ''}</span>
                      <span className="ml-1">{expertData?.countryCode || ''}</span>
                    </div>
                  </div>
                  <div className="flex mt-4 md:mt-0 space-x-3 justify-center md:justify-start">
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <MessageCircleIcon size={16} className="mr-1.5" />
                      Message
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-3 md:mt-4">
                  <div className="flex items-center">
                    <StarIcon size={16} className="text-yellow-400 fill-current mr-1.5" />
                    <span className="font-medium">{expertData?.rating || 0}</span>
                    <span className="text-white/80 ml-1"></span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBagIcon size={16} className="mr-1.5" />
                    <span>{expertData?.tours || 0} tours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky Tab Navigation */}
      <div
        ref={navRef}
        className={`${isNavSticky ? 'sticky top-0 shadow-md' : 'relative'} bg-white border-b border-gray-200 z-30 transition-shadow duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => scrollToSection('about')}
            >
              <UserIcon size={16} className="inline mr-1.5" />
              About Me
            </button>
            {expertData?.featuredTours && expertData.featuredTours.length > 0 && (
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'tours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => scrollToSection('tours')}
            >
              <ShoppingBagIcon size={16} className="inline mr-1.5" />
              Tours
            </button>
            )}
            {((expertData?.socialLinks && Object.keys(expertData.socialLinks).filter(key => expertData.socialLinks?.[key as keyof typeof expertData.socialLinks]).length > 0) || 
              (expertData?.latestVideos && expertData.latestVideos.length > 0)) && (
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'social' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => scrollToSection('social')}
            >
              <VideoIcon size={16} className="inline mr-1.5" />
              Social
            </button>
            )}
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => scrollToSection('contact')}
            >
              <MailIcon size={16} className="inline mr-1.5" />
              Contact
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <section id="about" ref={aboutRef} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {expertData?.name || 'Expert'}</h2>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">{expertData?.bio || ''}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Expertise & Specialties</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {expertData?.specialties?.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {expertData?.languages?.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        <GlobeIcon size={14} className="mr-1.5" />
                        {language}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            {/* Tours Section - Updated with Upcoming/Past Categories - Only show if there are featured tours */}
            {expertData?.featuredTours && expertData.featuredTours.length > 0 && (
            <section id="tours" ref={toursRef} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Tours</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tourFilter === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700 hover:text-gray-900'}`}
                    onClick={() => setTourFilter('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tourFilter === 'past' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700 hover:text-gray-900'}`}
                    onClick={() => setTourFilter('past')}
                  >
                    Past Tours
                  </button>
                </div>
              </div>
              {tourFilter === 'upcoming' ? (
                <div className="space-y-6">
                  {expertData?.featuredTours && expertData.featuredTours.length > 0 ? expertData.featuredTours.map((tour) => {
                    const nextAvailable = getNextAvailableDate(tour.dates);
                    return (
                    <div
                      key={tour.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/tour/${tour.id}`)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <Image
                            src={tour.image}
                            alt={tour.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {tour.duration}
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl text-gray-900">{tour.title}</h3>
                            <div className="flex items-center">
                              <StarIcon size={16} className="text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{tour.rating}</span>
                              <span className="text-xs text-gray-500 ml-1"></span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{tour.description}</p>
                          <div className="flex flex-wrap gap-4 mb-4 text-sm">
                            <div className="flex items-center text-gray-700">
                              <ClockIcon size={16} className="mr-1.5" />
                              {tour.duration}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <MapPinIcon size={16} className="mr-1.5" />
                              {expertData?.location || ''}
                            </div>
                          </div>
                          {nextAvailable ? (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <CalendarIcon size={16} className="text-blue-600 mr-1.5" />
                                <span className="text-sm font-medium text-gray-900">
                                  Next available: {nextAvailable.date}
                                </span>
                              </div>
                              {nextAvailable.spotsLeft > 0 && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                {tour.spotsLeft || nextAvailable.spotsLeft} spots left
                              </span>
                              )}
                            </div>
                          </div>
                          ) : (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="text-gray-500 mr-1.5" />
                              <span className="text-sm text-gray-600">
                                No upcoming dates scheduled
                              </span>
                            </div>
                          </div>
                          )}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-gray-900 font-bold">{tour.price}</div>
                              <div className="text-gray-500 text-xs">per person</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const params = new URLSearchParams({
                                  title: tour.title,
                                  expert: expertData?.name || 'Expert',
                                  price: tour.price
                                });
                                router.push(`/booking/${tour.id}?${params.toString()}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No upcoming tours available at this moment.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Past Tours */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push('/tour/singapore-night-safari')}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <Image
                          src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
                          alt="Singapore Night Safari"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                          Past Tour
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-900">
                            Singapore Night Safari
                          </h3>
                          <div className="flex items-center">
                            <StarIcon size={16} className="text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">4.8</span>
                            <span className="text-xs text-gray-500 ml-1">(32)</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Experience Singapore&apos;s famous Night Safari with a guided tour through the
                          nocturnal animal habitats.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                          <div className="flex items-center text-gray-700">
                            <ClockIcon size={16} className="mr-1.5" />3 hours
                          </div>
                          <div className="flex items-center text-gray-700">
                            <MapPinIcon size={16} className="mr-1.5" />
                            {expertData.location}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="text-gray-500 mr-1.5" />
                              <span className="text-sm text-gray-700">
                                Last conducted: March 10, 2023
                              </span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              12 people interested
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-900 font-bold">$140</div>
                            <div className="text-gray-500 text-xs">per person</div>
                          </div>
                          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                            Request This Tour
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push('/tour/historical-singapore-tour')}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <Image
                          src="https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
                          alt="Historical Singapore Tour"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                          Past Tour
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-900">
                            Historical Singapore Tour
                          </h3>
                          <div className="flex items-center">
                            <StarIcon size={16} className="text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">4.9</span>
                            <span className="text-xs text-gray-500 ml-1">(45)</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Discover Singapore&apos;s rich colonial history and the stories behind its
                          iconic landmarks and monuments.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4 text-sm">
                          <div className="flex items-center text-gray-700">
                            <ClockIcon size={16} className="mr-1.5" />5 hours
                          </div>
                          <div className="flex items-center text-gray-700">
                            <MapPinIcon size={16} className="mr-1.5" />
                            {expertData.location}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CalendarIcon size={16} className="text-gray-500 mr-1.5" />
                              <span className="text-sm text-gray-700">
                                Last conducted: January 22, 2023
                              </span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              8 people interested
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-900 font-bold">$110</div>
                            <div className="text-gray-500 text-xs">per person</div>
                          </div>
                          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                            Request This Tour
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            )}
            {/* Social Section - Only show if there are social links or videos */}
            {((expertData?.socialLinks && Object.keys(expertData.socialLinks).filter(key => expertData.socialLinks?.[key as keyof typeof expertData.socialLinks]).length > 0) || 
              (expertData?.latestVideos && expertData.latestVideos.length > 0)) && (
            <section id="social" ref={socialRef} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Social & Media</h2>
              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Connect with {expertData?.name || 'Expert'}</h3>
                <div className="flex flex-wrap gap-3">
                  {expertData?.socialLinks?.instagram && (
                    <a
                      href={expertData?.socialLinks?.instagram || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
                    >
                      <InstagramIcon size={18} className="mr-2" />
                      Instagram
                    </a>
                  )}
                  {expertData?.socialLinks?.youtube && (
                    <a
                      href={expertData?.socialLinks?.youtube || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      <YoutubeIcon size={18} className="mr-2" />
                      YouTube
                    </a>
                  )}
                  {expertData?.socialLinks?.twitter && (
                    <a
                      href={expertData?.socialLinks?.twitter || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg"
                    >
                      <TwitterIcon size={18} className="mr-2" />
                      Twitter
                    </a>
                  )}
                  {expertData?.socialLinks?.facebook && (
                    <a
                      href={expertData?.socialLinks?.facebook || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      <FacebookIcon size={18} className="mr-2" />
                      Facebook
                    </a>
                  )}
                  {expertData?.socialLinks?.linkedin && (
                    <a
                      href={expertData?.socialLinks?.linkedin || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg"
                    >
                      <LinkedinIcon size={18} className="mr-2" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
              {/* Latest Videos */}
              {expertData?.latestVideos && expertData.latestVideos.length > 0 && (
                <div className="mb-8">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Latest Videos</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expertData?.latestVideos && expertData.latestVideos.length > 0 ? expertData.latestVideos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleVideoClick(video)}
                      >
                        <div className="relative">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={300}
                            height={168}
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                              <PlayIcon size={24} className="text-blue-600 ml-1" />
                            </div>
                          </div>
                          {video.duration && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                              {video.duration}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 line-clamp-1">{video.title}</h4>
                          <div className="text-xs text-gray-500 mt-1">{formatViewCount(video.views || 0)} views</div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-8">No videos available</p>
                    )}
                  </div>
                </div>
              )}
            </section>
            )}
            {/* Reviews Section - Removed */}
            {false && (
              <section id="reviews" ref={reviewsRef} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="mr-4 text-center">
                        <div className="text-5xl font-bold text-gray-900">{expertData?.rating || 0}</div>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(expertData?.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {expertData?.reviews || 0} reviews
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <div className="w-24 text-sm text-gray-600">5 stars</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{
                                width: '85%',
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 w-8">85%</div>
                        </div>
                        <div className="flex items-center mb-1">
                          <div className="w-24 text-sm text-gray-600">4 stars</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{
                                width: '10%',
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 w-8">10%</div>
                        </div>
                        <div className="flex items-center mb-1">
                          <div className="w-24 text-sm text-gray-600">3 stars</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{
                                width: '3%',
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 w-8">3%</div>
                        </div>
                        <div className="flex items-center mb-1">
                          <div className="w-24 text-sm text-gray-600">2 stars</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{
                                width: '1%',
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 w-8">1%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-600">1 star</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{
                                width: '1%',
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 w-8">1%</div>
                        </div>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      Write a Review
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Recent Reviews</h3>
                      <div className="relative">
                        <select className="bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none">
                          <option>Most Recent</option>
                          <option>Highest Rated</option>
                          <option>Lowest Rated</option>
                        </select>
                        <ChevronDownIcon
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      {/* Placeholder reviews - would come from API */}
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex items-start mb-3">
                          <Image
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                            alt="John D."
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">John D.</div>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        size={14}
                                        className={
                                          i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }
                                      />
                                    ))}
                                  </div>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-sm text-gray-500">March 15, 2023</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">Singapore Food Tour</div>
                            </div>
                            <p className="text-gray-700 mt-2">
                              Sarah was an amazing guide! She took us to places we would never have
                              found on our own and shared fascinating stories about Singapore&apos;s food
                              culture. The hawker center tour was the highlight of our trip!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex items-start mb-3">
                          <Image
                            src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                            alt="Maria L."
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">Maria L.</div>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        size={14}
                                        className={
                                          i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }
                                      />
                                    ))}
                                  </div>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-sm text-gray-500">February 28, 2023</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                Cultural Neighborhoods Tour
                              </div>
                            </div>
                            <p className="text-gray-700 mt-2">
                              We had a wonderful time exploring Singapore&apos;s cultural neighborhoods
                              with Sarah. Her knowledge of the history and traditions was
                              impressive, and she was so friendly and accommodating. Highly
                              recommend!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start mb-3">
                          <Image
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                            alt="Robert T."
                            width={40}
                            height={40}
                            className="rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-gray-900">Robert T.</div>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        size={14}
                                        className={
                                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }
                                      />
                                    ))}
                                  </div>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <span className="text-sm text-gray-500">January 10, 2023</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">Singapore Food Tour</div>
                            </div>
                            <p className="text-gray-700 mt-2">
                              Great tour with lots of delicious food! Sarah is knowledgeable and
                              passionate about Singapore&apos;s cuisine. The only reason for 4 stars
                              instead of 5 is that the tour ran a bit longer than scheduled, but it
                              was because we were having such a good time!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {/* Contact Section */}
            <section id="contact" ref={contactRef} className="mb-12">
              <ExpertInquiryForm 
                expertName={expertData?.name || ''}
                expertId={expertId as string}
              />
            </section>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* NEW: Consultation Booking Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-xl text-gray-900 mb-3">Book a Consultation</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <CalendarIcon size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Expert Travel Advice</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Get personalized travel planning advice from {expertData?.name} in a private
                      1-on-1 video consultation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <CheckIcon size={18} className="text-green-500 mr-2" />
                  <span className="text-gray-700">60-minute video session</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon size={18} className="text-green-500 mr-2" />
                  <span className="text-gray-700">Personalized itinerary advice</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon size={18} className="text-green-500 mr-2" />
                  <span className="text-gray-700">Insider tips and recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon size={18} className="text-green-500 mr-2" />
                  <span className="text-gray-700">Follow-up support included</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-gray-500 text-sm">Consultation Fee</span>
                  <div className="text-2xl font-bold text-gray-900">$250</div>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 text-sm font-medium">Available</span>
                </div>
              </div>
              <button
                onClick={handleBookConsultation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <CalendarIcon size={18} className="mr-2" />
                Book Consultation
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">
                Invitation code required for booking
              </p>
            </div>
            {/* Similar Experts */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Similar Experts</h3>
              <div className="space-y-4">
                {relatedExperts.map((expert) => (
                  <div
                    key={expert.id}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/meet-experts/${expert.id}`)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <Image
                          src={expert.image}
                          alt={expert.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {expert.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white p-0.5 rounded-full">
                            <CheckCircleIcon size={10} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{expert.name}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPinIcon size={10} className="mr-0.5" />
                          <span className="truncate">{expert.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <StarIcon size={12} className="text-yellow-400 fill-current mr-0.5" />
                        <span className="text-xs font-medium">{expert.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/meet-experts"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View All Experts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Consultation Booking Modal */}
      <ConsultationBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expertName={expertData?.name || ''}
        expertImage={expertData?.image || ''}
        expertId={params.id as string}
        price={expertData?.consultationPrice || '$250'}
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={currentVideoUrl}
        title={currentVideoTitle}
      />
    </div>
  );
};
export default ExpertDetail;
