import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  MessageCircleIcon,
  UserIcon,
  HeartIcon,
  SettingsIcon,
  LogOutIcon,
  CreditCardIcon,
  GlobeIcon,
} from 'lucide-react';
import Rating from '../components/ui/Rating';
// Mock user data
const user = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  upcomingTrips: [
    {
      id: 'trip1',
      title: 'Hidden Waterfalls & Rice Terraces',
      location: 'Bali, Indonesia',
      dates: 'Jun 15-17, 2023',
      image:
        'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      guideName: 'Sarah Johnson',
      guideImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
    },
  ],
  pastTrips: [
    {
      id: 'past1',
      title: 'City Food Tour & Cooking Class',
      location: 'Mexico City, Mexico',
      dates: 'Mar 5-7, 2023',
      image:
        'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      guideName: 'Miguel Santos',
      guideImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      rating: 4.8,
    },
    {
      id: 'past2',
      title: 'Historical Walking Tour',
      location: 'Kyoto, Japan',
      dates: 'Nov 12-14, 2022',
      image:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      guideName: 'Liam Chen',
      guideImage:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      rating: 4.9,
    },
  ],
  savedGuides: [
    {
      id: '3',
      name: 'Aisha Patel',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      location: 'Marrakech, Morocco',
      specialties: ['Culture', 'Shopping', 'Food'],
    },
    {
      id: '4',
      name: 'James Wilson',
      image:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      location: 'Cape Town, South Africa',
      specialties: ['Wildlife', 'Adventure', 'Photography'],
    },
  ],
  messages: [
    {
      id: 'msg1',
      from: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      preview:
        'Hi Alex! Looking forward to showing you the hidden waterfalls next week. Do you have any questions before the trip?',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 'msg2',
      from: 'Miguel Santos',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
      preview:
        "Thanks for the great review! I, m, glad, you, enjoyed, the, food, tour, : .Let, me, know, when, you, 're back in Mexico City!",
      time: '2 days ago',
      unread: false,
    },
  ],
};
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('trips');
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{user.name}</h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === 'trips' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('trips')}
                >
                  <CalendarIcon size={18} className="mr-3" />
                  My Trips
                </button>
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === 'messages' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageCircleIcon size={18} className="mr-3" />
                  Messages
                  {user.messages.some((m) => m.unread) && (
                    <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {user.messages.filter((m) => m.unread).length}
                    </span>
                  )}
                </button>
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === 'saved' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('saved')}
                >
                  <HeartIcon size={18} className="mr-3" />
                  Saved Guides
                </button>
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <UserIcon size={18} className="mr-3" />
                  Profile
                </button>
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <SettingsIcon size={18} className="mr-3" />
                  Settings
                </button>
              </nav>
              <div className="pt-4 mt-6 border-t border-gray-200">
                <button className="w-full flex items-center px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                  <LogOutIcon size={18} className="mr-3" />
                  Log Out
                </button>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-medium text-gray-900 mb-3">Become a Tour Leader</h3>
              <p className="text-gray-600 text-sm mb-4">
                Share your local expertise and earn money by leading tours in your area.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Learn More
              </button>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Trips Tab */}
            {activeTab === 'trips' && (
              <div>
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h2>
                  {user.upcomingTrips.length > 0 ? (
                    <div className="space-y-6">
                      {user.upcomingTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <div className="md:w-1/3 h-48 md:h-auto">
                            <img
                              src={trip.image}
                              alt={trip.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-xl text-gray-900 mb-1">
                                  {trip.title}
                                </h3>
                                <div className="text-gray-600">{trip.location}</div>
                              </div>
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Upcoming
                              </div>
                            </div>
                            <div className="flex items-center mb-4">
                              <CalendarIcon size={16} className="text-gray-600 mr-2" />
                              <span className="text-gray-600">{trip.dates}</span>
                            </div>
                            <div className="flex items-center mb-6">
                              <img
                                src={trip.guideImage}
                                alt={trip.guideName}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <span className="text-gray-700">Guide: {trip.guideName}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                                Trip Details
                              </button>
                              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg text-sm">
                                Message Guide
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon size={24} className="text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">No upcoming trips</h3>
                      <p className="text-gray-600 mb-6">Time to plan your next adventure!</p>
                      <Link
                        to="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                      >
                        Explore Destinations
                      </Link>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Trips</h2>
                  {user.pastTrips.length > 0 ? (
                    <div className="space-y-6">
                      {user.pastTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <div className="md:w-1/3 h-48 md:h-auto">
                            <img
                              src={trip.image}
                              alt={trip.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-xl text-gray-900 mb-1">
                                  {trip.title}
                                </h3>
                                <div className="text-gray-600">{trip.location}</div>
                              </div>
                              <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                Completed
                              </div>
                            </div>
                            <div className="flex items-center mb-3">
                              <CalendarIcon size={16} className="text-gray-600 mr-2" />
                              <span className="text-gray-600">{trip.dates}</span>
                            </div>
                            <div className="flex items-center mb-4">
                              <img
                                src={trip.guideImage}
                                alt={trip.guideName}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <span className="text-gray-700">Guide: {trip.guideName}</span>
                            </div>
                            <div className="mb-6">
                              <div className="text-sm text-gray-600 mb-1">Your Rating:</div>
                              <Rating value={trip.rating} showCount={false} />
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-50">
                                View Trip
                              </button>
                              <button className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-50">
                                Edit Review
                              </button>
                              <button className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-50">
                                Book Again
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You haven't completed any trips yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {user.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start">
                        <img
                          src={message.avatar}
                          alt={message.from}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {message.from}
                              {message.unread && (
                                <span className="ml-2 bg-blue-600 w-2 h-2 rounded-full inline-block"></span>
                              )}
                            </h3>
                            <span className="text-sm text-gray-500">{message.time}</span>
                          </div>
                          <p className="text-gray-600 truncate">{message.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Saved Guides Tab */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Tour Leaders</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.savedGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start mb-4">
                          <img
                            src={guide.image}
                            alt={guide.name}
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{guide.name}</h3>
                            <div className="text-gray-600 text-sm mb-2">{guide.location}</div>
                            <div className="flex flex-wrap gap-1">
                              {guide.specialties.map((specialty, index) => (
                                <span
                                  key={`${guide.id}-specialty-${index}`}
                                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/tour-leader/${guide.id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm text-center"
                          >
                            View Profile
                          </Link>
                          <button className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-50">
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mr-6"
                    />
                    <div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                        Change Photo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alex"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Morgan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="font-medium text-lg text-gray-900 mb-4">Travel Preferences</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Languages
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Japanese</option>
                      <option>Mandarin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Adventure
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Photography
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Food
                      </span>
                      <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50">
                        + Add More
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Password</h3>
                      <button className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-50">
                        Change Password
                      </button>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>Email notifications for new messages</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>Trip reminders and updates</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>Promotional offers and newsletters</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCardIcon size={24} className="text-gray-700 mr-3" />
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-gray-500">Expires 05/2025</div>
                      </div>
                    </div>
                    <div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    + Add payment method
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Language</h3>
                      <div className="flex items-center">
                        <GlobeIcon size={20} className="text-gray-600 mr-3" />
                        <select className="border border-gray-300 rounded-lg px-4 py-2">
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                          <option>Japanese</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-3">Currency</h3>
                      <select className="border border-gray-300 rounded-lg px-4 py-2">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                        <option>CAD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
