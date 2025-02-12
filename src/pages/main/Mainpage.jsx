import React, { useState, useEffect } from 'react'
import MobileMain from './MobileMain'
import PcMain from './PcMain'
import Header from '../../components/Header'

const MainPage = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="MainPage">
      <div className="flex flex-col items-center w-full h-screen bg-white p-4">
        <Header />
        <>{isMobile ? <MobileMain /> : <PcMain />}</>
      </div>
    </div>
  )
}

export default MainPage
