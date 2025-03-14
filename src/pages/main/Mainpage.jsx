import React, { useState } from 'react'
import MobileMain from './MobileMain'
import Header from '../../components/Header'

const MainPage = () => {
    const [selectedHistoryData, setSelectedHistoryData] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>
            <div className='flex flex-col items-center w-full h-screen bg-white md:max-w-[740px] mx-auto'>
                <Header
                    onHistorySelect={setSelectedHistoryData}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <MobileMain historyData={selectedHistoryData} isSidebarOpen={isSidebarOpen} />
            </div>
        </>
    )
}

export default MainPage
