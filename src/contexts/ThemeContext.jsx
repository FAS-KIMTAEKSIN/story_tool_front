import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    // 테마 색상 정의
    const themeColors = {
        dark: {
            background: '#3D3D3B',
            text: '#FFFFFF',
            secondary: '#CCCCCC',
        },
        light: {
            background: '#FFFFFF',
            text: '#333333',
            secondary: '#666666',
        },
    }

    // 시스템 설정 또는 로컬 스토리지에서 초기 테마 설정
    useEffect(() => {
        // 로컬 스토리지 확인
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark')
        } else {
            // 시스템 설정 확인
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDarkMode(prefersDarkMode)
        }
    }, [])

    // 테마 변경 시 HTML과 body에 클래스 추가/제거
    useEffect(() => {
        // HTML 요소에 dark 클래스 추가/제거
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode')
            document.body.style.backgroundColor = '#3D3D3B'
            document.body.style.color = '#E5E5E5'
        } else {
            document.documentElement.classList.remove('dark-mode')
            document.body.style.backgroundColor = ''
            document.body.style.color = ''
        }
    }, [isDarkMode])

    // 테마 전환 함수
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode
            localStorage.setItem('theme', newMode ? 'dark' : 'light')
            return newMode
        })
    }

    return (
        <ThemeContext.Provider
            value={{
                isDarkMode,
                toggleTheme,
                colors: isDarkMode ? themeColors.dark : themeColors.light,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
