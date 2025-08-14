'use client'

import React from 'react';
import { CheckCircleIcon, AwardIcon, ShieldIcon } from 'lucide-react';
type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  icon: 'award' | 'shield' | 'check';
  verified: boolean;
};
type GuideCertificationsProps = {
  certifications: Certification[];
  className?: string;
};
const GuideCertifications = ({ certifications, className = '' }: GuideCertificationsProps) => {
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'award':
        return <AwardIcon size={20} className="text-blue-600" />;
      case 'shield':
        return <ShieldIcon size={20} className="text-green-600" />;
      default:
        return <CheckCircleIcon size={20} className="text-blue-600" />;
    }
  };
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h3 className="font-bold text-lg text-gray-900 mb-4">Certifications & Qualifications</h3>
      {certifications.length > 0 ? (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-start">
              <div className="mr-3 mt-0.5">{renderIcon(cert.icon)}</div>
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-900">{cert.name}</h4>
                  {cert.verified && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {cert.issuer} · {cert.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No certifications listed yet.</p>
      )}
    </div>
  );
};
export default GuideCertifications;
