'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser } from '@/utils/auth';

export default function VerifyPrompt() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user && !user.id_uploaded) {
      setShouldShow(true);
    }
  }, []);

  const handleUpload = () => {
    const user = getCurrentUser();
    if (user) {
      const updated = { ...user, id_uploaded: true };
      setCurrentUser(updated);
      setShouldShow(false);
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 p-4 rounded-lg shadow mb-6">
      <p className="font-medium">Boost your trust score by uploading a verified ID card.</p>
      <button
        onClick={handleUpload}
        className="mt-2 inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
      >
        Upload ID Now
      </button>
    </div>
  );
}
