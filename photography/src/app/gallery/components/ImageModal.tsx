import React from 'react';
import { downloadImage } from '../../../utils/downloadImage';

interface ImageModalProps {
  image: {
    id: string;
    url: string;
    title: string;
    description: string;
  };
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white rounded-lg p-4">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          &times;
        </button>
        <img src={image.url} alt={image.title} className="w-full h-auto rounded" />
        <h2 className="mt-4 text-xl font-bold">{image.title}</h2>
        <p className="mt-2 text-gray-700">{image.description}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => downloadImage(image.url, image.title)}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default ImageModal;