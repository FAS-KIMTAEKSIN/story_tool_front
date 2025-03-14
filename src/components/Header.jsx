import { useState } from 'react'
import MobileSideMenu from './sidemenu/MobileSideMenu'
import { BsLayoutTextSidebarReverse } from 'react-icons/bs'
import { FaRegEdit, FaMoon, FaSun } from 'react-icons/fa'
import { retrieveChatHistoryList } from '../api/history'
import { useTheme } from '../contexts/ThemeContext'

const Header = ({ onHistorySelect, isSidebarOpen, setIsSidebarOpen }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [historyList, setHistoryList] = useState([])
    const { isDarkMode, toggleTheme } = useTheme()

    // 사이드메뉴 토글
    const toggleMenu = async () => {
        if (!isMenuOpen) {
            const requestBody = {
                user_id: 1,
            }
            const data = await retrieveChatHistoryList(requestBody)

            if (data.success && Array.isArray(data.chat_history)) {
                setHistoryList(data.chat_history)
            }
        }
        setIsMenuOpen((prev) => !prev)
        setIsSidebarOpen((prev) => !prev)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
        setIsSidebarOpen(false)
    }

    // 사이드 메뉴에서 히스토리 클릭 시 상세 데이터를 받으면 상위로 전달
    const handleSelectHistory = (historyItem) => {
        if (onHistorySelect) {
            onHistorySelect(historyItem)
        }
    }

    /**
     * @description 신규 쓰레드 생성.
     */
    const createThread = () => {
        if (localStorage.getItem('content_clf') === null) {
            return
        }
        console.log('🟡 신규 쓰레드 생성 요청 시작...')
        window.location.reload()
    }

    return (
        <div className='relative w-full'>
            {isMenuOpen && (
                <div
                    className='fixed inset-0 bg-[#f5f5f5] opacity-50 z-50 md:hidden'
                    onClick={closeMenu}
                />
            )}
            <MobileSideMenu
                isOpen={isMenuOpen}
                onClose={closeMenu}
                historyList={historyList}
                onSelectHistory={handleSelectHistory}
                setHistoryList={setHistoryList}
            />
            <header
                className={`fixed top-0 left-0 w-full min-w-[340px] h-12 shadow-md px-4 py-3 z-40 flex ${
                    isDarkMode ? 'text-white' : 'bg-white text-gray-800'
                }`}
                style={isDarkMode ? { backgroundColor: '#3D3D3B' } : {}}
            >
                <div className='relative items-center justify-center w-full flex'>
                    <button
                        onClick={toggleMenu}
                        className={`absolute left-2 text-xl block hover:cursor-pointer ${
                            isDarkMode
                                ? 'hover:text-gray-300 hover:bg-gray-700'
                                : 'hover:text-gray-200 hover:bg-gray-600'
                        } p-3 rounded`}
                    >
                        <BsLayoutTextSidebarReverse />
                    </button>
                    <h1
                        className={`inline-block text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}
                        onClick={createThread}
                    >
                        고전 스토리 생성
                    </h1>

                    <button
                        className='absolute right-12 text-xl block p-3 rounded'
                        onClick={toggleTheme}
                    >
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>

                    <button className='absolute right-2 text-xl block' onClick={createThread}>
                        <FaRegEdit />
                    </button>
                </div>
            </header>
        </div>
    )
}

export default Header
