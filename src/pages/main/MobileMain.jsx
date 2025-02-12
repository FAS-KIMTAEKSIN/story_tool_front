import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  retrieveClassicalLiterature,
  retrieveAnalize,
} from '../../api/retrieveClassicalLiterature'
import { IoMdSend } from 'react-icons/io'
// import { FaFilter } from 'react-icons/fa'
import LoadingBar from '../../components/LoadingBar'
import TagFilters from '../../components/main/TagFilters'
import RetrieveClassicalLiterature from '../../components/main/RetrieveClassicalLiterature'
import ResponseRecommendationDetail from '../../components/modals/ResponseRecommendationDetail'
import ResponseRecommendationAnalized from '../../components/modals/ResponseRecommendationAnalized'
import filterIconImg from '../../assets/filter.png' // 이미지 import

/**
 * @description 메인 화면
 */
const MobileMain = () => {
  const inputValueRef = useRef(null)
  const [selectedItems, setSelectedItems] = useState({})
  const [inputValue, setInputValue] = useState('')
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messageList, setMessageList] = useState([]) // user, ai 의 메시지를 담는 배열
  const [editingMessageId, setEditingMessageId] = useState(null) // 수정 중인 메시지 ID
  const [currentTags, setCurrentTags] = useState({}) // 현재 메시지에 사용된 태그

  const [similarClassicalArray, setSimilarClassicalArray] = useState([]) // 유사한 고전 원문
  const [selectedSimilarStory, setSelectedSimilarStory] = useState() //선택한 유사한 고전원문
  const [analizedSimilarStory, setAnalizedSimilarStory] = useState() //분석한 유사한 고전원문
  const [isOpenSimilarStory, setIsOpenSimilarStory] = useState(false) //분석한 유사한 고전원문 팝업 제어
  const [recommandStoryArray, setRecommandStoryArray] = useState([]) // 이런 이야기를 생성해보세요

  // 초기화: localStorage 정리
  useEffect(() => {
    localStorage.removeItem('content')
    localStorage.removeItem('ragResult')
    localStorage.removeItem('content_clf')
    localStorage.removeItem('fineTuningResult')
    inputValueRef.current?.focus() // 컴포넌트 마운트 시 포커스
  }, [])

  // selectedItems 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem('content_clf', JSON.stringify(selectedItems))
  }, [selectedItems])

  // 태그 필터 팝업 visible 상태 변경
  const handleIsDetailVisible = useCallback(() => {
    setIsDetailVisible((prev) => !prev)
  }, [])

  // textarea 높이 자동 조절
  const handleTextareaResize = useCallback(async (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 30 * 16)}px`
  }, [])

  // 마지막 사용자 메시지 수정 + AI 생성 요청
  const updateLastUserMessage = useCallback(
    async (messageId, text, selectedItems) => {
      setIsLoading(true)
      try {
        // 메시지 리스트 수정
        setMessageList((prev) => {
          const newMessages = [...prev]
          const lastUserMessageIndex = newMessages
            .slice()
            .reverse()
            .findIndex((message) => message.type === 'user')

          if (lastUserMessageIndex > -1) {
            newMessages[newMessages.length - lastUserMessageIndex - 1] = {
              ...newMessages[newMessages.length - lastUserMessageIndex - 1],
              text,
            }
          }
          return newMessages
        })

        console.log('------ updateLastUserMessage ------', text)

        // 고전문학 데이터 생성 요청 (API 호출)
        const retrieveResponse = await retrieveClassicalLiterature({
          inputValue: text,
          selectedItems,
        })

        console.log('------ retrieveResponse ------', retrieveResponse)

        // API 응답이 성공적으로 도착했을 경우, 기존의 마지막 AI 메시지를 수정
        if (retrieveResponse?.content?.trim()) {
          // 기존 메시지 업데이트 (마지막 AI 메시지 수정)
          setMessageList((prev) => {
            const newMessages = [...prev]
            const lastAiMessageIndex = newMessages
              .slice()
              .reverse()
              .findIndex((message) => message.type === 'ai')

            if (lastAiMessageIndex > -1) {
              newMessages[newMessages.length - lastAiMessageIndex - 1] = {
                ...newMessages[newMessages.length - lastAiMessageIndex - 1],
                title: retrieveResponse.title,
                text: retrieveResponse.content,
                tags: JSON.parse(JSON.stringify(selectedItems)), // 변경된 태그를 AI 메시지에 추가
              }
            }
            return newMessages
          })

          setAdditionalData(
            retrieveResponse.ragResult,
            retrieveResponse.recommendations,
          )
        } else {
          console.warn('AI 생성 결과를 불러올 수 없습니다.') // 경고 메시지
        }
      } catch (error) {
        console.error('스토리 생성 중 오류 발생:', error)
        alert('스토리 생성 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
        setEditingMessageId(null)
        setInputValue('') // 입력값 초기화
        setCurrentTags({}) // 태그 초기화
      }
    },
    [],
  )

  /**
   * 부수적인 정보 값 세팅 (유사한 고전원문 + 이런 이야기~)
   * @param {Array} ragResult 유사한 고전 원문
   * @param {Array} recommendations 이런 이야기를 생성해보세요
   */
  const setAdditionalData = useCallback((ragResult, recommendations) => {
    console.log('------ ragResult ------', ragResult)
    console.log('------ recommendations ------', recommendations)

    //유사한 고전 원문,
    if (ragResult !== undefined && ragResult.length > 0) {
      if (Array.isArray(ragResult)) {
        const newRagResult = ragResult.map((item) => ({
          content: item.content || '내용 없음',
          title: item.metadata?.작품명 || '제목 없음',
          country: item.metadata?.국가 || '내용 없음',
          paragraphNum: item.metadata?.단락일련번호 || '내용 없음',
          paragraph: item.metadata?.단락데이터 || '내용 없음',
          summary: item.metadata?.요약문 || '요약 없음',
        }))
        setSimilarClassicalArray(newRagResult)
      }
    }

    //이런 이야기를 생성해보세요
    if (recommendations !== undefined && recommendations.length > 0) {
      setRecommandStoryArray(recommendations)
    }
  }, [])
  // 이야기 생성 요청
  const handleCreateClick = useCallback(async () => {
    if (inputValue.trim() === '') return // 입력값 없으면 무시

    setIsLoading(true)
    try {
      // 메시지 목록에 사용자 메시지 추가
      const newUserMessage = { id: Date.now(), text: inputValue, type: 'user' }
      setMessageList((prev) => [...prev, newUserMessage])

      const newSelectedItems = JSON.parse(JSON.stringify(selectedItems))
      // Set current tags to the selected tags before API call
      setCurrentTags(newSelectedItems)

      // 고전문학 데이터 생성 요청 (API 호출)
      const retrieveResponse = await retrieveClassicalLiterature({
        inputValue,
        selectedItems: newSelectedItems,
      })

      console.log('------ retrieveResponse ------', retrieveResponse)

      // API 응답이 성공적으로 도착했을 경우
      if (retrieveResponse?.content?.trim()) {
        // AI 생성 결과를 메시지 목록에 추가
        const newAiMessage = {
          id: Date.now(),
          title: retrieveResponse.title,
          text: retrieveResponse.content,
          type: 'ai',
          tags: newSelectedItems, // 변경된 태그를 AI 메시지에 추가
        }
        setMessageList((prev) => [...prev, newAiMessage])

        setAdditionalData(
          retrieveResponse.ragResult,
          retrieveResponse.recommendations,
        )
      } else {
        console.warn('AI 생성 결과를 불러올 수 없습니다.') // 경고 메시지
      }
    } catch (error) {
      console.error('스토리 생성 중 오류 발생:', error)
      alert('스토리 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      setInputValue('') // 입력값 초기화
      setCurrentTags({}) // 태그 초기화
    }
  }, [inputValue, selectedItems, setCurrentTags]) // 의존성 배열 명시

  /**
   * @description 이야기 생성 요청 함수
   */
  const requestNewStory = useCallback(
    async (story, tags = undefined) => {
      try {
        setIsLoading(true)

        const newUserMessage = { id: Date.now(), text: story, type: 'user' }
        setMessageList((prev) => [...prev, newUserMessage])

        // 고전문학 데이터 생성 요청 (API 호출)
        const retrieveResponse = await retrieveClassicalLiterature({
          inputValue: story,
          selectedItems: tags,
        })

        console.log('------ retrieveResponse ------', retrieveResponse)

        // API 응답이 성공적으로 도착했을 경우
        if (retrieveResponse?.content?.trim()) {
          // AI 생성 결과를 메시지 목록에 추가
          const newAiMessage = {
            id: Date.now(),
            title: retrieveResponse.title,
            text: retrieveResponse.content,
            type: 'ai',
            tags: tags, // 변경된 태그를 AI 메시지에 추가
          }
          setMessageList((prev) => [...prev, newAiMessage])

          setAdditionalData(
            retrieveResponse.ragResult,
            retrieveResponse.recommendations,
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    },
    [setAdditionalData, setMessageList],
  )

  // 메시지 수정 또는 생성
  const handleSubmit = useCallback(async () => {
    if (inputValue.trim() === '') return // 유효성 검사: 입력값 없으면 무시

    if (editingMessageId) {
      // 수정 모드: updateLastUserMessage 호출
      updateLastUserMessage(editingMessageId, inputValue, selectedItems)
    } else {
      // 생성 모드: handleCreateClick 호출
      handleCreateClick()
    }
  }, [
    editingMessageId,
    inputValue,
    selectedItems,
    updateLastUserMessage,
    handleCreateClick,
  ])

  // RetrieveClassicalLiterature 컴포넌트에서 수정 버튼 클릭 시 호출
  const handleEditMessage = (messageId, text) => {
    setInputValue(text) // inputValue 상태 업데이트
    setEditingMessageId(messageId) // 수정 중인 메시지 ID 설정
    inputValueRef.current?.focus() // textarea에 포커스
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setInputValue('') // 입력값 초기화
  }

  // 태그 삭제
  const handleDeleteTag = useCallback((key, item) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev }
      newItems[key] = newItems[key].filter((i) => i !== item)
      return newItems
    })
  }, [])

  const handleAnalyze = async (story) => {
    console.log(story)
    setIsLoading(true)
    const analizedResult = await retrieveAnalize(story)

    setAnalizedSimilarStory({ ...analizedResult, title: story.title })

    setSelectedSimilarStory(null)
    updateIsOpenSimilarStory() //open close 제어

    setIsLoading(false)
  }

  const updateIsOpenSimilarStory = () => {
    setIsOpenSimilarStory((prev) => !prev)
  }

  const updateSelectedSimilarStory = (story, type = null) => {
    console.log('updateSelectedSimilarStory', story)
    if (type === 'close') {
      setSelectedSimilarStory(null)
    } else {
      setSelectedSimilarStory(story)
    }
  }

  return (
    <>
      {isLoading && <LoadingBar />}
      {/* 내용이 없을 때 표시되는 메시지 */}
      {!inputValue.trim() && messageList.length === 0 && (
        <div className="flex items-center justify-center flex-1 text-center text-gray-500 text-sm italic">
          <p>
            간단한 설정으로 <br />
            고전 이야기를 만들어 보세요
          </p>
        </div>
      )}

      {/* 대화 내용 */}
      <RetrieveClassicalLiterature
        messageList={messageList} //메시지 목록
        handleEditMessage={handleEditMessage} // 수정 버튼 클릭 시 호출될 함수
        currentTags={currentTags} // 전달
        similarClassicalArray={similarClassicalArray} // 유사한 고전 원문
        recommandStoryArray={recommandStoryArray} // 이런 이야기를 생성해보세요
        requestNewRecommandStory={requestNewStory}
        updateSelectedSimilarStory={updateSelectedSimilarStory}
      />

      {/* 하단 입력부 */}
      <div className="w-full max-h-56 fixed bottom-2 p-2 flex space-x-2">
        <div className="w-full h-full flex flex-col border border-gray-300 rounded-md bg-white shadow-md p-2">
          <div className="w-full h-full flex items-center">
            {/* Textarea 영역 */}
            <div className="flex-1 h-full">
              <textarea
                ref={inputValueRef}
                className="w-full h-full border-none focus:outline-none resize-none bg-transparent overflow-y-auto max-h-28 p-2"
                placeholder="예) 귀신이 소년을 괴롭혀서 소년이 울어버리는 이야기"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  handleTextareaResize(e)
                }}
                rows={3} // 기본 높이 설정 (자동 조절 가능)
              />
            </div>
            {/* 버튼 그룹 */}
            <div className="h-full flex flex-col pl-2 space-y-2">
              {/* Send 버튼 */}
              <button
                className={`flex items-center justify-center p-2 rounded-full transition-colors duration-300 focus:outline-none 
                      ${
                        inputValue.trim()
                          ? 'bg-black text-white hover:bg-gray-600 active:bg-gray-900'
                          : 'bg-gray-100 text-gray-700 cursor-not-allowed'
                      }`}
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
              >
                {editingMessageId ? '수정' : <IoMdSend className="text-lg" />}
              </button>

              {editingMessageId && (
                <button
                  className="flex items-center justify-center p-2 -ml-1 bg-white text-gray-500 rounded-md hover:bg-gray-300 active:bg-gray-400 transition-colors duration-300"
                  onClick={handleCancelEdit}
                >
                  취소
                </button>
              )}

              {/* Settings 버튼 */}
              <button
                className="flex items-center justify-center p-2 -ml-1 bg-white text-gray-500 rounded-md hover:bg-gray-300 active:bg-gray-400 transition-colors duration-300"
                disabled={isLoading}
                onClick={handleIsDetailVisible}
              >
                <img src={filterIconImg} alt="Tag Filter" width={18} />
                {/* <FaFilter className="text-sm" /> */}
              </button>
            </div>
          </div>
          {/* 선택된 태그가 나열되는 위치. 기본 1rem */}
          <div
            className={
              'overflow-x-auto whitespace-nowrap ' +
              `${selectedItems.length > 0 && 'h-10'}`
            }
          >
            {/* 스크롤 속성 적용 및 높이 지정 */}
            <div className="flex gap-1 p-1">
              {/* p-1 추가 */}
              {Object.entries(selectedItems).map(([key, items]) =>
                items.map((item, index) => (
                  <button // div 대신 button 사용 (삭제 기능 고려)
                    key={`${key}-${item}-${index}`} // index 추가해서 key 중복 방지
                    className="px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none" // hover 효과 추가
                    onClick={() => handleDeleteTag(key, item)} // 삭제 기능 추가
                  >
                    {item}
                    {/*<TiDelete className="inline" /> 삭제 아이콘 숨김: 영역이 너무 길게 나타남. */}
                  </button>
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 태그 필터 팝업 */}
      {isDetailVisible && (
        <TagFilters
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          isDetailVisible={isDetailVisible}
          setIsDetailVisible={handleIsDetailVisible} // handleIsDetailVisible 함수 전달
        />
      )}

      {/* detail 바텀시트 */}
      {selectedSimilarStory && (
        <ResponseRecommendationDetail
          story={selectedSimilarStory}
          closeResponseRecommendationDetail={updateSelectedSimilarStory}
          handleAnalyze={handleAnalyze}
        />
      )}

      {/* 유사한 분석 원문 완료 후 노출 */}
      {analizedSimilarStory && !isOpenSimilarStory && (
        <ResponseRecommendationAnalized
          analizedSimilarStory={analizedSimilarStory}
          updateIsOpenSimilarStory={updateIsOpenSimilarStory}
        />
      )}
    </>
  )
}

export default MobileMain
