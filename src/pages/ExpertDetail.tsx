import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
import InvitationCodeModal from '../components/booking/InvitationCodeModal';
import ConsultationBookingModal from '../components/booking/ConsultationBookingModal';
import { expertsData, getRelatedExperts } from '../mock/experts';
const ExpertDetail = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(true);
  const [expertData, setExpertData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [tourFilter, setTourFilter] = useState('upcoming');
  // New states for booking flow
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Refs for scrolling to sections
  const aboutRef = useRef(null);
  const toursRef = useRef(null);
  const socialRef = useRef(null);
  const reviewsRef = useRef(null);
  const contactRef = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      const expert = expertsData[expertId];
      if (expert) {
        setExpertData(expert);
        // Update document title for SEO
        document.title = `${expert.name} - Travel Expert | OtterTrip`;
      } else {
        // Handle expert not found
        navigate('/meet-experts', {
          replace: true,
        });
      }
      setIsLoading(false);
    }, 800);
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
  }, [expertId, navigate]);
  const scrollToSection = (sectionId) => {
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
    navigate('/meet-experts');
  };
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    if (parseInt(e.target.value) === 0) {
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
    setIsInvitationModalOpen(true);
  };
  // Function to handle valid invitation code
  const handleValidInvitationCode = () => {
    // Close the invitation modal
    setIsInvitationModalOpen(false);
    // Open the booking modal after a short delay
    setTimeout(() => {
      setIsBookingModalOpen(true);
    }, 500);
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
            We couldn't find the expert you're looking for. They may have moved or the link might be
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
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={expertData.coverImage}
          alt={`${expertData.name}'s cover`}
          className="w-full h-full object-cover"
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
              <Link to="/" className="hover:text-blue-200">
                Home
              </Link>
              <span className="mx-2">&gt;</span>
              <Link to="/meet-experts" className="hover:text-blue-200">
                Meet Experts
              </Link>
              <span className="mx-2">&gt;</span>
              <span>{expertData.name}</span>
            </div>
          </div>
        </div>
        {/* Audio controls */}
        {expertData.audioTrack && (
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
        <div className="absolute bottom-0 left-0 w-full pb-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white overflow-hidden -mt-16 md:mt-0 mb-4 md:mb-0 md:mr-6 relative z-10 bg-white shadow-lg group cursor-pointer">
                <img
                  src={expertData.image}
                  alt={expertData.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {expertData.verified && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full">
                    <CheckCircleIcon size={16} />
                  </div>
                )}
                {expertData.isLive && (
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
                      {expertData.name}
                      {expertData.verified && (
                        <CheckCircleIcon size={20} className="ml-2 text-blue-400" />
                      )}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start mb-3">
                      <MapPinIcon size={16} className="mr-1" />
                      <span>{expertData.location}</span>
                      <span className="ml-1">{expertData.countryCode}</span>
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
                    <span className="font-medium">{expertData.rating}</span>
                    <span className="text-white/80 ml-1"></span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBagIcon size={16} className="mr-1.5" />
                    <span>{expertData.tours} tours</span>
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
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'tours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => scrollToSection('tours')}
            >
              <ShoppingBagIcon size={16} className="inline mr-1.5" />
              Tours
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'social' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => scrollToSection('social')}
            >
              <VideoIcon size={16} className="inline mr-1.5" />
              Social
            </button>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {expertData.name}</h2>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">{expertData.bio}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Expertise & Specialties</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {expertData.specialties.map((specialty, index) => (
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
                    {expertData.languages.map((language, index) => (
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
            {/* Tours Section - Updated with Upcoming/Past Categories */}
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
                  {expertData.featuredTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-full h-full object-cover"
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
                              {expertData.location}
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <CalendarIcon size={16} className="text-blue-600 mr-1.5" />
                                <span className="text-sm font-medium text-gray-900">
                                  Next available: May 15, 2023
                                </span>
                              </div>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                5 spots left
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-gray-900 font-bold">{tour.price}</div>
                              <div className="text-gray-500 text-xs">per person</div>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Past Tours */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img
                          src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
                          alt="Singapore Night Safari"
                          className="w-full h-full object-cover"
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
                          Experience Singapore's famous Night Safari with a guided tour through the
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
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img
                          src="https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
                          alt="Historical Singapore Tour"
                          className="w-full h-full object-cover"
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
                          Discover Singapore's rich colonial history and the stories behind its
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
            {/* Social Section */}
            <section id="social" ref={socialRef} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Social & Media</h2>
              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Connect with {expertData.name}</h3>
                <div className="flex flex-wrap gap-3">
                  {expertData.socialLinks.instagram && (
                    <a
                      href={expertData.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
                    >
                      <InstagramIcon size={18} className="mr-2" />
                      Instagram
                    </a>
                  )}
                  {expertData.socialLinks.youtube && (
                    <a
                      href={expertData.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      <YoutubeIcon size={18} className="mr-2" />
                      YouTube
                    </a>
                  )}
                  {expertData.socialLinks.twitter && (
                    <a
                      href={expertData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg"
                    >
                      <TwitterIcon size={18} className="mr-2" />
                      Twitter
                    </a>
                  )}
                  {expertData.socialLinks.facebook && (
                    <a
                      href={expertData.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      <FacebookIcon size={18} className="mr-2" />
                      Facebook
                    </a>
                  )}
                  {expertData.socialLinks.linkedin && (
                    <a
                      href={expertData.socialLinks.linkedin}
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
              {expertData.latestVideos && expertData.latestVideos.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Latest Videos</h3>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View all videos
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expertData.latestVideos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-opacity">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                              <PlayIcon size={24} className="text-blue-600 ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 line-clamp-1">{video.title}</h4>
                          <div className="text-xs text-gray-500 mt-1">{video.views} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
            {/* Reviews Section - Removed */}
            {false && (
              <section id="reviews" ref={reviewsRef} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="mr-4 text-center">
                        <div className="text-5xl font-bold text-gray-900">{expertData.rating}</div>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(expertData.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {expertData.reviews} reviews
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
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                            alt="John D."
                            className="w-10 h-10 rounded-full mr-3"
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
                              found on our own and shared fascinating stories about Singapore's food
                              culture. The hawker center tour was the highlight of our trip!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex items-start mb-3">
                          <img
                            src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                            alt="Maria L."
                            className="w-10 h-10 rounded-full mr-3"
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
                              We had a wonderful time exploring Singapore's cultural neighborhoods
                              with Sarah. Her knowledge of the history and traditions was
                              impressive, and she was so friendly and accommodating. Highly
                              recommend!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start mb-3">
                          <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                            alt="Robert T."
                            className="w-10 h-10 rounded-full mr-3"
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
                              passionate about Singapore's cuisine. The only reason for 4 stars
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact {expertData.name}</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Send an Inquiry</h3>
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="What is your inquiry about?"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Type your message here..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Send Inquiry
                    </button>
                  </form>
                </div>
              </div>
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
                {getRelatedExperts(expertId || '', 3).map((expert) => (
                  <div
                    key={expert.id}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/meet-experts/${expert.id}`)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <img
                          src={expert.image}
                          alt={expert.name}
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
                  to="/meet-experts"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View All Experts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Invitation Code Modal */}
      <InvitationCodeModal
        isOpen={isInvitationModalOpen}
        onClose={() => setIsInvitationModalOpen(false)}
        onValidCode={handleValidInvitationCode}
      />
      {/* Consultation Booking Modal */}
      <ConsultationBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expertName={expertData?.name || ''}
        expertImage={expertData?.image || ''}
        price={expertData?.consultationPrice || '$250'}
      />
    </div>
  );
};
export default ExpertDetail;
