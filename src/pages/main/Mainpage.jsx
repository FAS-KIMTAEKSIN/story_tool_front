import React, { useState } from 'react'
import MobileMain from './MobileMain'
import Header from '../../components/Header'

const MainPage = () => {
    const [selectedHistoryData, setSelectedHistoryData] = useState(null)

    return (
        <div className='MainPage min-w-[340px]'>
            <div className='flex flex-col items-center w-full h-screen bg-white md:max-w-[740px] mx-auto'>
                {/* Header에 히스토리 선택 시 데이터를 업데이트하는 콜백 전달 */}
                <Header onHistorySelect={setSelectedHistoryData} />
                {/* MobileMain에 선택된 히스토리 데이터가 있으면 prop으로 전달 */}
                <MobileMain historyData={selectedHistoryData} />
            </div>
        </div>
    )
}

export default MainPage
