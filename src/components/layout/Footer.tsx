'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, InstagramIcon, MailIcon, ChevronRightIcon } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter */}
        <div className="bg-gray-800 rounded-xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="font-bold text-xl mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-400">
                Get the latest travel tips, destination guides, and exclusive offers delivered to
                your inbox.
              </p>
            </div>
            <div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="flex-grow px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {message && (
                  <p
                    className={`text-sm ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Company info */}
          <div>
            <div className="mb-6">
              <Image
                src="/image.png"
                alt="OtterTrip"
                width={166}
                height={48}
                className="h-10 object-contain object-left"
                priority={true}
              />
            </div>
            <p className="text-gray-400 mb-6">
              Pick the pro
              <br />
              Connecting travelers with experts for authentic and personalized travel experiences
              around the world.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61577746934785#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FacebookIcon size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61577746934785#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@otter_trip"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRightIcon size={16} className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
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
              <li className="flex items-center">
                <MailIcon size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">hi@ottertrip.com</span>
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
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
