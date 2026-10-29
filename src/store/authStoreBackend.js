import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import backendService from '../services/backendService'

export const useAuthStoreBackend = defineStore('authBackend', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken') || null)
  const isAuthenticated = computed(() => !!token.value)
  const loading = ref(false)
  const error = ref(null)

  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await backendService.register(userData)
      user.value = response.user
      token.value = response.token
      backendService.connectSocket()
      return response
    } catch (err) {
      error.value = err.message || 'Error en registro'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await backendService.login(email, password)
      user.value = response.user
      token.value = response.token
      backendService.connectSocket()
      return response
    } catch (err) {
      error.value = err.message || 'Error en login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    backendService.logout()
  }

  const getProfile = async () => {
    try {
      const profile = await backendService.getProfile()
      user.value = profile
      return profile
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await backendService.updateProfile(userData)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    updateProfile
  }
})
