import Config from '../util/config'

/**
 * @description 고전문학 내용을 생성하는 ai api 호출
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @returns {Array} ragResult, fineTuningResult
 */
export const retrieveClassicalLiterature = async({ inputValue, selectedItems }) => {
    console.log('retrieveClassicalLiterature:\n', inputValue, "\n", selectedItems);

    if (
        typeof inputValue === 'string' &&
        (inputValue.trim() || Object.keys(selectedItems).length > 0)
    ) {
        try {
            let threadId = localStorage.getItem('thread_id'); // 로컬스토리지에서 값 가져오기

            if (threadId) {
                threadId = threadId.trim().replace(/"/g, ''); // 앞뒤 공백 및 쌍따옴표 제거
            } else {
                threadId = null; // 값이 없으면 null 설정
            }

            const requestBody = {
                user_input: inputValue,
                tags: selectedItems,
                thread_id: threadId
            };

            localStorage.setItem('content', inputValue);

            // API 요청
            const response = await fetch(`${Config.baseURL}/api/generateWithSearch`, {
                method: 'POST',
                headers: Config.headers,
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ [API Error (${response.status})]:`, errorText);
                throw new Error(`API Error (${response.status}): ${errorText}`);
            }

            const jsonResponse = await response.json();
            console.log('✅ [API 응답 데이터]:', jsonResponse);

            // 로컬스토리지에 저장
            localStorage.setItem('ragResult', JSON.stringify(jsonResponse.result));
            localStorage.setItem('fineTuningResult', JSON.stringify(jsonResponse.result));
            console.log(jsonResponse);
            return jsonResponse;
        } catch (error) {
            console.error('🚨 [API 요청 중 오류 발생]:', error);
            alert(`요청 처리 중 오류가 발생했습니다: ${error.message}`);
        }
    } else {
        alert('내용을 입력하거나 태그를 선택해주세요.');
    }
}

/**
 * @description 유사한 고전문학 내용분석 api 호출
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @returns {Array}
 */
export const retrieveAnalize = async(similarText) => {
    console.log('AI분석시작')

    const pTitle = similarText ? similarText.title : '제목 없음';

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