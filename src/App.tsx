import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import TourLeaderProfile from './pages/TourLeaderProfile';
import BookingFlow from './pages/BookingFlow';
import Dashboard from './pages/Dashboard';
import OtterSelects from './pages/OtterSelects';
import TourDetail from './pages/TourDetail';
import Explore from './pages/Explore';
import MeetExperts from './pages/MeetExperts';
import ExpertDetail from './pages/ExpertDetail';
export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/tour-leader/:id" element={<TourLeaderProfile />} />
              <Route path="/booking/:id" element={<BookingFlow />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/otter-selects" element={<OtterSelects />} />
              <Route path="/tour/:id" element={<TourDetail />} />
              <Route path="/explore/:category" element={<Explore />} />
              <Route path="/meet-experts" element={<MeetExperts />} />
              <Route path="/meet-experts/:expertId" element={<ExpertDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
