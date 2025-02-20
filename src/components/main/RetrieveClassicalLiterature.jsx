import React, { useState, useEffect, useRef, useCallback } from 'react'
import { LiaEdit } from 'react-icons/lia'
import ResponseRecommendations from './ResponseRecommendations'
import ChatOptions from './../chatOptions/ChatOptions'
import ResponseSimilarStory from '../response/ResponseSimilarStory'

const RetrieveClassicalLiterature = ({
    messageList,
    handleEditMessage,
    similarClassicalArray,
    recommandStoryArray,
    requestNewRecommandStory,
    updateSelectedSimilarStory,
    isLoading,
}) => {
    const messageListRef = useRef(null)
    const [displayedTexts, setDisplayedTexts] = useState({})
    const [typingIndex, setTypingIndex] = useState({})
    const [lastAiMessageId, setLastAiMessageId] = useState(null)
    const [typingComplete, setTypingComplete] = useState({})

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

    // AI 메시지 타이핑 효과 (새 응답에 대한 애니메이션)
    useEffect(() => {
        setLastAiMessageId(null)
        messageList.forEach((message) => {
            if (message.type === 'ai') {
                setLastAiMessageId(message.id)
                if (displayedTexts[message.id] === undefined) {
                    setDisplayedTexts((prev) => ({ ...prev, [message.id]: '' }))
                    setTypingIndex((prev) => ({ ...prev, [message.id]: 0 }))
                    setTypingComplete((prev) => ({
                        ...prev,
                        [message.id]: false,
                    }))
                }
            }
        })
    }, [messageList])

    // 여기서 메시지 목록이 변경되면 컨테이너를 최하단으로 스크롤합니다.
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight
        }
    }, [messageList])

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
        <div className='fixed top-16 bottom-44 w-full mx-auto p-4'>
            <div
                className='message-list space-y-4 overflow-y-auto h-full w-full'
                ref={messageListRef}
                style={{ scrollBehavior: 'smooth' }}
            >
                {messageList.map((message, index) => (
                    <div className='flex-col w-full text-sm rounded' key={`${message.id}-${index}`}>
                        <div
                            className={`flex items-start rounded-lg py-2 px-3 break-words w-fit max-w-[90%] ${
                                message.type === 'user' ? 'ml-auto' : 'bg-gray-100'
                            }`}
                        >
                            {message.type === 'user' ? (
                                isLastMessage('user', index) ? (
                                    <div className='flex justify-end w-full items-center'>
                                        <div className='flex items-center justify-center pr-2 h-full'>
                                            <button
                                                className='p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                                                onClick={() =>
                                                    handleEditMessage(message.id, message.text)
                                                }
                                                aria-label='Edit Message'
                                            >
                                                <LiaEdit className='h-4 w-4' />
                                            </button>
                                        </div>
                                        <div className='bg-blue-50 text-gray-800 rounded-lg py-2 px-3 break-words border-b-gray-200'>
                                            <p>{message.text}</p>
                                            {renderTags(message.tags)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='bg-blue-50 text-gray-800 rounded-lg py-2 px-3 break-words border-b-gray-200 ml-auto'>
                                        <p>{message.text}</p>
                                    </div>
                                )
                            ) : (
                                <>
                                    <div className='flex-col'>
                                        <h3 className='mb-1'>
                                            <strong className='text-normal'>{message.title}</strong>
                                        </h3>
                                        <p className='text-sm mb-2 whitespace-pre-line'>
                                            {displayedTexts[message.id] || message.text}
                                        </p>
                                        {renderTags(message.tags)}
                                        {typingComplete[message.id] && (
                                            <ChatOptions
                                                message={message}
                                                isLastAiMessage={isLastMessage('ai', index)}
                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {typingComplete[message.id] && (
                            <div className='transition-opacity duration-300 ease-in-out mt-4'>
                                <ResponseSimilarStory
                                    similarClassicalArray={similarClassicalArray ?? []}
                                    updateSelectedSimilarStory={updateSelectedSimilarStory}
                                />

                                {lastAiMessageId === message.id && (
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
            </div>
        </div>
    )
}

export default RetrieveClassicalLiterature
