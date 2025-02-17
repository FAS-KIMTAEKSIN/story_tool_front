import React, { useEffect } from 'react'

/**
 * @description 유사한 고전 원문 상세 팝업
 * @param {Object} story 유사한 고전 원문 상세 내용
 * @param {Function} closeResponseRecommendationDetail 팝업 닫기 함수
 * @param {Function} handleAnalyze ai분석 시작하기
 * @returns
 */
const ResponseRecommendationDetail = ({
    story,
    closeResponseRecommendationDetail,
    handleAnalyze,
}) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeResponseRecommendationDetail(null)
        }
    }

    //원문의 제목으로 새창 띄우기 및 구글 검색 추가
    const handleOpenNewPage = (story) => {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
            story.title,
        )}`
        window.open(googleSearchUrl, '_blank') // 새 탭에서 열기
    }

    return (
        <div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/70"
            onClick={handleBackdropClick}
        >
            {/* Modal Container */}
            <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">
                        유사한 고전 원문 상세
                    </h2>
                    <button
                        onClick={() => closeResponseRecommendationDetail(null)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                    >
                        닫기
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <h3 className="text-xl font-bold mb-2">
                        {story.title || '제목 없음'}
                    </h3>
                    <p className="text-gray-700 mb-4">
                        {story.paragraph || '단락 정보 없음'}
                    </p>

                    {/* AI 원문 분석 시작하기 버튼 */}
                    <button
                        onClick={() => handleOpenNewPage(story)}
                        // onClick={() => handleAnalyze(story)}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded text-sm"
                    >
                        제목으로 검색하기
                        {/* AI 원문 분석 시작하기 */}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResponseRecommendationDetail
