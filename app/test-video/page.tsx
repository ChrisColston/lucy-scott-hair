"use client";

import { useEffect, useRef } from 'react';

export default function VideoTest() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Log video events for debugging
    const events = [
      'loadstart', 'progress', 'loadedmetadata', 'loadeddata',
      'canplay', 'canplaythrough', 'error', 'stalled', 'suspend'
    ];

    const logEvent = (event: Event) => {
      console.log(`Video ${event.type} event fired`);
      if (event.type === 'error' && video.error) {
        console.error('Video error:', video.error);
      }
    };

    events.forEach(event => {
      video.addEventListener(event, logEvent);
    });

    // Try to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error attempting to play:', error);
      });
    }

    return () => {
      events.forEach(event => {
        video.removeEventListener(event, logEvent);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Video Playback Test</h1>
      
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Test Video Player</h2>
        <div className="aspect-video w-full bg-black rounded overflow-hidden">
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            src="/LucyWebhero.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Video source: <code className="bg-gray-100 px-1 rounded">/LucyWebhero.mp4</code>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Check browser console (F12) for playback events and errors.
          </p>
        </div>
      </div>
    </div>
  );
}
