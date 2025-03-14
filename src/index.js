import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styled from 'styled-components'
import { ThemeProvider } from './contexts/ThemeContext'

const CustomToast = styled(ToastContainer)`
    .Toastify__toast-theme--dark {
        background-color: #000;
        color: #fff;
        border-radius: 9999px;
        width: fit-content;
        margin-bottom: 12px;
    }
`

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    // <React.StrictMode>
    <>
        <ThemeProvider>
            <App />
        </ThemeProvider>
        <CustomToast newestOnTop={true} limit={1} />
    </>,
    // </React.StrictMode>
)
