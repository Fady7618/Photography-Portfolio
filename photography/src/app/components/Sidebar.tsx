// filepath: c:\Users\Alfred\Desktop\PhotographyNext\photography\src\app\components\Sidebar.tsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Gallery Menu</h2>
      <ul>
        <li className="mb-2">
          <a href="/gallery" className="text-blue-600 hover:underline">Gallery</a>
        </li>
        <li className="mb-2">
          <a href="/about" className="text-blue-600 hover:underline">About</a>
        </li>
        <li className="mb-2">
          <a href="/pricing" className="text-blue-600 hover:underline">Pricing</a>
        </li>
        <li className="mb-2">
          <a href="/contact" className="text-blue-600 hover:underline">Contact</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;