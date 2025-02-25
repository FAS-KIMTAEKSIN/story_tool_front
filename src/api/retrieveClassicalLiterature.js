import useRetrieveClassicLiteratureStore from '../store/useRetrieveClassicLiteratureStore'
import Config from '../util/config'

/**
 * @description 고전문학 내용을 생성하는 ai api 호출
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @returns {Array} ragResult, fineTuningResult
 */
export const retrieveClassicalLiterature = async ({ inputValue, selectedItems }) => {
    console.log('retrieveClassicalLiterature:\n', inputValue, '\n', selectedItems)

    if (
        typeof inputValue === 'string' &&
        (inputValue.trim() || Object.keys(selectedItems).length > 0)
    ) {
        try {
            let threadId = localStorage.getItem('thread_id') // 로컬스토리지에서 값 가져오기

            if (threadId) {
                threadId = threadId.trim().replace(/"/g, '') // 앞뒤 공백 및 쌍따옴표 제거
            } else {
                threadId = null // 값이 없으면 null 설정
            }

            const requestBody = {
                user_input: inputValue,
                tags: selectedItems,
                thread_id: threadId,
            }

            localStorage.setItem('content', inputValue)

            // API 요청
            const response = await fetch(`${Config.baseURL}/api/generateWithSearch`, {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error(`❌ [API Error (${response.status})]:`, errorText)
                throw new Error(`API Error (${response.status}): ${errorText}`)
            }

            const jsonResponse = await response.json()
            console.log('✅ [API 응답 데이터]:', jsonResponse)

            // 로컬스토리지에 저장
            localStorage.setItem('ragResult', JSON.stringify(jsonResponse.result))
            localStorage.setItem('fineTuningResult', JSON.stringify(jsonResponse.result))
            console.log(jsonResponse)
            return jsonResponse
        } catch (error) {
            console.error('🚨 [API 요청 중 오류 발생]:', error)
            alert(`요청 처리 중 오류가 발생했습니다: ${error.message}`)
        }
    } else {
        alert('내용을 입력하거나 태그를 선택해주세요.')
    }
}

/**
 * @description 유사한 고전문학 내용분석 api 호출
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @returns {Array}
 */
export const retrieveAnalize = async (similarText) => {
    console.log('AI분석시작')

    const pTitle = similarText ? similarText.title : '제목 없음'

    try {
        const response = await fetch(`${Config.baseURL}/api/analyze`, {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify({
                title: pTitle, // 실제로는 props로 전달받은 제목 사용
            }),
        })

        if (!response.ok) {
            throw new Error('Analysis request failed')
        }
        const data = await response.json()

        return data
    } catch (error) {
        console.error('Error fetching analysis:', error)
    }
}

/**
 * @description 고전문학 내용을 생성하는 ai api 호출
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @returns 없음 - store 사용
 */
export const retrieveClassicalLiteratureWithVaiv = async ({ inputValue, selectedItems }) => {
    //기존 로직을 토대로 신규 Viav 데이터 Streaming 로직 추가
    console.log('retrieveClassicalLiterature:\n', inputValue, '\n', selectedItems)
    useRetrieveClassicLiteratureStore.getState().updateIsGenerating(true) //isLoading

    if (
        !typeof inputValue === 'string' ||
        !(inputValue.trim() || Object.keys(selectedItems).length > 0)
    )
        return

    let threadId = localStorage.getItem('thread_id') ?? null // 로컬스토리지에서 값 가져오기
    try {
        if (threadId) {
            threadId = threadId.trim().replace(/"/g, '') // 앞뒤 공백 및 쌍따옴표 제거
        }

        const requestBody = {
            user_input: inputValue,
            tags: selectedItems,
            thread_id: threadId,
        }

        localStorage.setItem('content', inputValue)

        // API 요청
        const response = await fetch(`${Config.baseURL}/api/generate`, {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(requestBody),
        })
        useRetrieveClassicLiteratureStore.getState().setRetrievedLiterature('') //초기화
        useRetrieveClassicLiteratureStore.getState().setRetrievedLiteratureTitle('') //초기화

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()

            const decodedChunk = decoder.decode(value, { stream: true })
            if (decodedChunk) {
                try {
                    if (typeof decodedChunk !== 'string') {
                        console.log('decodedChunk is not string')
                        continue
                    }
                    const beforeData = removeLeadingData(decodedChunk)
                    let afterData = remmoveBackslash(beforeData)

                    //응답데이터가 이중으로 날아온 경우 예외처리
                    if (afterData.indexOf('data:') > -1) {
                        // data: 로 배열로 쪼개기
                        // debugger
                        const dataArray = afterData.split('data:')
                        //{"msg": "expanding", "content": "."} 데이터 형태로 content 에 dataArray 의 content 값이 합쳐져서 들어감.
                        console.log('data:가 포함된 데이터:', dataArray)
                        const newObj = {
                            msg: 'expanding',
                            content: '',
                        }
                        dataArray.forEach((data) => {
                            const parsedContent = JSON.parse(data.replace(/\n\n/g, ''))
                            newObj.content += parsedContent.content
                        })
                        console.log('data:가 포함된 데이터:', newObj)

                        afterData = newObj
                    }
                    const cleanData = parseNestedJSON(afterData)

                    if (cleanData?.thread_id && cleanData?.conversation_id) {
                        console.log('DATA is LAST. ------\n', cleanData)
                        //title 에서 특수문자를 제거한 값을 입력
                        const createdTitle = cleanData?.result?.created_title ?? ''
                        const parsedTitle = createdTitle.replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g, '')

                        //title 값 세팅
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .setRetrievedLiteratureTitle(parsedTitle)

                        console.log('1️⃣.고전문학 제목::  ', parsedTitle)

                        //ThreadId 와 ConversationId 값 세팅
                        const newThreadId = cleanData?.thread_id ?? 0 //number
                        const newConversationId = cleanData?.conversation_id ?? 0 //number

                        console.log(
                            '2️⃣.threadId, conversationId :  ',
                            newThreadId,
                            newConversationId,
                        )

                        //마지막 글자의 줄바꿈 제거
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .setRetrievedLiterature(
                                useRetrieveClassicLiteratureStore
                                    .getState()
                                    .retrievedLiterature.replace(/[\n\r]+$/, ''),
                            )

                        const param = {
                            inputValue,
                            selectedItems,
                            threadId: String(newThreadId),
                            conversationId: String(newConversationId),
                        }
                        console.log(`retrieveSimilarRecommendation_param: ${param}`)
                        return await retrieveSimilarRecommendation({
                            ...param,
                        })
                    }

                    if (
                        cleanData?.msg === 'expanding' &&
                        cleanData?.content &&
                        cleanData?.content.length >= 1
                    ) {
                        //store에 저장
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .appendLiterature(cleanData.content)
                    } else {
                        console.log('🅾 ExceptionCase Occured')
                    }
                } catch (error) {
                    console.error('Error:', error)
                }
            }

            if (done) break
        }
    } catch (error) {
        console.error('🚨 [API 요청 중 오류 발생]: ', error.message)
    } finally {
        console.log('🅰 finally --- retrieveClassicalLiteratureWithVaiv')
        useRetrieveClassicLiteratureStore.getState().updateIsGenerating(false) //isLoading 종료
    }
}

/**
 * @description 유사한 글, 추천글 조회
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @param {String} threadId
 * @param {String} conversationId
 * @returns {Object} newSimilarText, newRecommendation
 */
export const retrieveSimilarRecommendation = async ({
    inputValue = '',
    selectedItems = {},
    threadId,
    conversationId,
}) => {
    const requestBody = {
        user_input: inputValue,
        tags: selectedItems,
        thread_id: threadId,
        conversation_id: conversationId,
        user_id: 1,
    }

    console.log(JSON.stringify(requestBody))

    // API 요청
    const response = await fetch(`${Config.baseURL}/api/search`, {
        method: 'POST',
        headers: Config.headers,
        body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ [API Error (${response.status})]:`, errorText)
        throw new Error(`API Error (${response.status}): ${errorText}`)
    }

    //유사한글, 추천글 값 처리
    const jsonResponse = await response.json()
    const parsedResponse = parseNestedJSON(jsonResponse)
    console.log('✅ [API 응답 데이터]:', parsedResponse)

    //thread_id 값 처리, 유사한 글, 추천 글 처리
    if (parsedResponse?.result) {
        console.log('-------------- 끝난데이터 --------------')

        //유사한글(Object)
        const newSimilarText = {
            similar_1: parsedResponse.result.similar_1,
            similar_2: parsedResponse.result.similar_2,
            similar_3: parsedResponse.result.similar_3,
        }

        //추천글(String)
        const newRecommendation = {
            recommended_1: parsedResponse.result.recommended_1,
            recommended_2: parsedResponse.result.recommended_2,
            recommended_3: parsedResponse.result.recommended_3,
        }

        console.log(newSimilarText)
        console.log(newRecommendation)

        return { newSimilarText, newRecommendation }
    } else {
        throw new Error('유사한글, 추천글 조회 에러: result 값이 없음.')
    }
}

// ""와 줄바꿈을 제외한 모든 내용 화면에 정상적으로 노출 될 수 있도록 처리
const remmoveBackslash = (str) => str.replace(/\\(?![n\r"])/g, '')

//중첩 JSON 파싱
const parseNestedJSON = (jsonString) => {
    let result = jsonString
    while (typeof result === 'string') {
        try {
            result = JSON.parse(result)
        } catch (e) {
            break
        }
    }
    return result
}

//"data:" 제거
const removeLeadingData = (str) => {
    if (str.startsWith(',data:')) {
        return str.slice(str.indexOf(':') + 1).trim()
    }
    if (str.startsWith('data:')) {
        return str.slice(str.indexOf(':') + 1).trim()
    }
    return str
}
