import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection);
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default LazyImage;