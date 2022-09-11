import axios from 'axios'

const request = axios.create({
  timeout: 30000
})

request.interceptors.response.use(
  res => ({ status: res.status, data: res.data }),
  () => ({ status: -1, data: null })
)

export default request
