import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    retrieveAnalize,
    retrieveClassicalLiteratureWithVaiv,
    cancelGeneration,
} from '../../api/retrieveClassicalLiterature'
import { IoMdSend } from 'react-icons/io'
import { FaStop } from 'react-icons/fa'

import TagFilters from '../../components/main/TagFilters'
import RetrieveClassicalLiterature from '../../components/main/RetrieveClassicalLiterature'
import ResponseRecommendationDetail from '../../components/modals/ResponseRecommendationDetail'
import ResponseRecommendationAnalized from '../../components/modals/ResponseRecommendationAnalized'
import FillterIcon from '../../assets/filter.png'
import useRetrieveClassicLiteratureStore from '../../store/useRetrieveClassicLiteratureStore'
import RegenerateButton from '../../components/response/RegenerateButton'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * @description 메인 화면
 * @param {Object} props
 * - historyData: 히스토리 상세 데이터 (있는 경우 사용)
 */
const MobileMain = ({ historyData, isSidebarOpen }) => {
    const inputValueRef = useRef(null)
    const [selectedItems, setSelectedItems] = useState({})
    const [inputValue, setInputValue] = useState('')
    const [isDetailVisible, setIsDetailVisible] = useState(false)
    const [messageList, setMessageList] = useState([]) // user, ai 의 메시지를 담는 배열
    const [editingMessageId, setEditingMessageId] = useState(null) // 수정 중인 메시지 ID
    const [currentTags, setCurrentTags] = useState({}) // 현재 메시지에 사용된 태그

    const [similarClassicalArray, setSimilarClassicalArray] = useState([]) // 유사한 고전 원문
    const [selectedSimilarStory, setSelectedSimilarStory] = useState() //선택한 유사한 고전원문
    const [analizedSimilarStory, setAnalizedSimilarStory] = useState() //분석한 유사한 고전원문
    const [isOpenSimilarStory, setIsOpenSimilarStory] = useState(false) //분석한 유사한 고전원문 팝업 제어
    const [recommandStoryArray, setRecommandStoryArray] = useState([]) // 이런 이야기를 생성해보세요

    //store
    const retrievedLiteratureText = useRetrieveClassicLiteratureStore(
        (state) => state.retrievedLiterature,
    )
    const retrievedLiteratureTitle = useRetrieveClassicLiteratureStore(
        (state) => state.retrievedLiteratureTitle,
    )
    const isLoading = useRetrieveClassicLiteratureStore((state) => state.isGenerating)
    const isStopped = useRetrieveClassicLiteratureStore((state) => state.isStopped)
    const isLoadingSimilar = useRetrieveClassicLiteratureStore((state) => state.isLoadingSimilar)

    // theme
    const { isDarkMode } = useTheme()

    // 초기화: localStorage 정리
    useEffect(() => {
        localStorage.removeItem('content')
        localStorage.removeItem('thread_id')
        localStorage.removeItem('ragResult')
        localStorage.removeItem('content_clf')
        localStorage.removeItem('fineTuningResult')
        inputValueRef.current?.focus() // 컴포넌트 마운트 시 포커스
    }, [])

    // selectedItems 변경 시 localStorage 저장
    useEffect(() => {
        localStorage.setItem('content_clf', JSON.stringify(selectedItems))
    }, [selectedItems])

    /**
     * 부수적인 정보 값 세팅 (유사한 고전원문 + 이런 이야기~)
     * @param {Object} result API 응답 결과
     */
    const setAdditionalData = useCallback(
        (result) => {
            console.log('📌 [raw result]:', result)
            try {
                if (result) {
                    let noResultCount = 0
                    const newRagResult = ['similar_1', 'similar_2', 'similar_3']
                        .map((key) => result.newSimilarText[key])
                        .filter(Boolean) // null 또는 undefined 데이터 제거
                        .map((item) => {
                            const metadata = item.metadata || {}

                            if (!metadata.단락데이터 && !metadata.작품명) {
                                noResultCount++
                            }

                            return {
                                paragraph: metadata.단락데이터 || '내용 없음',
                                title: metadata.작품명 || '제목 없음',
                                country: metadata.국가 || '국가 없음',
                                paragraphNum: metadata.단락일련번호 || '단락번호 없음',
                                summary: metadata.주제문 || '요약 없음',
                                metadata, // 전체 metadata 저장
                                score: item.score || 0, // 유사도 점수 추가
                            }
                        })

                    console.log('📌 [변환된 newRagResult]:', newRagResult)
                    const newObj = {
                        type: 'ai',
                        list: [...newRagResult],
                        noResult: noResultCount === 3, // 결과 존재여부 (간결하게 수정)
                    }

                    //similar array update
                    setSimilarClassicalArray((prev) =>
                        Array.isArray(prev) ? [...prev, newObj] : [newObj],
                    )
                } else {
                    console.warn('⚠️ result가 올바르게 전달되지 않았습니다.')
                }
            } catch (error) {
                console.error(`🚨 setAdditionalData/ 유사한 고전 원문 : ${error}`)
            }

            try {
                setRecommandStoryArray([]) //초기화

                // "이런 이야기를 생성해보세요" 섹션 업데이트
                const recommendations = [
                    result?.newRecommendation?.recommended_1,
                    result?.newRecommendation?.recommended_2,
                    result?.newRecommendation?.recommended_3,
                ].filter(Boolean)

                if (recommendations.length > 0) {
                    setRecommandStoryArray(recommendations)
                } else {
                    console.warn('⚠️ recommendations가 올바르게 전달되지 않았습니다.')
                }
            } catch (error) {
                console.error(`🚨 setAdditionalData/ 이런 이야기를 생성해보세요 : ${error}`)
            }
        },
        [setSimilarClassicalArray, setRecommandStoryArray],
    )

    // historyData.result가 존재하면 기존 메시지 리스트에 추가
    useEffect(() => {
        // console.log("historyData", historyData);
        if (
            historyData &&
            historyData.conversation_history &&
            historyData.conversation_history.length > 0
        ) {
            console.log('history 선택 / MobileMain.jsx // \n', historyData.conversation_history)
            // conversation_history 배열의 모든 항목을 순회하여 메시지 배열을 구성합니다.
            const allMessages = historyData.conversation_history.flatMap((conv) => {
                const result = conv.result
                const convMessages = []
                if (result.user_input) {
                    convMessages.push({
                        id: `${result.conversation_id}_user`,
                        text: result.user_input,
                        type: 'user',
                    })
                }
                if (result.created_content || result.created_title) {
                    convMessages.push({
                        id: `${result.conversation_id}_ai`,
                        title: result.created_title,
                        text: result.created_content,
                        type: 'ai',
                        tags: result.tags || {},
                    })
                }
                return convMessages
            })
            // 새로 받은 데이터를 기존 메시지 리스트를 비우고 세팅합니다.
            setMessageList(allMessages)

            // 추가 데이터는 마지막 대화의 결과(또는 원하는 대화의 데이터를) 사용합니다.
            const lastResult =
                historyData.conversation_history[historyData.conversation_history.length - 1].result

            //유사고전원문 컬럼 설정
            lastResult.newSimilarText = {
                similar_1: lastResult.similar_1 ?? {},
                similar_2: lastResult.similar_2 ?? {},
                similar_3: lastResult.similar_3 ?? {},
            }

            //추천 이야기 컬럼 설정
            lastResult.newRecommendation = {
                recommended_1: lastResult.recommended_1 ?? '',
                recommended_2: lastResult.recommended_2 ?? '',
                recommended_3: lastResult.recommended_3 ?? '',
            }

            //  유사원문 - 사용자 메시지 추가 / 마지막 항목에만 추가
            const _blankUserObj = {
                type: 'user',
                list: [],
            }

            const _blankAiObj = {
                type: 'ai',
                list: [],
            }
            if (
                Array.isArray(historyData.conversation_history) &&
                historyData.conversation_history.length > 0
            ) {
                setSimilarClassicalArray([])
                historyData.conversation_history.map((conv, index) => {
                    //마지막 요소가 아닌 경우만 ////
                    if (index !== historyData.conversation_history.length - 1) {
                        //마지막 배열이 아닌 경우에만 ai 값까지 추가
                        setSimilarClassicalArray((prev) => [...prev, _blankUserObj])
                        setSimilarClassicalArray((prev) => [...prev, _blankAiObj])
                    } else {
                        //마지막의 경우 user 값만 추가
                        setSimilarClassicalArray((prev) => [...prev, _blankUserObj])
                    }
                    return conv
                })
            }

            setAdditionalData(lastResult)
        }
    }, [historyData, setAdditionalData])

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
    const updateLastUserMessage = useCallback(async (messageId, text, selectedItems) => {
        try {
            //전체 메시지 수정
            setMessageList((prev) => {
                // 마지막 AI 메시지 삭제
                const newMessageList = prev.filter((message, index) => {
                    return !(message.type === 'ai' && index === prev.length - 1)
                })

                // 사용자 메시지 업데이트
                return newMessageList.map((message) => {
                    if (message.id === messageId && message.type === 'user') {
                        return { ...message, text: text }
                    }
                    return message
                })
            })

            // 새로운 AI 메시지 추가 (필요한 경우)
            const newAiMessage = {
                id: Date.now() + 1,
                title: '',
                text: '',
                type: 'ai',
                tags: {},
                parentId: messageId,
            }
            setMessageList((prev) => [...prev, newAiMessage])

            //유사문학 - 마지막 ai 메시지 제거 (사용자메시지는 제거할 필요 없음)
            setSimilarClassicalArray((prev) => [...prev].slice(0, prev.length - 1))

            // 고전문학 데이터 생성 요청 (API 호출)
            const result = await retrieveClassicalLiteratureWithVaiv({
                inputValue: text,
                selectedItems,
            })

            // 추가 데이터 세팅
            setAdditionalData(result)
        } catch (error) {
            console.error('스토리 생성 중 오류 발생:', error)
        } finally {
            setEditingMessageId(null)
            setInputValue('')
            setCurrentTags({})
        }
    }, [])

    // AI 메시지 추가 - store값을 가져와 실시간으로 반영하는것으로 처리.
    useEffect(() => {
        if (messageList.length === 0 || retrievedLiteratureText === '') return

        const lastMessage = messageList[messageList.length - 1]

        if (lastMessage.type !== 'ai') {
            setMessageList((prev) => [...prev, { id: Date.now(), text: '', type: 'ai' }])
        } else if (lastMessage.type === 'ai') {
            setMessageList((prev) =>
                prev.map((message, index) =>
                    index === prev.length - 1
                        ? { ...message, text: retrievedLiteratureText }
                        : message,
                ),
            )
        }
    }, [retrievedLiteratureText])

    //title 수정 되면 기존의 값에 할당
    useEffect(() => {
        if (messageList.length === 0 || retrievedLiteratureTitle === '') return
        const lastMessage = messageList[messageList.length - 1]
        if (lastMessage.type === 'ai') {
            console.log('retrievedLiteratureTitle updated', retrievedLiteratureTitle)
            setMessageList((prev) =>
                prev.map((message, index) =>
                    index === prev.length - 1
                        ? { ...message, title: retrievedLiteratureTitle }
                        : message,
                ),
            )
        }
    }, [retrievedLiteratureTitle])

    // 이야기 생성 요청
    const handleCreateClick = useCallback(
        async (text = null, tags = undefined) => {
            //사용자가 입력한/수정한 메시지 추가
            const setNewUserMessage = (text) => {
                const newUserMessage = {
                    id: Date.now(),
                    text,
                    type: 'user',
                }
                setMessageList((prev) => [...prev, newUserMessage])
            }

            //이야기를 작성하고 신규 생성할 때
            if (text === null) {
                if (inputValue.trim() === '') return // 입력값 없으면 무시
                text = inputValue.trim()
            }

            //유사 고전 원문 추가 - 사용자 값은 빈값으로 넣어 줌
            const newObj = {
                type: 'user',
                list: [],
            }
            setSimilarClassicalArray((prev) => [...prev, newObj])

            //본내용 시작
            try {
                setNewUserMessage(text)
                const newSelectedItems = tags ? tags : JSON.parse(JSON.stringify(selectedItems))
                setCurrentTags(newSelectedItems)

                setInputValue('') // 입력값 초기화

                // 고전문학 데이터 생성 요청 (API 호출)
                const result = await retrieveClassicalLiteratureWithVaiv({
                    inputValue: text,
                    selectedItems: newSelectedItems,
                })

                // 추가 데이터 세팅
                setAdditionalData(result)
            } catch (error) {
                console.error('🚨 [오류 발생] 스토리 생성 중 오류:', error)
                alert('스토리 생성 중 오류가 발생했습니다.')
            } finally {
                setCurrentTags({}) // 태그 초기화
            }
        },
        [inputValue, selectedItems, setCurrentTags, setAdditionalData],
    ) // 의존성 배열에 setAdditionalData 추가

    /**
     * @description 이야기 생성 요청 함수
     */
    const requestNewStory = useCallback(
        async (story, tags = undefined) => {
            try {
                const newUserMessage = {
                    id: Date.now(),
                    text: story,
                    type: 'user',
                }
                setMessageList((prev) => [...prev, newUserMessage])

                // 사용자 메시지 추가
                const newObj = {
                    type: 'user',
                    list: [],
                }

                setSimilarClassicalArray((prev) => [...prev, newObj])
                useRetrieveClassicLiteratureStore.getState().setBeforeTextInput(story) // 이전 입력값 저장

                // 고전문학 데이터 생성 요청 (API 호출)
                const result = await retrieveClassicalLiteratureWithVaiv({
                    inputValue: story,
                    selectedItems: tags,
                })
                // 추가 데이터 세팅
                setAdditionalData(result)
            } catch (e) {
                console.error('🚨 새 이야기 요청 중 오류:', e)
                alert('이야기 생성 중 오류가 발생했습니다.')
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
    }, [editingMessageId, inputValue, selectedItems, updateLastUserMessage, handleCreateClick])

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
        const analizedResult = await retrieveAnalize(story)

        setAnalizedSimilarStory({ ...analizedResult, title: story.title })
        setSelectedSimilarStory(null)
        updateIsOpenSimilarStory() //open close 제어
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

    // 검색종료버튼
    const handleStop = useCallback(async () => {
        const store = useRetrieveClassicLiteratureStore.getState()
        store.abortController.abort()
        store.setIsStopped(true)

        const similarAndRecommandData = await cancelGeneration()
        setAdditionalData(similarAndRecommandData)
    }, [])

    return (
        <div
            className={`w-full ${isSidebarOpen ? 'md:w-[calc(100%-200px)]' : ''} ${
                isDarkMode ? 'text-white' : 'bg-white text-black'
            }`}
            style={isDarkMode ? { backgroundColor: '#3D3D3B' } : {}}
        >
            {/* 내용이 없을 때 표시되는 메시지 */}
            {!inputValue.trim() && messageList.length === 0 && (
                <div className='flex items-center justify-center flex-1 text-center text-gray-500 text-sm italic'>
                    <p>
                        간단한 설정으로 <br />
                        고전 이야기를 만들어 보세요
                    </p>
                </div>
            )}
            {/* 대화 내용 */}
            <RetrieveClassicalLiterature
                messageList={messageList}
                handleEditMessage={handleEditMessage}
                currentTags={currentTags}
                similarClassicalArray={similarClassicalArray}
                recommandStoryArray={recommandStoryArray}
                requestNewRecommandStory={requestNewStory}
                updateSelectedSimilarStory={updateSelectedSimilarStory}
                isLoading={isLoading}
                isLoadingSimilar={isLoadingSimilar}
                isDarkMode={isDarkMode}
            />
            {/* 하단 입력부 */}
            <div className='w-full max-w-[740px] mx-auto max-h-56 fixed bottom-2 p-2 flex space-x-2'>
                {/* 정지: 재생성 버튼 // 정상: 텍스트 입력 영역 */}
                {isStopped ? (
                    <RegenerateButton
                        handleCreateClick={handleCreateClick}
                        messageList={messageList}
                        setMessageList={setMessageList}
                        similarClassicalArray={similarClassicalArray}
                        setSimilarClassicalArray={setSimilarClassicalArray}
                    />
                ) : (
                    <div
                        className={`w-full h-full flex flex-col ${
                            isDarkMode ? 'border-gray-200' : 'border-gray-300'
                        } border rounded-md ${
                            isDarkMode ? 'text-gray-200' : 'bg-white'
                        } shadow-md p-2`}
                    >
                        <div className='w-full h-full flex items-center'>
                            <div className='flex-1 h-full'>
                                <textarea
                                    ref={inputValueRef}
                                    className={`w-full h-full border-none focus:outline-none resize-none overflow-y-auto max-h-28 p-2 ${
                                        isDarkMode
                                            ? 'bg-transparent text-gray-200'
                                            : 'bg-transparent text-black'
                                    }`}
                                    placeholder='예) 귀신이 소년을 괴롭혀서 소년이 울어버리는 이야기'
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value)
                                        handleTextareaResize(e)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault() // 기본 동작(줄바꿈) 방지
                                            handleSubmit()
                                        }
                                    }}
                                    rows={3} // 기본 높이 설정 (자동 조절 가능)
                                    disabled={isLoading}
                                />
                            </div>

                            {/* 버튼 그룹 */}
                            <div className='h-full flex flex-col pl-2 space-y-2'>
                                {/* stop 버튼 */}
                                {isLoading ? (
                                    <button
                                        className='flex items-center justify-center p-2 rounded-full transition-colors duration-300 focus:outline-none relative'
                                        onClick={handleStop}
                                    >
                                        <div
                                            className={`absolute inset-0 rounded-full border-2 ${
                                                isDarkMode
                                                    ? 'border-gray-200 border-t-white'
                                                    : 'border-gray-300 border-t-black'
                                            } animate-spin w-8 h-8 m-auto`}
                                        ></div>
                                        <FaStop
                                            className={`text-xs relative z-10 ${
                                                isDarkMode ? 'text-gray-200' : ''
                                            }`}
                                        />
                                    </button>
                                ) : (
                                    <>
                                        {/* Send 버튼 */}
                                        <button
                                            className={`flex items-center justify-center p-2 rounded-full transition-colors duration-300 focus:outline-none 
                                        ${
                                            inputValue.trim()
                                                ? isDarkMode
                                                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400'
                                                    : 'bg-black text-white hover:bg-gray-600 active:bg-gray-900'
                                                : 'bg-gray-100 text-gray-700 cursor-not-allowed'
                                        }`}
                                            onClick={handleSubmit}
                                            disabled={!inputValue.trim() || isLoading}
                                        >
                                            {editingMessageId ? (
                                                '수정'
                                            ) : (
                                                <IoMdSend className='text-lg' />
                                            )}
                                        </button>
                                    </>
                                )}

                                {editingMessageId && (
                                    <button
                                        className={`flex items-center justify-center p-2 -ml-1 ${
                                            isDarkMode
                                                ? 'text-gray-200 hover:bg-gray-700 active:bg-gray-600'
                                                : 'bg-white text-gray-500 hover:bg-gray-300 active:bg-gray-400'
                                        } rounded-md transition-colors duration-300`}
                                        onClick={handleCancelEdit}
                                    >
                                        취소
                                    </button>
                                )}

                                {/* Settings 버튼 */}
                                <button
                                    className={`flex items-center justify-center p-2 -ml-1 ${
                                        isDarkMode
                                            ? 'text-gray-200 hover:bg-gray-700 active:bg-gray-600'
                                            : 'bg-white text-gray-500 hover:bg-gray-300 active:bg-gray-400'
                                    } rounded-md transition-colors duration-300`}
                                    onClick={handleIsDetailVisible}
                                >
                                    <img src={FillterIcon} alt='Filter' className='w-5 h-5' />
                                </button>
                            </div>
                        </div>
                        {/* 선택된 태그가 나열되는 위치 */}
                        <div className='h-10 overflow-x-auto whitespace-nowrap'>
                            <div className='flex gap-1 p-1'>
                                {Object.entries(selectedItems).map(([key, items]) =>
                                    items.map((item, index) => (
                                        <button
                                            key={`${key}-${item}-${index}`}
                                            className={`px-2 py-1 text-xs rounded-full focus:outline-none ${
                                                isDarkMode
                                                    ? 'text-gray-200 bg-gray-700 hover:bg-gray-600'
                                                    : 'text-gray-500 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                            onClick={() => handleDeleteTag(key, item)}
                                        >
                                            {item}
                                        </button>
                                    )),
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
        </div>
    )
}

export default MobileMain
