import React from 'react';

const ImageSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center justify-center">
      <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
      <div className="bg-gray-300 h-6 w-3/4 rounded-md"></div>
    </div>
  );
};

export default ImageSkeleton;