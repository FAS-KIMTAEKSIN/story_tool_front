import { GoPlus } from 'react-icons/go'

/**
 * @description 부수적인 정보를 제공하는 컴포넌트 (유사한 고전원문 + 이런 이야기~)
 * @param {Array} recommandStoryArray 이런 이야기를 생성해보세요
 * @param {Function} requestNewRecommandStory 새로운이야기생성
 * @returns
 */
const ResponseRecommendations = ({
    recommandStoryArray,
    requestNewRecommandStory,
    isLoading,
}) => {
    //버튼클릭 시 완료될때까지 눌리지 않게 처리
    const handleRequestNewRecommandStory = (story) => {
        if (isLoading) return
        requestNewRecommandStory(story)
    }

    return (
        <div className={`flex-col items-start rounded-lg py-2 break-words w-full`}>
            
            {/* 2. 이런 이야기를 생성해보세요 */}
            <div className="mt-2">
                <h3 className="mb-1 flex items-center">
                    <span className="mr-2"></span>
                    <strong className="text-normal">
                        이런 이야기를 생성해보세요
                    </strong>
                </h3>
                <div className="flex flex-col w-full py-2">
                    {recommandStoryArray.map((story, index) => (
                        <div className="flex" key={index}>
                            <button
                                className="bg-gray-100 flex-1 rounded-2xl p-2 mb-2 text-start pl-4 max-w-[90%]"
                                key={`${index} ${story}`}
                                onClick={() =>
                                    handleRequestNewRecommandStory(story)
                                }
                            >
                                {story}
                            </button>
                            <button
                                className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none pl-2"
                                onClick={() =>
                                    handleRequestNewRecommandStory(story)
                                }
                                aria-label="Edit Message"
                            >
                                <GoPlus width={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ResponseRecommendations
