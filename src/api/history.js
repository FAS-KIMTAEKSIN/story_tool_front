import Config from '../util/config'

export const retrieveChatHistoryList = async ({ user_id }) => {
    try {
        const response = await fetch(`${Config.baseURL}/api/retrieveChatHistoryList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id }),
        })

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ 히스토리 리스트 응답:\n', data)

        return data
    } catch (error) {
        console.error('❌ 히스토리 리스트 불러오는 중 오류 발생:', error)
    } finally {
        console.log('히스토리 리스트 요청 완료')
    }
}

/**
 * @description 쓰레기 삭제
 * @param {Number} thread_id
 */
export const deleteThread = async (chat) => {
    if (!chat?.thread_id) {
        console.error('❌ 쓰레드 아이디가 없습니다.')
        return
    }

    try {
        const thread_id = chat.thread_id
        const response = await fetch(`${Config.baseURL}/api/deleteThread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: 1, thread_id }),
        })

        if (!response.ok) {
            throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('✅ 히스토리 삭제 응답:\n', data)

        return data
    } catch (error) {
        console.error('❌ 히스토리 삭제 중 오류 발생:', error)
    } finally {
        console.log('히스토리 삭제 요청 완료')
    }
}
