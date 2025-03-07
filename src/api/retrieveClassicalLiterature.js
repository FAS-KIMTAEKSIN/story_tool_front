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
        typeof inputValue !== 'string' ||
        !(inputValue.trim() || Object.keys(selectedItems).length > 0)
    ) {
        alert('내용을 입력하거나 태그를 선택해주세요.')
        return
    }

    try {
        let threadId = localStorage.getItem('thread_id') // 로컬스토리지에서 값 가져오기
        threadId = threadId ? threadId.trim().replace(/"/g, '') : null // 앞뒤 공백 및 쌍따옴표 제거

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

        return jsonResponse
    } catch (error) {
        console.error('🚨 [API 요청 중 오류 발생]:', error)
        alert(`요청 처리 중 오류가 발생했습니다: ${error.message}`)
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
                threadId: localStorage.getItem('thread_id') ?? null,
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
export const retrieveClassicalLiteratureWithVaiv = async ({ inputValue = '', selectedItems }) => {
    // 입력값 검증
    if (
        typeof inputValue !== 'string' ||
        !(inputValue.trim() || Object.keys(selectedItems).length > 0)
    ) {
        return
    }

    // isStopped 상태가 true일 경우, AbortController를 null로 설정
    if (useRetrieveClassicLiteratureStore.getState().isStopped) {
        useRetrieveClassicLiteratureStore.getState().setAbortController(null) // AbortController 초기화
        useRetrieveClassicLiteratureStore.getState().setIsStopped(false) // isStopped 상태 초기화
    }
    useRetrieveClassicLiteratureStore.getState().setBeforeTextInput(inputValue) // 이전 입력값 저장

    // 새로운 AbortController 인스턴스 생성
    const abortController = new AbortController()
    useRetrieveClassicLiteratureStore.getState().setAbortController(abortController)
    useRetrieveClassicLiteratureStore.getState().updateIsGenerating(true) //isLoading

    let similarRecommendationResult = null
    let threadId = localStorage.getItem('thread_id') ?? null

    if (threadId) {
        threadId = threadId.trim().replace(/"/g, '') // 앞뒤 공백 및 쌍따옴표 제거
    }

    const callSimilarRecommendation = async (cleanData) => {
        console.log('callSimilarRecommendation \n', cleanData)

        //title 에서 특수문자를 제거한 값을 입력
        const createdTitle = cleanData?.result?.created_title ?? ''
        const parsedTitle = createdTitle.replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g, '')

        //title 값 세팅
        useRetrieveClassicLiteratureStore.getState().setRetrievedLiteratureTitle(parsedTitle)

        console.log('1️⃣.고전문학 제목::  ', parsedTitle)

        //ThreadId 와 ConversationId 값 세팅
        const newThreadId = cleanData?.thread_id ?? 0 //number
        const newConversationId = cleanData?.conversation_id ?? 0 //number

        console.log('2️⃣.threadId, conversationId :  ', newThreadId, newConversationId)

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

    try {
        const requestBody = {
            user_input: inputValue,
            tags: selectedItems,
            thread_id: threadId,
        }

        localStorage.setItem('content', inputValue)

        // API 요청에 signal 추가
        const response = await fetch(`${Config.baseURL}/api/generate`, {
            method: 'POST',
            headers: Config.headers,
            body: JSON.stringify(requestBody),
            signal: useRetrieveClassicLiteratureStore.getState().abortController.signal, // AbortController의 signal 추가
        })

        useRetrieveClassicLiteratureStore.getState().setRetrievedLiterature('') //초기화
        useRetrieveClassicLiteratureStore.getState().setRetrievedLiteratureTitle('') //초기화

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = '' //네트워크 속도 문제로 추가

        while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value, { stream: true })

            buffer += chunk
            let isDataEnd = false

            // Check if the buffer ends with a complete JSON object
            if (buffer.trim().endsWith('}')) {
                isDataEnd = true
            }

            if (!isDataEnd) {
                continue
            }
            const decodedChunk = buffer
            buffer = ''

            if (decodedChunk) {
                try {
                    if (typeof decodedChunk !== 'string') {
                        console.log('decodedChunk is not string')
                        continue
                    }
                    const beforeData = removeLeadingData(decodedChunk) //String
                    let afterData = remmoveBackslash(beforeData) //String

                    if (afterData.indexOf('"status": "generating"') > -1) {
                        console.log('🔄 데이터 생성 시작.', afterData)
                        continue
                    } else if (afterData.indexOf('base_story_completed') > -1) {
                        console.log('0️⃣ 기본 컨텐츠 생성이 완료되었습니다.', afterData)
                        continue
                    }

                    //응답데이터가 이중으로 날아온 경우 예외처리
                    if (afterData.indexOf('data:') > -1) {
                        const dataArray = afterData.split('data:') // data: 로 배열로 쪼개기
                        //{"msg": "expanding", "content": "."} 데이터 형태로 content 에 dataArray 의 content 값이 합쳐져서 들어감.
                        const newObj = {
                            msg: 'expanding',
                            content: '',
                        }
                        dataArray.forEach((data) => {
                            //JSON pasing 이 정상적으로 된 경우에만 content 에 추가
                            const parsedContent = parseNestedJSON(data.replace(/\n\n/g, ''))

                            if (typeof parsedContent !== 'string') {
                                console.log(`[중첩 데이터]: ${parsedContent.content}`)
                                newObj.content += parsedContent.content
                            } else {
                                console.log(
                                    `🅰중첩 데이터가 정상적으로 파싱 되지 않아 다시 data로 나눕니다.\n`,
                                    parsedContent,
                                )

                                parsedContent.split('data:').forEach(async (data) => {
                                    if (data.indexOf('thread_id') > -1) {
                                        console.log(
                                            '🅰중첩 데이터 thread_id, conversation_id 처리\n',
                                            data,
                                        )
                                        const parsedLastData = parseNestedJSON(data)

                                        //마지막 데이터를 parsing 정상적으로 처리되었을 경우
                                        if (typeof parsedLastData !== 'string') {
                                            console.log(
                                                '🅱 정상적으로 파싱되었습니다 \n',
                                                parsedLastData,
                                            )
                                            return await callSimilarRecommendation(parsedLastData)
                                        }
                                    }
                                    //마지막 데이터가 아닌 경우 다시 newObj.content 에 추가
                                    else {
                                        data = parseNestedJSON(data)
                                        newObj.content += data.content
                                    }
                                })
                            }
                        })

                        afterData = newObj
                    }

                    //cleanData JSONparsing
                    let cleanData = parseNestedJSON(afterData)

                    if (cleanData?.success && cleanData?.thread_id && cleanData?.conversation_id) {
                        console.log('DATA is LAST. ------')
                        similarRecommendationResult = await callSimilarRecommendation(cleanData)
                        break // while문 빠져나가기
                    } else if (cleanData?.thread_id && cleanData?.conversation_id) {
                        //threadId, conversationId 저장, 정지시 사용
                        console.log('save threadId, conversationId', cleanData)
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .setConversationId(cleanData.conversation_id)
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .setThreadId(cleanData.thread_id)
                    }

                    //1. 정상케이스
                    //2. 마지막 데이터가 중첩되어져서 나올 경우
                    //3. 그 외 미확인 혹은 미사용 데이터가 나오는 경우

                    if (
                        cleanData?.msg === 'expanding' &&
                        cleanData?.content &&
                        cleanData?.content.length >= 1
                    ) {
                        console.log('[Append]. ', cleanData.content)
                        //store에 저장
                        useRetrieveClassicLiteratureStore
                            .getState()
                            .appendLiterature(cleanData.content)
                    } else if (typeof cleanData === 'string') {
                        //중첩 데이터가 정상적으로 파싱 되지 않아 String 형태일때 (마지막-1 + 마지막 데이터 )
                        if (cleanData.indexOf('data:') > -1) {
                        }
                    } else if (cleanData?.msg === 'completion_pending') {
                        console.log('🔄 마지막 데이터 로딩 중...')
                    } else {
                        if (cleanData?.created_content && cleanData?.created_title) {
                            console.log(
                                '✅ 제목과 컨텐츠 내용은 다음 데이터에서 가져옵니다.\n',
                                cleanData,
                            )
                        } else {
                            console.info('❌ [REAL Exception]\n', cleanData)
                        }
                    }
                } catch (error) {
                    console.error('Error:', error)
                }
            }
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('스트리밍이 중단되었습니다.')
            useRetrieveClassicLiteratureStore
                .getState()
                .appendLiterature('\n생성이 중단되었습니다.')
        } else {
            console.error('🚨 [API 요청 중 오류 발생]: ', error.message)
        }
    } finally {
        console.log('🅰 finally --- retrieveClassicalLiteratureWithVaiv')
        useRetrieveClassicLiteratureStore.getState().updateIsGenerating(false) //isLoading 종료
    }

    return similarRecommendationResult // 결과 반환
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

        //로컬스토리지에 conversationId, threadId 저장 > 추가 로직 시 필요
        localStorage.setItem('conversation_id', conversationId)
        localStorage.setItem('thread_id', threadId)

        return { newSimilarText, newRecommendation }
    } else {
        throw new Error('유사한글, 추천글 조회 에러: result 값이 없음.')
    }
}

/**
 * @description 문학 생성 중단
 * @returns {Object}
 */
export const cancelGeneration = async () => {
    const store = useRetrieveClassicLiteratureStore.getState()

    const threadId = store.threadId
    const conversationId = store.conversationId

    console.log('cancelGeneration', threadId, conversationId)

    const requestBody = {
        thread_id: threadId,
        conversation_id: conversationId,
    }

    const response = await fetch(`${Config.baseURL}/api/cancelGeneration`, {
        method: 'POST',
        headers: Config.headers,
        body: JSON.stringify(requestBody),
    })
    console.log(response)

    if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ [API Error (${response.status})]:`, errorText)
        throw new Error(`API Error (${response.status}): ${errorText}`)
    }

    const jsonResponse = await response.json()
    console.log('✅ [API 응답 데이터]:', jsonResponse)

    //retrieveSimilarRecommendation 호출
    return await retrieveSimilarRecommendation({
        inputValue: jsonResponse?.user_input ?? '',
        selectedItems: jsonResponse?.tags ?? {},
        threadId: threadId,
        conversationId: conversationId,
    })
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
    if (str.startsWith('data: ')) {
        return str.slice(str.indexOf(':') + 1).trim()
    }
    return str
}
