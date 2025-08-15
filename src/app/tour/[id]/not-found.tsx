import Link from 'next/link';
import { MapPinIcon, ArrowLeftIcon } from 'lucide-react';

export default function TourNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <MapPinIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tour Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the tour you're looking for. It may have been removed or the link might be incorrect.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/explore/adventure"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Explore Adventure Tours
          </Link>
          
          <Link
            href="/explore/cultural"
            className="block w-full bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Browse Cultural Tours
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center text-gray-600 hover:text-gray-900 font-medium mt-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}