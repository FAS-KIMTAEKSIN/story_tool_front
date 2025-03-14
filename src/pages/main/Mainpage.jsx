import React, { useState } from 'react'
import MobileMain from './MobileMain'
import Header from '../../components/Header'
import { useTheme } from '../../contexts/ThemeContext'

const MainPage = () => {
    const [selectedHistoryData, setSelectedHistoryData] = useState(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { isDarkMode } = useTheme()

    return (
        <>
            <div
                className={`flex flex-col items-center w-full h-screen md:max-w-[740px] mx-auto ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}
            >
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
