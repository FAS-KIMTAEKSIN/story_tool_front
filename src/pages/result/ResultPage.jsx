import React, { useState, useEffect } from 'react';
import MobileResult from './MobileResult';
import PcResult from './PcResult';

const ResultPage = () => {
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
      {isMobile ? <MobileResult /> : <PcResult />}
    </div>
  );
};

export default ResultPage;
