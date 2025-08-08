"use client";

import { useEffect, useRef, useState } from 'react';

export default function VideoTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check video file access
    const checkVideoAccess = async () => {
      try {
        // Try to fetch video metadata
        const response = await fetch('/api/test-video');
        const data = await response.json();
        
        if (response.ok) {
          setVideoInfo(data);
          console.log('Video file info:', data);
        } else {
          setError(data.error || 'Failed to get video info');
          console.error('Error getting video info:', data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Error checking video access: ${errorMessage}`);
        console.error('Error checking video access:', err);
      }
    };

    checkVideoAccess();
  }, []);

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error('Video error:', video.error);
    setError(`Video error: ${video.error?.message || 'Unknown error'}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Video Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {videoInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Video File Information</h2>
          <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(videoInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Video Player</h2>
        <div className="aspect-w-16 aspect-h-9 w-full bg-black rounded overflow-hidden">
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={handleVideoError}
          >
            <source src="/LucyWebhero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Video source: <code className="bg-gray-100 px-1 rounded">/LucyWebhero.mp4</code>
          </p>
        </div>
      </div>
    </div>
  );
}
