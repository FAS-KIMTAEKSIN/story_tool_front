import { useEffect } from 'react'

/**
 * @description 부수적인 정보를 제공하는 컴포넌트 (유사한 고전원문 + 이런 이야기~)
 * @param {Array} similarClassicalArray 유사한 고전 원문
 * @param {Array} recommandStoryArray 이런 이야기를 생성해보세요
 * @param {Function} requestNewRecommandStory 새로운이야기생성
 * @returns
 */
const ResponseRecommendations = ({
  similarClassicalArray,
  recommandStoryArray,
  requestNewRecommandStory,
  updateSelectedSimilarStory, //유사한 고전원문 팝업
}) => {
  useEffect(() => {
    console.log(recommandStoryArray)
  }, [recommandStoryArray])

  return (
    <div
      className={`flex-col items-start rounded-lg py-2 break-words w-full max-w-[90%]`}
    >
      {/* 1. 유사한 고전 원문 */}
      <div className="w-full">
        <h3 className="mb-1">
          <strong className="text-normal">유사한 고전 원문</strong>
        </h3>
        {similarClassicalArray && Array.isArray(similarClassicalArray) && (
          <div className="flex flex-col w-full h-max-[16rem] gap-2 text-gray-800 rounded-lg py-2 px-3 break-words border-b-gray-200">
            {similarClassicalArray.map((story, index) => (
              <button
                key={`${index} ${story.content.row_id}`}
                className="w-full bg-gray-100 flex-1 rounded-2xl p-2"
                onClick={() => updateSelectedSimilarStory(story)}
              >
                <p className="mb-1">
                  <b>{story.content.작품명}</b>
                </p>
                <p className="line-clamp-2">{story.content.주제문}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. 이런 이야기를 생성해보세요 */}
      <div>
        <h3 className="mb-2">
          <strong className="text-normal">이런 이야기를 생성해보세요</strong>
        </h3>
        <div className="">
          {recommandStoryArray.map((story, index) => (
            <button
              className="bg-gray-100 flex-1 rounded-2xl p-2 mb-2"
              key={`${index} ${story}`}
              onClick={() => requestNewRecommandStory(story)}
            >
              {story}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResponseRecommendations
