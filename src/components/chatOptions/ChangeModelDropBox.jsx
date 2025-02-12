import React from 'react'
import useModelStore from '../../store/storeModel.js'
import { FaCheck } from 'react-icons/fa6'

// 모델 변경 버튼 영역
const ChangeModelDropBox = ({ closeModelDropBox }) => {
  // 사용중인 model
  const { models, setModel } = useModelStore()

  //모델변경 처리
  const handleUpdateModel = (model) => {
    const newModels = models.map((item) => ({
      ...item,
      active: model.name === item.name,
    }))
    setModel(newModels) // 전체 배열을 직접 전달
    closeModelDropBox()
  }

  return (
    <div className="relative">
      <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
        {models.map((item, index) => (
          <button
            key={`${index}_${item.name}`}
            className={`flex w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
              item.active ? 'text-blue-500' : 'text-gray-700'
            }`}
            onClick={() => handleUpdateModel(item)}
          >
            {item.name}
            {item.active && (
              <span className="ml-1 pt-1 text-blue-500">
                <FaCheck />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChangeModelDropBox
