import Config from '../util/config.js'

export const handleCreate = async ({ inputValue, selectedItems }) => {
  if (inputValue.trim() || Object.keys(selectedItems).length > 0) {
    try {
      // 요청 데이터 구성
      const requestBody = {
        theme: inputValue,
        selectedTags: selectedItems,
      }

      localStorage.setItem('content', inputValue)

      // RAG API 호출
      const fetchFromRAG = async (requestBody) => {
        console.log('RAG API Request URL:', `${Config.baseURL}/api/search`)
        console.log(
          'RAG API Request Body:',
          JSON.stringify(requestBody, null, 2),
        ) // 보기 좋게 JSON 포맷팅
        const response = await fetch(`${Config.baseURL}/api/search`, {
          method: 'POST',
          headers: Config.headers,
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`RAG API Error (${response.status}): ${errorText}`)
        }
        return await response.json()
      }

      // Fine-tuning GPT 호출
      const fetchFromFineTuningGPT = async (requestBody) => {
        const response = await fetch(`${Config.baseURL}/api/generate`, {
          method: 'POST',
          headers: Config.headers,
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Fine-tuning API Error (${response.status}): ${errorText}`,
          )
        }
        return await response.json()
      }

      // 두 API 병렬 호출
      const [ragResult, fineTuningResult] = await Promise.all([
        fetchFromRAG(requestBody),
        fetchFromFineTuningGPT(requestBody),
      ])

      // 로컬스토리지에 저장
      localStorage.setItem('ragResult', JSON.stringify(ragResult))
      localStorage.setItem('fineTuningResult', JSON.stringify(fineTuningResult))
    } catch (error) {
      console.error('Error during API requests:', error)
      alert(`요청 처리 중 오류가 발생했습니다: ${error.message}`)
    }
  } else {
    alert('내용을 입력하거나 태그를 선택해주세요.')
  }
}
