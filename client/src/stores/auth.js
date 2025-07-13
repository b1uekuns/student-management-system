import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Xác thực người dùng
export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const loading = ref(false)
  const error = ref(null)

  const setAuthHeader = (token) => {
    if (token) {
      apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete apiInstance.defaults.headers.common['Authorization']
    }
  }

  if (token.value) {
    setAuthHeader(token.value)
  }

// Hàm đăng nhập
  const login = async (username, password) => {
    loading.value = true
    error.value = null
    try {
      // Gửi yêu cầu đăng nhập
      const response = await apiInstance.post('/auth/login', {
        username,
        password
      })

      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      setAuthHeader(token.value)

      return user.value.role // Trả về vai trò của người dùng
    } catch (err) {
      error.value = err.response?.data?.message || 'Có lỗi xảy ra'
      throw error.value
    } finally {
      loading.value = false
    }
  }

// Hàm đăng xuất
  const logout = () => {
    token.value = null
    user.value = null 
    localStorage.removeItem('token') 
    localStorage.removeItem('user')
    setAuthHeader(null) 
  }

  return {
    token,
    user,
    loading,
    error,
    login,
    logout
  }
})