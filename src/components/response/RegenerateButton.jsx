import React from 'react'
import useRetrieveClassicLiteratureStore from '../../store/useRetrieveClassicLiteratureStore'
// 고전문학 재생성 버튼
const RegenerateButton = ({
    handleCreateClick,
    messageList,
    setMessageList,
    similarClassicalArray,
    setSimilarClassicalArray,
}) => {
    const store = useRetrieveClassicLiteratureStore.getState()

    const handleRegenerate = () => {
        // 재생성 전 상태 초기화
        store.setAbortController(null)
        store.updateIsGenerating(false)
        store.setIsStopped(false)

        if (messageList.length > 0) {
            // messageList 업데이트
            const filteredMessages = messageList.filter((message, index) => {
                return index < messageList.length - 2
            })
            setMessageList(filteredMessages)

            //similarClassicalArray  업데이트
            const filteredSimilarMessagesAry = similarClassicalArray.filter((message, index) => {
                return index < similarClassicalArray.length - 1
            })
            setSimilarClassicalArray(filteredSimilarMessagesAry)

            // 이전 입력값으로 재생성
            const beforeInput = store.beforeTextInput
            console.log(`"${beforeInput}" 텍스트로 재생성 시작.`)
            handleCreateClick(beforeInput)
        }
    }

    return (
        <button
            onClick={handleRegenerate}
            className='fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-400 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all shadow-lg hover:shadow-xl hover:cursor-pointer'
        >
            <span className='text-sm block'>생성 중 중간에 멈추셨어요.</span>
            <span className='text-normal font-bold'>재생성하기</span>
        </button>
    )
}

export default RegenerateButton
