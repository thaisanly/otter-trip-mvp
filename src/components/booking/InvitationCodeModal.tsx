'use client'

import React, { useEffect, useState, useRef } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
  HelpCircleIcon,
} from 'lucide-react';
import Modal from '../ui/Modal';
interface InvitationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidCode: (code: string) => void;
}
const InvitationCodeModal: React.FC<InvitationCodeModalProps> = ({
  isOpen,
  onClose,
  onValidCode,
}) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [validationState, setValidationState] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'format-error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Auto-focus input field when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInvitationCode('');
      setValidationState('idle');
      setErrorMessage('');
    }
  }, [isOpen]);
  const validateCode = () => {
    // Basic format validation
    if (invitationCode.trim() === '') {
      setValidationState('format-error');
      setErrorMessage('Please enter an invitation code');
      return;
    }
    // Check format (example: OT-XXXX-XXXX)
    const codePattern = /^OT-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!codePattern.test(invitationCode)) {
      setValidationState('format-error');
      setErrorMessage('Invalid code format. Expected: OT-XXXX-XXXX');
      return;
    }
    // Simulate API validation
    setValidationState('loading');
    setTimeout(() => {
      // For demo purposes, accept specific codes as valid
      if (invitationCode === 'OT-1234-ABCD' || invitationCode === 'OT-TEST-CODE') {
        setValidationState('success');
        // Wait a moment to show success state before proceeding
        setTimeout(() => {
          onValidCode(invitationCode);
        }, 800);
      } else {
        setValidationState('error');
        setErrorMessage('Invalid invitation code. Please check and try again.');
      }
    }, 1500);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInvitationCode(value);
    // Reset validation state when typing
    if (validationState !== 'idle' && validationState !== 'loading') {
      setValidationState('idle');
      setErrorMessage('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && validationState !== 'loading') {
      validateCode();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter Invitation Code">
      <div className="space-y-5">
        <p className="text-gray-600">
          Please enter your invitation code to book a consultation with this expert.
        </p>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={invitationCode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g., OT-1234-ABCD"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${validationState === 'success' ? 'border-green-500 focus:ring-green-200' : validationState === 'error' || validationState === 'format-error' ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
            disabled={validationState === 'loading' || validationState === 'success'}
          />
          {/* Status icons */}
          {validationState === 'success' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              <CheckCircleIcon size={20} />
            </div>
          )}
          {(validationState === 'error' || validationState === 'format-error') && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <XCircleIcon size={20} />
            </div>
          )}
          {validationState === 'loading' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
              <LoaderIcon size={20} className="animate-spin" />
            </div>
          )}
        </div>
        {/* Validation messages */}
        {(validationState === 'error' || validationState === 'format-error') && (
          <div className="text-red-500 text-sm flex items-start">
            <AlertCircleIcon size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {validationState === 'success' && (
          <div className="text-green-500 text-sm flex items-center">
            <CheckCircleIcon size={16} className="mr-1" />
            <span>Valid code! Proceeding to booking...</span>
          </div>
        )}
        {validationState === 'idle' && (
          <div className="text-gray-500 text-sm flex items-start">
            <HelpCircleIcon size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>
              Your invitation code can be found in your email invitation or from your travel agent.
            </span>
          </div>
        )}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Need an invitation code?</strong>
            <p className="mt-1">
              Contact your travel agent or email{' '}
              <a href="mailto:support@ottertrip.com" className="text-blue-600 hover:underline">
                support@ottertrip.com
              </a>{' '}
              to request access to our consultation services.
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={validateCode}
            disabled={validationState === 'loading' || validationState === 'success'}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-colors ${validationState === 'loading' || validationState === 'success' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {validationState === 'loading' ? (
              <span className="flex items-center">
                <LoaderIcon size={16} className="animate-spin mr-2" />
                Verifying...
              </span>
            ) : validationState === 'success' ? (
              <span className="flex items-center">
                <CheckCircleIcon size={16} className="mr-2" />
                Verified
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default InvitationCodeModal;
