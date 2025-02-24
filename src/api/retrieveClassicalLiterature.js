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
    let conversationId = '' // 대화 ID
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
        const response = await fetch(`${Config.baseURL}/api/generateWithSearch`, {
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
                    const beforeData = removeLeadingData(decodeUnicodeString(decodedChunk))
                    const afterData = remmoveBackslash(
                        removeFirstAndLastQuotes(decodeUnicodeString(beforeData)),
                    )
                    //thread_id, conversation_id 추출
                    if (afterData.indexOf('thread_id') > -1) {
                        console.log('Title added.')
                        //title 추출
                        const createdTitle = afterData.indexOf('"created_title":')
                        const createdTitlePart = afterData.slice(createdTitle)
                        const createdTitleMatch = createdTitlePart.match(
                            /"created_title":\s*"(.+?)"/,
                        )
                        const createdTitleValue = createdTitleMatch[1]

                        useRetrieveClassicLiteratureStore
                            .getState()
                            .setRetrievedLiteratureTitle(createdTitleValue ?? '')

                        console.log(
                            useRetrieveClassicLiteratureStore.getState().retrievedLiteratureTitle,
                        )

                        // thread_id를 기준으로 문자열 자르기
                        const threadIdIndex = afterData.indexOf('"thread_id":')
                        const threadIdPart = afterData.slice(threadIdIndex)

                        // thread_id와 conversation_id 추출
                        const threadIdMatch = threadIdPart.match(/"thread_id":\s*(\d+)/)
                        const conversationIdMatch = threadIdPart.match(/"conversation_id":\s*(\d+)/)

                        threadId = parseNestedJSON(threadIdMatch[0])?.split(':')[1].trim()
                        conversationId = parseNestedJSON(conversationIdMatch[0])
                            ?.split(':')[1]
                            .trim()
                        console.log(`threadId, conversationId::  `, threadId, conversationId)

                        //마지막 글자의 줄바꿈 제거
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .setRetrievedLiterature(
                                useRetrieveClassicLiteratureStore
                                    .getState()
                                    .retrievedLiterature.replace(/[\n\r]+$/, ''),
                            )

                        return await retrieveSimilarRecommendation({
                            inputValue,
                            selectedItems,
                            threadId,
                            conversationId,
                        })
                    }

                    const cleanData = parseNestedJSON(afterData)
                    // console.log(JSON.stringify(cleanData))
                    if (
                        cleanData?.msg === 'process_generating' &&
                        cleanData?.output?.data[0][0] &&
                        cleanData?.output?.data[0][0].length >= 1
                    ) {
                        if (cleanData?.output?.data[0][0][0] === 'append')
                            //store에 저장
                            useRetrieveClassicLiteratureStore
                                .getState()
                                .appendLiterature(
                                    cleanData.output.data[0][0][2].replace(/\\n/g, '\n'),
                                )
                    } else if (cleanData?.msg === 'process_completed') {
                        console.log('process_completed')

                        //title 값 입력
                    } else if (cleanData?.result || cleanData?.thread_id) {
                        console.log('result')
                        console.log(cleanData.result)
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

// 백슬래시를 제거하되 줄바꿈은 유지
const remmoveBackslash = (str) => str.replace(/\\(?![n\r])/g, '').replace(/""/g, '"')

// 줄바꿈 관련 처리 제거
const removeFirstAndLastQuotes = (str) =>
    str
        .replace(/"{/g, '{')
        .replace(/}"/g, '}')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\t/g, '\\t')

//유니코드 문자열 디코딩
const decodeUnicodeString = (str) =>
    str.replace(/u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))

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
    if (result?.content && typeof result?.content === 'string') {
        result.content = JSON.parse(result.content)
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
