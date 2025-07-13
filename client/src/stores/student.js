import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiInstance } from './auth'

export const useStudentStore = defineStore('student', () => {
  const students = ref([]) //Danh sách sinh viên
  const loading = ref(false) // Trạng thái loading
  const error = ref(null) // Lỗi

// Reset lỗi
  const resetError = () => {
    error.value = null
  } 
// Lấy danh sách sinh viên từ API
  const fetchStudents = async () => {
    resetError()
    loading.value = true
    try {
      const response = await apiInstance.get('/students')
      students.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

// Thêm sinh viên 
  const addStudent = async (student) => {
    resetError()
    loading.value = true
    try {
      const response = await apiInstance.post('/students', student)
      students.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

// Cập nhật thông tin sinh viên
  const updateStudent = async (id, studentData) => {
    resetError()
    loading.value = true
    try {
      const response = await apiInstance.put(`/students/${id}`, studentData)
      const index = students.value.findIndex(s => s._id === id)
      if (index !== -1) {
        students.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

// Xóa sinh viên 
  const deleteStudent = async (id) => {
    resetError()
    loading.value = true
    try {
      await apiInstance.delete(`/students/${id}`)
      students.value = students.value.filter(student => student._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

// Lấy thông tin sinh viên theo ID
  const getStudentById = async (id) => {
    resetError()
    loading.value = true
    try {
      const response = await apiInstance.get(`/students/${id}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

// Lấy thông tin sinh viên theo mã sinh viên
  const getStudentByStudentId = async (studentId) => {
    resetError()
    loading.value = true
    try {
      const response = await apiInstance.get(`/students/by-student-id/${studentId}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    resetError,
    getStudentById,
    getStudentByStudentId
  }
})