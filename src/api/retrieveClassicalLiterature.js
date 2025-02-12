import Config from '../util/config'
import { isOnlyKoreanOrNumbers } from '../util/util'
import translateForiegnLang from './translateForiegnLang'

/**
 * @description 고전문학 내용을 생성하는 ai api 호출
 * @param {String} inputValue
 * @param {Array} selectedItems
 * @returns {Array} ragResult, fineTuningResult
 */
export const retrieveClassicalLiterature = async ({
  inputValue,
  selectedItems,
}) => {
  console.log('retrieveClassicalLiterature:', inputValue, selectedItems)
  if (
    typeof inputValue === 'string' &&
    (inputValue.trim() || Object.keys(selectedItems).length > 0)
  ) {
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

      //외국어 제목인 경우 번역 요청
      // ragResult.map(async (item) => {
      //   if (item?.content?.작품명) {
      //     //한국어 (+or숫자검증)
      //     if (!isOnlyKoreanOrNumbers(item.content.작품명)) {
      //       item.content.작품명 = await translateForiegnLang(
      //         item.content.작품명,
      //       )
      //     }
      //   }

      //   return item
      // })

      // 로컬스토리지에 저장
      localStorage.setItem('ragResult', JSON.stringify(ragResult))
      localStorage.setItem('fineTuningResult', JSON.stringify(fineTuningResult))

      return { ragResult, ...fineTuningResult }
    } catch (error) {
      console.error('Error during API requests:', error)
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

  const pTitle = similarText?.title || '제목 없음'

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

    console.log(data)

    return data
  } catch (error) {
    console.error('Error fetching analysis:', error)
  }
}
