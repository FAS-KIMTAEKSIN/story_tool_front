import Config from '../../util/config'

/**
 * @description 채팅 옵션 업데이트
 * @returns
 */
const updateChatOptions = async () => {
  try {
    // const response = await fetch(`${Config.baseURL}/api/chat-options`, {
    //   method: 'POST',
    //   headers: Config.headers,
    //   body: JSON.stringify({}),
    // })
    const response = {}

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Chat Options Update Error (${response.status}): ${errorText}`,
      )
    }
    return await response.json()
  } catch (error) {
    console.error('Error during Chat Options Update:', error)
    throw error
  }
}

export { updateChatOptions }
