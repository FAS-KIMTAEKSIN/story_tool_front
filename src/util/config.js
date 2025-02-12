const Config = {
  // baseURL: "http://127.0.0.1:8001",
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

export default Config
