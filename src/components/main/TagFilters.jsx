import contentData from '../../assets/content_clf.json'
import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5' // 닫기 아이콘 추가

/**
 * @description 태그 필터 목록 컴포넌트
 * @param {Array} selectedItems 선택된 필터 목록
 * @param {Function} setSelectedItems 필터 목록 업데이트 함수
 * @param {Boolean} isDetailVisible 상세 필터 영역 표시 여부
 * @param {Function} setIsDetailVisible 필터 닫기 인식 함수
 * @returns
 */
const TagFilters = ({
  selectedItems,
  setSelectedItems,
  isDetailVisible,
  setIsDetailVisible,
}) => {
  const [isVisible, setIsVisible] = useState(false) // 애니메이션용 상태
  const [tempSelectedItems, setTempSelectedItems] = useState(selectedItems) // 임시 필터 상태

  //INIT
  useEffect(() => {
    setIsVisible(true)
    setTempSelectedItems(selectedItems) // 초기값 설정
  }, [selectedItems])

  //태그 활성화 함수
  const handleTagClick = (section, item) => {
    setTempSelectedItems((prev) => {
      const sectionItems = prev[section] || []
      const updatedItems = sectionItems.includes(item)
        ? sectionItems.filter((tag) => tag !== item)
        : [...sectionItems, item]
      return { ...prev, [section]: updatedItems }
    })
  }

  //태그 비활성화 함수
  const handleDeleteTag = (key, value) => {
    setTempSelectedItems((prev) => {
      const updated = prev[key]?.filter((item) => item !== value)
      const newSelectedItems = { ...prev, [key]: updated }
      return newSelectedItems
    })
  }

  //취소 버튼 클릭 함수
  const handleCancel = () => {
    setTempSelectedItems({}) // 임시 필터 초기화
    setIsVisible(false)
    setIsDetailVisible(false)
  }

  //확인 버튼 클릭 함수
  const handleApply = () => {
    setSelectedItems(tempSelectedItems) // 최종 필터 적용
    setIsVisible(false)
    setIsDetailVisible(false)
  }

  return (
    <div
      className={`z-40 bg-white rounded-2xl border border-gray-200 shadow-md transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } flex flex-col h-full`} // flex-col 추가
    >
      {/* 닫기 버튼 */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={handleCancel}
      >
        <IoClose size={24} />
      </button>

      {/* 상세 필터 영역 - 옵션을 추가, 고전문학에 장르 부여 */}
      <div className="p-4 w-full flex-grow overflow-y-auto">
        {' '}
        {/* flex-grow 추가 */}
        {!isDetailVisible && (
          <div className="flex flex-wrap gap-2">
            {Object.keys(tempSelectedItems).flatMap((key) =>
              tempSelectedItems[key]?.map((item, index) => (
                <button
                  key={`${key}-${index}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-xs cursor-pointer focus:outline-none"
                  onClick={() => handleDeleteTag(key, item)}
                >
                  {item}
                </button>
              )),
            )}
          </div>
        )}
        {isDetailVisible &&
          Object.keys(contentData).map((key) => (
            <div key={key} className="w-full mt-4">
              <div className="flex items-center w-full py-2 mb-2 border-b border-gray-200">
                <div className="font-semibold text-gray-700">{key}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {contentData[key].map((item, index) => (
                  <button
                    key={`${key}-${index}`}
                    className={`px-4 py-2 rounded-full text-xs cursor-pointer focus:outline-none transition-colors duration-200 ${
                      tempSelectedItems[key]?.includes(item)
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => handleTagClick(key, item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* 확인 및 취소 버튼 */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end mt-6 gap-4">
        {' '}
        {/* sticky 및 배경색 추가 */}
        <button
          className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleCancel}
        >
          취소
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
          onClick={handleApply}
        >
          확인
        </button>
      </div>
    </div>
  )
}

export default TagFilters
