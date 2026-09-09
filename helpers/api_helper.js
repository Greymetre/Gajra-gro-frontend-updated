//nvm install v18.15.0
import axios from "axios"
import { getValidAuthToken, removeAuthToken } from "./authHelper"

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://apis.fieldkonnect.io/api"

const axiosApi = axios.create({
  baseURL: API_URL,
})
axiosApi.interceptors.request.use(async function (config) {
  const token = getValidAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosApi.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) await removeAuthToken();
    return Promise.reject(error);
  }
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
  return axiosApi({
    method,
    url,
    data,
    headers: typeof FormData !== 'undefined' && data instanceof FormData
      ? {} : { 'Content-Type': 'multipart/form-data' },
  }).then(response => response.data)
}
