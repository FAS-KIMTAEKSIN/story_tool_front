import React, { useState, useEffect, useRef } from 'react'
import { LiaEdit } from 'react-icons/lia'
import ResponseRecommendations from './ResponseRecommendations'
import ChatOptions from './../chatOptions/ChatOptions'

const RetrieveClassicalLiterature = ({
  messageList,
  handleEditMessage,
  similarClassicalArray,
  recommandStoryArray,
  requestNewRecommandStory,
  updateSelectedSimilarStory, //유사한 고전원문 팝업
}) => {
  const messageListRef = useRef(null)
  const [displayedTexts, setDisplayedTexts] = useState({}) // 각 AI 메시지에 대한 표시 텍스트
  const [typingIndex, setTypingIndex] = useState({}) // 각 AI 메시지에 대한 타이핑 인덱스
  const [lastAiMessageId, setLastAiMessageId] = useState(null)
  const [typingComplete, setTypingComplete] = useState({}) // 각 AI 메시지에 대한 타이핑 완료 여부
  const typingSpeed = 10 // 타이핑 속도

  // 마지막 메시지인지 확인하는 함수
  const isLastMessage = (type, index) => {
    if (messageList[index]?.type !== type) {
      return false
    }
    for (let i = index + 1; i < messageList.length; i++) {
      if (messageList[i].type === type) {
        return false
      }
    }
    return true
  }

  // AI 메시지 타이핑 효과
  useEffect(() => {
    messageList.forEach((message) => {
      if (message.type === 'ai' && !displayedTexts[message.id]) {
        // 해당 AI 메시지에 대한 타이핑 시작
        setDisplayedTexts((prev) => ({ ...prev, [message.id]: '' }))
        setTypingIndex((prev) => ({ ...prev, [message.id]: 0 }))
        setLastAiMessageId(message.id) // 마지막 AI 메시지 ID 업데이트
        setTypingComplete((prev) => ({ ...prev, [message.id]: false })) // 초기화
      }
    })
  }, [messageList, displayedTexts])

  // Typing effect
  useEffect(() => {
    const animateTyping = () => {
      Object.keys(displayedTexts).forEach((messageId) => {
        const message = messageList.find(
          (msg) => msg.id === parseInt(messageId),
        )
        if (message && typingIndex[messageId] < message.text.length) {
          setTimeout(() => {
            setDisplayedTexts((prev) => ({
              ...prev,
              [messageId]: message.text.substring(
                0,
                typingIndex[messageId] + 1,
              ),
            }))
            setTypingIndex((prev) => ({
              ...prev,
              [messageId]: prev[messageId] + 1,
            }))

            // 타이핑 중에도 스크롤 하단 유지
            if (messageListRef.current) {
              messageListRef.current.scrollTop =
                messageListRef.current.scrollHeight
            }
          }, typingSpeed)
        } else {
          // 타이핑 완료 시 typingComplete 상태 업데이트
          setTypingComplete((prev) => ({ ...prev, [messageId]: true }))
        }
      })
    }

    animateTyping()
  }, [typingIndex, messageList, displayedTexts])

  // 새로운 메시지가 추가될 때 스크롤 하단으로 이동
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messageList])

  const renderTags = (tags) => {
    if (!tags || Object.keys(tags).length === 0) {
      return null
    }

    return (
      <div className="text-xs text-gray-500 mt-1 italic">
        {Object.entries(tags).map(([key, items]) =>
          items.map((item, index) => (
            <span key={`${key}-${item}-${index}`} className="mr-1">
              #{item}
            </span>
          )),
        )}
      </div>
    )
  }

  return (
    <div className="fixed top-16 bottom-44 w-full max-w-2xl mx-auto p-4">
      <div
        className="message-list space-y-4 overflow-y-auto h-full w-full"
        ref={messageListRef}
        style={{ scrollBehavior: 'smooth' }}
      >
        {messageList.map((message, index) => (
          <div className="flex-col w-full text-sm rounded" key={message.id}>
            <div
              className={`flex items-start rounded-lg py-2 px-3 break-words w-fit max-w-[90%] ${
                message.type === 'user' ? 'ml-auto' : 'bg-gray-100'
              }`}
            >
              {/* 사용자 - 마지막 메시지 */}
              {message.type === 'user' ? (
                isLastMessage('user', index) ? (
                  <div className="flex justify-end w-full items-center">
                    {/* Edit Button */}
                    <div className="flex items-center justify-center pr-2 h-full">
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() =>
                          handleEditMessage(message.id, message.text)
                        }
                        aria-label="Edit Message"
                      >
                        <LiaEdit className="h-4 w-4" />
                      </button>
                    </div>
                    {/* Container for Message */}
                    <div className="bg-blue-50 text-gray-800 rounded-lg py-2 px-3 break-words border-b-gray-200">
                      <p>{message.text}</p>
                      {renderTags()}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 text-gray-800 rounded-lg py-2 px-3 break-words border-b-gray-200 ml-auto">
                    <p>{message.text}</p>
                  </div>
                )
              ) : (
                <>
                  <div className="flex-col">
                    <h3 className="mb-1">
                      <strong className="text-normal">{message.title}</strong>
                    </h3>
                    <p className="text-sm mb-2">
                      {displayedTexts[message.id] || message.text}
                    </p>
                    {renderTags(message.tags)}
                    {/* 좋아요 버튼 */}
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
            {/* 마지막 ai 생성 채팅의 경우 유사한문학 추천 영역 */}
            {isLastMessage('ai', index) &&
              lastAiMessageId === message.id &&
              typingComplete[message.id] && (
                <div className="transition-opacity duration-300 ease-in-out">
                  <ResponseRecommendations
                    similarClassicalArray={similarClassicalArray ?? []}
                    recommandStoryArray={recommandStoryArray ?? []}
                    requestNewRecommandStory={requestNewRecommandStory}
                    updateSelectedSimilarStory={updateSelectedSimilarStory}
                  />
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RetrieveClassicalLiterature
