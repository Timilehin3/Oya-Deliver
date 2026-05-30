import React from 'react';
import loadingVideo from '../../assets/oyadeliver-loading.webm';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-32 h-32 object-contain"
      >
        <source src={loadingVideo} type="video/webm" />
      </video>
      <p className="text-oya-teal font-medium mt-4 animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
