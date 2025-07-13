<template>
  <div class="student-detail-container">
    <div class="detail-cards">
      <!-- Thông tin cơ bản -->
      <div class="detail-card">
        <h2 class="card-title">Thông tin cơ bản</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">MSSV:</span>
            <span class="value">{{ studentInfo?.studentId }}</span>
          </div>

          <div class="info-item">
            <span class="label">Họ và tên:</span>
            <span class="value">{{ studentInfo?.fullName }}</span>
          </div>

          <div class="info-item">
            <span class="label">Ngày sinh:</span>
            <span class="value">{{ formatDate(studentInfo?.birthDate) }}</span>
          </div>

          <div class="info-item">
            <span class="label">Giới tính:</span>
            <span class="value">{{ studentInfo?.gender }}</span>
          </div>

          <div class="info-item">
            <span class="label">Số điện thoại:</span>
            <span class="value">{{ studentInfo?.phone }}</span>
          </div>

          <div class="info-item">
            <span class="label">Địa chỉ:</span>
            <span class="value">{{ studentInfo?.address }}</span>
          </div>

          <div class="info-item">
            <span class="label">Lớp:</span>
            <span class="value">{{ studentInfo?.class }}</span>
          </div>
        </div>
      </div>

      <!-- Thông tin học tập -->
      <div class="detail-card">
        <h2 class="card-title">Thông tin học tập</h2>
        <div class="academic-info-content">
          <div class="credit-info">
            <div class="info-item">
              <span class="label">Số tín chỉ tích lũy:</span>
              <div class="credit-display">
                <span class="credit-value">{{ studentInfo?.sumCredit || 0 }}</span>
                <span class="credit-separator">/</span>
                <span class="credit-total">158</span>
                <span class="credit-unit">tín chỉ</span>
              </div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress"
                  :style="{
                    width: `${((studentInfo?.sumCredit || 0) / 158) * 100}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="info-item">
            <span class="label">CPA:</span>
            <span class="value">{{ studentInfo?.cpa || 0 }}</span>
          </div>

          <div class="info-item">
            <span class="label">Trạng thái:</span>
            <span class="value" :class="getStatusClass(studentInfo?.status)">
              {{ studentInfo?.status || 'Không' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentStore } from '@/stores/student'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const studentInfo = ref(null)

// Lấy thông tin sinh viên
onMounted(async () => {
  try {
    const user = authStore.user
    if (user?.studentId) {
      const student = await studentStore.getStudentByStudentId(user.studentId)
      if (student) {
        studentInfo.value = student
      } else {
        ElMessage.error('Không tìm thấy thông tin sinh viên')
      }
    } else {
      ElMessage.error('Không có mã số sinh viên')
    }
  } catch (error) {
    console.error('Error loading student info:', error)
    ElMessage.error('Không thể tải thông tin sinh viên')
  }
})

// Format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Lấy class tương ứng với trạng thái
const getStatusClass = (status) => {
  switch (status) {
    case 'Cảnh báo mức 1':
      return 'status-success'
    case 'Cảnh báo mức 2':
      return 'status-warning'
    case 'Cảnh báo mức 3':
      return 'status-danger'
    default:
      return ''
  }
}
</script>

<style scoped>
.student-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.detail-cards {
  display: grid;
  gap: 20px;
}

.detail-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  min-width: 150px;
  color: #666;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  flex: 1;
}

.academic-info-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.credit-info {
  margin-bottom: 10px;
}

.credit-display {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1.1rem;
}

.credit-value {
  font-weight: 600;
  color: #1976d2;
}

.credit-separator {
  color: #666;
}

.credit-total {
  font-weight: 500;
  color: #666;
}

.credit-unit {
  color: #666;
  font-size: 0.9rem;
  margin-left: 4px;
}

.progress-container {
  margin-top: 8px;
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #1976d2;
  transition: width 0.3s ease;
}

.status-success {
  color: #4caf50;
}

.status-warning {
  color: #ff9800;
}

.status-danger {
  color: #f44336;
}
</style> 