// import axios from 'axios'
// import OpenAI from 'openai/index.mjs'
// const openai = new OpenAI()

// /**
//  * @description ChatGPT 에 값 전달하여 번역처리하기
//  * @param {String} text 번역할 값
//  */
// const translateForiegnLang = async (text) => {
//   console.log('translateForiegnLang')

//   if (!text) return

//   const apiUrl = 'https://api.openai.com/v1/chat/completions'
//   const preContext = ' 한국어로 번역해줘. 답변만. 마지막에 온점 찍지 말고'

//   const header = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${process.env.REACT_APP_GPT_API_KEY}`,
//   }

//   const body = {
//     model: 'gpt-3.5-turbo',
//     messages: { role: 'user', content: text + preContext },
//     temperature: 0.7,
//   }
//   try {
//     const result = await openai.chat.completions.create({
//       model: 'gpt-4o-mini',
//       messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         {
//           role: 'user',
//           content: text + preContext,
//         },
//       ],
//       store: true,
//     })

//     console.log(result)
//   } catch (error) {
//     console.error(error)
//   }
// }

// export default translateForiegnLang
