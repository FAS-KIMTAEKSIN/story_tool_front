/**
 * @description 한국어인지 아닌지 체크하는 로직
 * @param {String} text
 * @returns
 */
const isKoreanCharacterOrNumber = (char) => {
  const charCode = char.charCodeAt(0)
  return (
    (charCode >= 0xac00 && charCode <= 0xd7af) || // 완성된 한글 글자
    (charCode >= 0x1100 && charCode <= 0x11ff) || // 한글 자모
    (charCode >= 0x3130 && charCode <= 0x318f) || // 한글 호환 자모
    (charCode >= 0x30 && charCode <= 0x39) // 숫자 (0-9)
  )
}

const isOnlyKoreanOrNumbers = (text) => {
  if (!text) return true // 빈 문자열 처리

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char !== ' ' && !isKoreanCharacterOrNumber(char)) {
      // 공백은 허용
      return false // 한글, 숫자, 공백이 아닌 문자가 있으면 false
    }
  }
  return true // 모든 문자가 한글, 숫자, 공백이면 true
}

export { isOnlyKoreanOrNumbers }
