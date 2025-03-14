// 다크모드 및 라이트모드 아이콘 버튼 스타일
export const getIconButtonStyle = (isDarkMode) => {
    return isDarkMode
        ? 'text-2xl cursor-pointer hover:text-gray-200 hover:bg-gray-600 p-3 rounded' // 다크모드
        : 'text-2xl cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-3 rounded' // 라이트모드
}

// 기존 스타일 (다크모드 기준)
export const IconButtonStyle =
    'text-2xl cursor-pointer hover:text-gray-200 hover:bg-gray-600 p-3 rounded'

// 다크모드 스타일
export const DarkModeIconButtonStyle =
    'text-2xl cursor-pointer hover:text-gray-200 hover:bg-gray-600 p-3 rounded'

// 라이트모드 스타일
export const LightModeIconButtonStyle =
    'text-2xl cursor-pointer hover:text-gray-700 hover:bg-gray-200 p-3 rounded'
