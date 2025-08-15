'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getEmbedUrl = (url: string): string => {
    // If URL is already an embed URL, add autoplay parameter if not present
    if (url.includes('/embed/')) {
      if (url.includes('youtube.com/embed/')) {
        // Add autoplay if not already present
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}autoplay=1&rel=0&modestbranding=1`;
      }
      if (url.includes('player.vimeo.com/video/')) {
        // Add autoplay if not already present
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
      }
      return url; // Return as-is if it's already an embed URL
    }
    
    // Convert regular YouTube URLs to embed format
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
    }
    
    // Convert regular Vimeo URLs to embed format
    if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1].split(/[?&]/)[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
      }
    }
    
    return url;
  };

  const isEmbeddable = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 hover:bg-black/50 rounded-full transition-colors"
          aria-label="Close video"
        >
          <X size={24} />
        </button>
        
        {/* Video Content */}
        <div className="relative">
          {isEmbeddable(videoUrl) ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getEmbedUrl(videoUrl)}
                title="Video"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => {
                  console.log('Video failed to load, might be restricted for embedding');
                }}
              />
              {/* Fallback message for when video is restricted */}
              <div className="absolute inset-0 bg-gray-900 text-white flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-sm text-center px-4">
                  If video doesn't load, it may be restricted for embedding.
                </p>
                <a
                  href={videoUrl.replace('/embed/', '/watch?v=').replace('player.vimeo.com/video/', 'vimeo.com/')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors pointer-events-auto"
                >
                  Watch on YouTube/Vimeo
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white">
              <p className="text-gray-600 mb-4">
                This video cannot be embedded. Click below to open in a new tab.
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Video
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}