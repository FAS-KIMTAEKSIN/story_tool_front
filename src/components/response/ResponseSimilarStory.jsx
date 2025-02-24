import { CiSearch } from 'react-icons/ci'

/**
 * @description 유사한 고전원문
 * @param {Object} similarClassicalArray 유사한 고전원문
 * @param {Function} updateSelectedSimilarStory 유사한 고전원문 선택 이벤트
 * @param {Array} aiMessageList AI 메시지 배열
 */
const ResponseSimilarStory = ({ similarClassicalArray, updateSelectedSimilarStory }) => {
    return (
        <>
            {similarClassicalArray?.type === 'ai' && (
                <div className='flex flex-col gap-2 text-gray-800 rounded-lg py-2 break-words border-b-gray-200 w-full'>
                    {similarClassicalArray && (
                        <div className='w-full'>
                            <h3 className='mb-1 flex items-center'>
                                <span className='mr-2'>📖</span>
                                <strong className='text-normal'>유사한 고전 원문</strong>
                            </h3>
                        </div>
                    )}
                    {similarClassicalArray?.list.map((story, index) => (
                        <div className='flex' key={index}>
                            <button
                                key={`${index} ${story.paragraphNum}`}
                                className='bg-gray-100 rounded-2xl p-2 w-full text-left max-w-[90%]'
                                onClick={() => updateSelectedSimilarStory(story)}
                            >
                                <p className='mb-1 font-semibold'>
                                    <b>{story.title || '제목 없음'}</b>
                                </p>
                                {/* 내용이 2줄이상인 경우에는 ... 처리 */}
                                <p className='text-sm text-gray-600 line-clamp-2'>
                                    {story.summary || '내용 없음'}
                                </p>
                            </button>
                            <button
                                className='p-1 text-gray-500 hover:text-black focus:outline-none pl-2 max-w-[10%]'
                                onClick={() => updateSelectedSimilarStory(story)}
                                aria-label='Edit Message'
                            >
                                <CiSearch width={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default ResponseSimilarStory
