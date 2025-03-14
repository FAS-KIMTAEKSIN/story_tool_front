import React, { useMemo } from 'react'
import { deleteThread } from '../../api/history'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const HistoryList = ({ historyList, onItemClick, setHistoryList, isDarkMode }) => {
    // 중복 제거 로직을 useMemo로 최적화
    const uniqueHistoryList = useMemo(() => {
        const seenThreadIds = new Set()
        return historyList.filter((chat) => {
            if (!seenThreadIds.has(chat.thread_id)) {
                seenThreadIds.add(chat.thread_id)
                return true
            }
            return false
        })
    }, [historyList])

    // 그룹화 로직을 useMemo로 최적화
    const sortedGroups = useMemo(() => {
        const today = new Date()
        const groups = {}

        // 채팅 항목 그룹화
        uniqueHistoryList.forEach((chat) => {
            const createdDate = new Date(chat.thread_created_at || chat.thread_updated_at)
            const diffDays = (today - createdDate) / (1000 * 60 * 60 * 24)

            let groupKey = getGroupKey(today, createdDate, diffDays)

            if (!groups[groupKey]) {
                groups[groupKey] = []
            }
            groups[groupKey].push(chat)
        })

        // 그룹 정렬
        return sortGroups(groups)
    }, [uniqueHistoryList])

    // toast 옵션 객체 추가
    const toastOptionObj = {
        position: 'bottom-center',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        theme: 'dark',
        closeButton: false,
    }

    // thread 삭제
    const handleDeleteThread = async (chat, e) => {
        e.stopPropagation() // 이벤트 버블링 방지

        try {
            const response = await deleteThread(chat)

            if (response.status === 200) {
                console.log('thread 삭제 성공')
                setHistoryList(historyList.filter((item) => item.thread_id !== chat.thread_id))
                toast('대화가 삭제되었습니다.', toastOptionObj)
            } else {
                console.log('thread 삭제 실패')
                toast('대화 삭제에 실패했습니다.', toastOptionObj)
            }
        } catch (error) {
            console.error('thread 삭제 중 오류 발생:', error)
            toast('대화 삭제 중 오류가 발생했습니다.', toastOptionObj)
        }
    }

    // 채팅 항목 클릭 핸들러
    const handleItemClick = (threadId) => {
        if (onItemClick) onItemClick(threadId)
    }

    if (uniqueHistoryList.length === 0) {
        return <p className='text-center text-gray-500 mt-4'>히스토리가 없습니다.</p>
    }

    return (
        <div className={`flex-1 overflow-y-auto`}>
            {sortedGroups.map((group) => (
                <div key={group.key} className='mb-4'>
                    <h3
                        className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } px-4 mb-1`}
                    >
                        {group.key}
                    </h3>
                    <ul>
                        {group.items.map((item) => (
                            <li
                                key={item.thread_id}
                                onClick={() => handleItemClick(item.thread_id)}
                                className={`px-4 py-2 cursor-pointer ${
                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                                }`}
                            >
                                <div
                                    className={`${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    } font-medium`}
                                >
                                    {item.title || '제목 없음'}
                                </div>
                                <div
                                    className={`text-xs ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    } truncate`}
                                >
                                    {item.summary || '내용 없음'}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

// 그룹 키 결정 함수
function getGroupKey(today, createdDate, diffDays) {
    if (today.toDateString() === createdDate.toDateString()) {
        return '오늘'
    } else if (diffDays < 7) {
        return '지난 7일'
    } else if (diffDays < 30) {
        return '지난 30일'
    } else if (today.getFullYear() === createdDate.getFullYear()) {
        return createdDate.getMonth() + 1 + '월'
    } else {
        return createdDate.getFullYear().toString()
    }
}

// 그룹 정렬 함수
function sortGroups(groups) {
    const sortedGroups = []
    const timeGroups = ['오늘', '지난 7일', '지난 30일']

    // 시간 기반 그룹 추가
    timeGroups.forEach((key) => {
        if (groups[key]) sortedGroups.push({ key, items: groups[key] })
    })

    // 월 기반 그룹 추가
    const monthKeys = Object.keys(groups)
        .filter((key) => key.endsWith('월'))
        .sort((a, b) => parseInt(b) - parseInt(a))

    monthKeys.forEach((key) => {
        sortedGroups.push({ key, items: groups[key] })
    })

    // 연도 기반 그룹 추가
    const yearKeys = Object.keys(groups)
        .filter((key) => /^\d{4}$/.test(key))
        .sort((a, b) => parseInt(b) - parseInt(a))

    yearKeys.forEach((key) => {
        sortedGroups.push({ key, items: groups[key] })
    })

    return sortedGroups
}

// 제목 포맷팅 함수
function formatTitle(title) {
    if (!title) return '제목 없음'
    return title.length > 13 ? title.slice(0, 13) + '...' : title
}

export default HistoryList
