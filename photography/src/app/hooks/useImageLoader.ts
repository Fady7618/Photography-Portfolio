import { useEffect, useState } from "react";
import imageService from "../lib/imageService";

const useImageLoader = (currentPage) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const data = await imageService.fetchImages(currentPage);
        setImages(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentPage]);

  return { images, loading, error };
};

export default useImageLoader;