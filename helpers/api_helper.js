//nvm install v18.15.0
import axios from "axios"
const API_URL = "https://darkblue-ape-166776.hostingersite.com/api"
// const API_URL = "http://localhost:4000/api"
// const API_URL = `https://apis.fieldkonnect.io/api`
import { getAuthToken } from "./authHelper"
const axiosApi = axios.create({
  baseURL: API_URL,
})
axiosApi.interceptors.request.use(async function (config) {
  const token = await getAuthToken();
  config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGY2ZGM0MDJiYmE4ZDY1MDlhYWMzNzciLCJmaXJzdE5hbWUiOiJHYWplbmRyYSIsImxhc3ROYW1lIjoiUmFqcHV0IiwicGhvbmVDb2RlIjoiKzkxIiwibW9iaWxlIjo5NzEzMTEzMjgwLCJlbWFpbCI6ImdhamVuZHJhQGdyZXltZXRyZS5pbyIsInVzZXJUeXBlIjoiQWRtaW4iLCJjYXRlZ29yaWVzIjpbIjY0MTQzZjQ2ZmY0YWRkNWUwMjBlNjZkNyIsIjY0MTQzZjQ2ZmY0YWRkNWUwMjBlNjZkOCIsIjY0MTQzZjQ2ZmY0YWRkNWUwMjBlNjZkOSJdLCJpYXQiOjE3NzY1MTE2MzYsImV4cCI6MTgwODA0NzYzNn0.TBvTlySHa_0S9_1bMqZuLlhLnQc7KcXLp_CSMSRUqG4`;
  return config;
});

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}

export async function getBaseUrl() {
  return await API_URL
}

export async function submitFormData(url, data, method) {
  const authToken = await getAuthToken();
  const token2 = authToken ? JSON.parse(authToken) : ''
  return await axios({
    method: method,
    url: API_URL+url,
    data: data,
    headers: {
      'Content-Type': `multipart/form-data;`,
      'Authorization': `Bearer ${token2}`
    },
  }).then(response => response.data)
}


