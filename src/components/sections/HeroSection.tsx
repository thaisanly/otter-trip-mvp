import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative bg-blue-900 text-white min-h-[500px]">
      {/* Optimized background with priority loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=60"
          alt="Travel adventure"
          className="object-cover"
          fill
          sizes="100vw"
          priority
          quality={60}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/50"></div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Pick the Pro for Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with experts who will transform your travel experience
          </p>
          <Link
            href="/meet-experts"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            prefetch={true}
          >
            Meet the Experts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
