'use client'

import { useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';

interface TikTokVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

const TikTokVideoModal = ({ isOpen, onClose, videoUrl, title }: TikTokVideoModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Load TikTok embed script when modal opens
    if (isOpen && videoUrl.includes('tiktok.com')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Clean up script when modal closes
        const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Extract TikTok video ID from URL
  const getTikTokVideoId = (url: string): string | null => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  // Get embed URL based on platform
  const getEmbedUrl = (url: string): string => {
    // TikTok
    if (url.includes('tiktok.com')) {
      const videoId = getTikTokVideoId(url);
      if (videoId) {
        // Return TikTok URL for blockquote embed
        return url;
      }
    }
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed')) {
        videoId = url.split('embed/')[1]?.split('?')[0] || '';
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0] || '';
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    
    // Instagram
    if (url.includes('instagram.com')) {
      return url;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isTikTok = videoUrl.includes('tiktok.com');
  const isInstagram = videoUrl.includes('instagram.com');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative bg-black rounded-lg overflow-hidden ${
          isTikTok ? 'max-w-[520px] w-full max-h-[95vh]' : 'max-w-4xl w-full max-h-[90vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-white text-lg font-medium pr-8">
              {title || 'Video'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
              aria-label="Close video"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Video Content */}
        <div className={`relative bg-black flex items-center justify-center ${
          isTikTok ? 'min-h-[85vh]' : ''
        }`}>
          {isTikTok ? (
            // TikTok embed using blockquote - optimized for vertical format
            <div className="w-full h-full flex items-center justify-center py-16">
              <blockquote 
                className="tiktok-embed" 
                cite={videoUrl}
                data-video-id={getTikTokVideoId(videoUrl) || ''}
                style={{ 
                  maxWidth: '440px', 
                  minWidth: '420px',
                  width: '100%',
                  margin: '0 auto'
                }}
              >
                <section>
                  <a target="_blank" rel="noopener noreferrer" href={videoUrl}>
                    Watch on TikTok
                  </a>
                </section>
              </blockquote>
            </div>
          ) : isInstagram ? (
            // Instagram embed using blockquote
            <div className="w-full max-w-[540px] mx-auto py-16">
              <blockquote 
                className="instagram-media" 
                data-instgrm-captioned
                data-instgrm-permalink={videoUrl}
                data-instgrm-version="14"
                style={{ 
                  background: '#FFF',
                  border: '0',
                  borderRadius: '3px',
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                  margin: '1px',
                  maxWidth: '540px',
                  minWidth: '326px',
                  padding: '0',
                  width: '99.375%'
                }}
              >
                <div style={{ padding: '16px' }}>
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    View this post on Instagram
                  </a>
                </div>
              </blockquote>
              <script async src="//www.instagram.com/embed.js"></script>
            </div>
          ) : (
            // YouTube/Vimeo iframe embed
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={title || 'Video'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TikTokVideoModal;