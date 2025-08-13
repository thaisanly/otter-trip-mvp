import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, MapPinIcon, PhoneIcon, MailIcon, ChevronRightIcon } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter */}
        <div className="bg-gray-800 rounded-xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="font-bold text-xl mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400">
                Get the latest travel tips, destination guides, and exclusive
                offers delivered to your inbox.
              </p>
            </div>
            <div>
              <div className="flex">
                <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none" />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Company info */}
          <div>
            <div className="mb-6">
              <img src="/image.png" alt="OtterTrip" className="h-10" />
            </div>
            <p className="text-gray-400 mb-6">
              Connecting travelers with expert local guides for authentic and
              personalized travel experiences around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRightIcon size={16} className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRightIcon size={16} className="mr-2" />
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPinIcon size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Travel Street, Kuala Lumpur, Malaysia
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+60 3 1234 5678</span>
              </li>
              <li className="flex items-center">
                <MailIcon size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">hello@ottertrip.com</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} OtterTrip. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;