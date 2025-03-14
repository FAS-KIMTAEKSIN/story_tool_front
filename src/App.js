import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainPage from './pages/main/Mainpage'
import ResultPage from './pages/result/ResultPage'
import { useTheme } from './contexts/ThemeContext'

function App() {
    const { isDarkMode } = useTheme()

    return (
        <div
            className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}
            style={{ minHeight: '100vh' }}
        >
            <Router>
                <Routes>
                    <Route path='/' element={<MainPage />} />
                    <Route path='/result' element={<ResultPage />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
