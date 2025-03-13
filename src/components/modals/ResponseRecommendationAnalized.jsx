import React from 'react'

/**
 * @description AI분석한 내용 노출
 * @returns
 */
const ResponseRecommendationAnalized = ({ analizedSimilarStory, updateIsOpenSimilarStory }) => {
    // overview: "", 개요
    // characteristics: "", 주요특징
    // significance: "" 문학사적의의
    return (
        <div className='fixed top-12 inset-0 z-20 flex items-center justify-center bg-black/70 pb-6'>
            {/* Modal Container */}
            <div className='shadow-xl m-4 max-w-md w-full overflow-scroll max-h-screen pt-12 pb-6'>
                <div className='bg-white rounded-lg'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-4 '>
                        <h2 className='text-lg font-semibold'>유사한 고전 원문</h2>
                        <button
                            onClick={updateIsOpenSimilarStory}
                            className='p-2 text-gray-500 hover:text-gray-700'
                        >
                            x
                        </button>
                    </div>

                    {/* Content */}
                    <div className='p-4 flex-1'>
                        <h3 className='text-xl font-bold mb-2'>
                            {analizedSimilarStory.title || '제목 없음'}
                        </h3>
                        <div className='text-gray-700 mb-4 '>
                            <p className='rounded-lg size-fit mt-4 font-bold'>개요</p>
                            <pre className='whitespace-pre-wrap text-sm'>
                                {analizedSimilarStory.overview || '개요 정보 없음'}
                            </pre>
                        </div>
                        <div className='text-gray-700 mb-4'>
                            <p className='rounded-lg size-fit mt-4 font-bold'>주요 특징</p>
                            <pre className='whitespace-pre-wrap text-sm'>
                                {analizedSimilarStory.characteristics || '주요특징 정보 없음'}
                            </pre>
                        </div>
                        <div className='text-gray-700 mb-4'>
                            <p className='rounded-lg size-fit mt-4 font-bold'>문학사적의의</p>
                            <pre className='whitespace-pre-wrap text-sm'>
                                {analizedSimilarStory.significance || '문학사적의의 없음'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResponseRecommendationAnalized
