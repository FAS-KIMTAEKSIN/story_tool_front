import React, { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const LoadingMessage = () => {
    const { isDarkMode } = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(true)

    const loadingMessages = [
        '관련된 고전 작품을 탐색하고 있어요...',
        '작품들의 핵심 주제를 분석하고 있어요...',
        '이야기의 맥락을 파악하고 있어요...',
        '시대적 배경을 고려하며 검토 중이에요...',
        '유사한 문학적 요소를 찾고 있어요...',
        '작품들의 연관성을 확인하고 있어요...',
        '등장인물들의 특징을 비교하고 있어요...',
        '서사 구조를 분석하고 있어요...',
        '작품의 문학적 가치를 평가하고 있어요...',
        '최적의 추천 작품을 선별하고 있어요...',
        '선별된 작품들을 정리하고 있어요...',
        '이야기를 생성하고 있어요...',
    ]

    useEffect(() => {
        let typingTimer
        let currentCharIndex = 0
        const currentMessage = loadingMessages[currentIndex]

        // 타이핑 효과
        const typeText = () => {
            if (currentCharIndex <= currentMessage.length) {
                setDisplayText(currentMessage.slice(0, currentCharIndex))
                currentCharIndex++
                typingTimer = setTimeout(typeText, 20) // 타이핑 속도 (50ms)
            } else {
                setIsTyping(false)
                // 타이핑이 완료되면 1.5초 후 다음 메시지로
                setTimeout(() => {
                    setIsTyping(true)
                    setCurrentIndex((prevIndex) =>
                        prevIndex === loadingMessages.length - 1 ? 0 : prevIndex + 1,
                    )
                }, 1500)
            }
        }

        setIsTyping(true)
        typeText()

        return () => {
            clearTimeout(typingTimer)
        }
    }, [currentIndex])

    return (
        <div
            className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } transition-opacity duration-300 mt-2 pl-2`}
        >
            {displayText}
            {isTyping && <span className='inline-block ml-1 animate-pulse'>▎</span>}
        </div>
    )
}

export default LoadingMessage
