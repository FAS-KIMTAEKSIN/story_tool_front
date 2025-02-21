import React, { useState, useEffect } from 'react'
import MobileMain from './MobileMain'
import PcMain from './PcMain'
import Header from '../../components/Header'

const MainPage = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [selectedHistoryData, setSelectedHistoryData] = useState(null)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className='MainPage'>
            <div className='flex flex-col items-center w-full h-screen bg-white '>
                {/* Header에 히스토리 선택 시 데이터를 업데이트하는 콜백 전달 */}
                <Header onHistorySelect={setSelectedHistoryData} />
                {/* MobileMain에 선택된 히스토리 데이터가 있으면 prop으로 전달 */}
                <MobileMain historyData={selectedHistoryData} />
            </div>
        </div>
    )
}

export default MainPage
