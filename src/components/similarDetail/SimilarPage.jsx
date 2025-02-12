import React, { useState, useEffect } from 'react';
import MobileSimilarDetail from './MobileSimilarDetail.jsx';
import PcSimilarDetail from './PcSimilarDetail.jsx';

const SimilarPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="MainPage">
      {isMobile ? <MobileSimilarDetail /> : <PcSimilarDetail />}
    </div>
  );
};

export default SimilarPage;
