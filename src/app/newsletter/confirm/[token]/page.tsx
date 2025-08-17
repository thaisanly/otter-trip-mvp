'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function NewsletterConfirmationPage() {
  const params = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!params.token) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = await fetch('/api/newsletter/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: params.token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setEmail(data.email || '');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to confirm subscription');
        }
      } catch {
        setStatus('error');
        setMessage('Failed to confirm subscription. Please try again later.');
      }
    };

    confirmSubscription();
  }, [params.token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Confirming Your Subscription
              </h2>
              <p className="text-gray-600">Please wait while we verify your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Confirmed!</h2>
              <p className="text-gray-600 mb-2">{message}</p>
              {email && (
                <p className="text-sm text-gray-500 mb-6">
                  You&apos;ll receive our newsletter at{' '}
                  <span className="font-semibold">{email}</span>
                </p>
              )}
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Homepage
                </Link>
                <Link
                  href="/explore/adventure"
                  className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Explore Tours
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmation Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Homepage
                </Link>
                <p className="text-sm text-gray-500">
                  If you continue to have issues, please contact{' '}
                  <a href="mailto:support@ottertrip.com" className="text-blue-600 hover:underline">
                    support@ottertrip.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} OtterTrip. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
