import React, { useState, useEffect, useRef, useCallback } from 'react'
import { LiaEdit } from 'react-icons/lia'
import ResponseRecommendations from './ResponseRecommendations'
import ChatOptions from './../chatOptions/ChatOptions'
import ResponseSimilarStory from '../response/ResponseSimilarStory'
import useRetrieveClassicLiteratureStore from '../../store/useRetrieveClassicLiteratureStore'
import GenerateChatLoadingIndicator from '../chatOptions/GenerateChatLoadingIndicator'
import { useTheme } from '../../contexts/ThemeContext'
import LoadingMessage from '../loading/LoadingMessage'

const RetrieveClassicalLiterature = ({
    messageList,
    handleEditMessage,
    similarClassicalArray,
    recommandStoryArray,
    requestNewRecommandStory,
    updateSelectedSimilarStory,
    isLoading,
    isLoadingSimilar,
}) => {
    const { isDarkMode } = useTheme()
    const isGenerating = useRetrieveClassicLiteratureStore.getState().isGenerating //isLoading
    const messageListRef = useRef(null)
    const [lastAiMessageId, setLastAiMessageId] = useState(null)

    const isLastMessage = useCallback(
        (type, index) => {
            if (messageList[index]?.type !== type) return false
            for (let i = index + 1; i < messageList.length; i++) {
                if (messageList[i].type === type) {
                    return false
                }
            }
            return true
        },
        [messageList],
    )

    // 마지막 AI 메시지 ID
    useEffect(() => {
        setLastAiMessageId(null)
        messageList.forEach((message) => {
            if (message.type === 'ai') {
                setLastAiMessageId(message.id)
            }
        })
    }, [messageList])

    // 여기서 메시지 목록이 변경되면 컨테이너를 최하단으로 스크롤합니다.
    useEffect(() => {
        if (messageListRef.current && !isGenerating) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        }
    }, [isGenerating])

    // useEffect 부분에 스크롤 감지 로직 추가
    useEffect(() => {
        // 스크롤 감지 및 타이머 설정
        const messageList = messageListRef.current
        let scrollTimer

        const handleScroll = () => {
            if (messageList) {
                messageList.classList.add('scrolling')

                // 이전 타이머 취소
                clearTimeout(scrollTimer)

                // 2초 후에 scrolling 클래스 제거
                scrollTimer = setTimeout(() => {
                    messageList.classList.remove('scrolling')
                }, 2000) // 2초 동안 스크롤이 없으면 스크롤바 숨김
            }
        }

        if (messageList) {
            messageList.addEventListener('scroll', handleScroll)

            // 초기에는 스크롤바 숨기기
            messageList.classList.remove('scrolling')
        }

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            if (messageList) {
                messageList.removeEventListener('scroll', handleScroll)
                clearTimeout(scrollTimer)
            }
        }
    }, [])

    const renderTags = useCallback((tags) => {
        if (!tags || Object.keys(tags).length === 0) return null
        return (
            <div className='text-xs text-gray-500 mt-1 italic'>
                {Object.entries(tags).map(([key, items]) =>
                    items.map((item, index) => (
                        <span key={`${key}-${item}-${index}`} className='mr-1'>
                            #{item}
                        </span>
                    )),
                )}
            </div>
        )
    }, [])

    return (
        <div className='fixed top-16 bottom-44 w-full max-w-[740px] mx-auto p-4'>
            <div
                className={`message-list space-y-4 overflow-y-auto h-full w-full custom-scrollbar`}
                ref={messageListRef}
                style={{ scrollBehavior: 'smooth' }}
            >
                {messageList.map((message, index) => (
                    <div className='flex-col w-full text-sm rounded' key={`${message.id}-${index}`}>
                        <div
                            className={`flex items-start rounded-lg py-2 px-3 break-words w-fit max-w-[90%] ${
                                message.type === 'user'
                                    ? 'ml-auto'
                                    : isDarkMode
                                    ? 'text-gray-200 border-gray-200'
                                    : 'bg-gray-100'
                            } ${
                                isDarkMode && message.type !== 'user'
                                    ? 'border border-gray-200'
                                    : ''
                            }`}
                        >
                            {message.type === 'user' ? (
                                isLastMessage('user', index) ? (
                                    <div className='flex justify-end w-full items-center'>
                                        <div className='flex items-center justify-center pr-2 h-full'>
                                            <button
                                                className={`p-1 ${
                                                    isDarkMode
                                                        ? 'text-gray-300 hover:text-gray-100'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                } focus:outline-none`}
                                                onClick={() =>
                                                    handleEditMessage(message.id, message.text)
                                                }
                                                aria-label='Edit Message'
                                            >
                                                <LiaEdit className='h-4 w-4' />
                                            </button>
                                        </div>
                                        <div
                                            className={`${
                                                isDarkMode
                                                    ? 'text-gray-200 border border-gray-200'
                                                    : 'bg-blue-50 text-gray-800'
                                            } rounded-lg py-2 px-3 break-words`}
                                        >
                                            <p>{message.text}</p>
                                            {renderTags(message.tags)}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`${
                                            isDarkMode
                                                ? 'text-gray-200 border border-gray-200'
                                                : 'bg-blue-50 text-gray-800'
                                        } rounded-lg py-2 px-3 break-words ml-auto`}
                                    >
                                        <p>{message.text}</p>
                                    </div>
                                )
                            ) : (
                                <>
                                    <div className='flex-col'>
                                        <h3 className='mb-1'>
                                            <strong
                                                className={`text-normal ${
                                                    isDarkMode ? 'text-gray-200' : ''
                                                }`}
                                            >
                                                {message.title}
                                            </strong>
                                        </h3>
                                        <p
                                            className={`text-sm mb-2 whitespace-pre-line ${
                                                isDarkMode ? 'text-gray-200' : ''
                                            }`}
                                        >
                                            {message.text}
                                        </p>
                                        {renderTags(message.tags)}
                                        <ChatOptions
                                            message={message}
                                            isLastAiMessage={isLastMessage('ai', index)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {message.type === 'ai' && (
                            <div className='transition-opacity duration-300 ease-in-out mt-4'>
                                {/* 유사한 고전 원문 영역 */}
                                {similarClassicalArray.length > 0 &&
                                similarClassicalArray[index]?.type === 'ai' ? (
                                    <ResponseSimilarStory
                                        similarClassicalArray={similarClassicalArray[index]}
                                        updateSelectedSimilarStory={updateSelectedSimilarStory}
                                    />
                                ) : (
                                    // 마지막 AI 메시지인데 유사 콘텐츠 로딩 중인 경우 로딩 인디케이터 표시
                                    isLoadingSimilar &&
                                    lastAiMessageId === message.id && (
                                        <div className='mt-2 pl-2'>
                                            <div className='w-full'>
                                                <h3 className='mb-1 flex items-center'>
                                                    <span className='mr-2'>📖</span>
                                                    <strong className='text-normal'>
                                                        유사한 고전 원문
                                                    </strong>
                                                </h3>
                                            </div>
                                            <GenerateChatLoadingIndicator />
                                        </div>
                                    )
                                )}

                                {/* 추천 영역 */}
                                {!isGenerating && lastAiMessageId === message.id && (
                                    <ResponseRecommendations
                                        recommandStoryArray={recommandStoryArray ?? []}
                                        requestNewRecommandStory={requestNewRecommandStory}
                                        isLoading={isLoading}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* 로딩 인디케이터 추가 - 마지막 메시지가 사용자 메시지이고 isGenerating이 true일 때 표시 */}
                {messageList.length > 0 &&
                    messageList[messageList.length - 1].type === 'user' &&
                    isGenerating && <LoadingMessage />}
                {/* 기존에 사용하던 indicator 안 보이게 처리 */}
                {/* isGenerating && <GenerateChatLoadingIndicator />} */}
            </div>
        </div>
    )
}

export default RetrieveClassicalLiterature
