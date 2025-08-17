import Link from 'next/link';

const CallToAction = () => {
  return (
    <div className="bg-blue-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Connect with Your Perfect Guide?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Join thousands of travelers who have discovered meaningful experiences with guides who
          match their personality.
        </p>
        <Link
          href="/meet-experts"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          prefetch={true}
        >
          Start Your Journey
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;