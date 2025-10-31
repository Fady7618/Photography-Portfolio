// filepath: c:\Users\Alfred\Desktop\PhotographyNext\photography\src\app\components\Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="hero bg-cover bg-center h-96" style={{ backgroundImage: 'url(/path/to/your/hero-image.jpg)' }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <h1 className="text-white text-5xl font-bold">Welcome to Our Wedding Gallery</h1>
      </div>
    </div>
  );
};

export default Hero;