<template>
  <div class="student-detail-container">
    <div class="detail-cards">
      <!-- Thông tin cơ bản -->
      <div class="detail-card">
        <h2 class="card-title">Thông tin cơ bản</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">MSSV:</span>
            <span class="value">{{ student?.studentId }}</span>
          </div>

          <div class="info-item">
            <span class="label">Họ và tên:</span>
            <span class="value">{{ student?.fullName }}</span>
          </div>

          <div class="info-item">
            <span class="label">Ngày sinh:</span>
            <span class="value">{{ formatDate(student?.birthDate) }}</span>
          </div>

          <div class="info-item">
            <span class="label">Giới tính:</span>
            <span class="value">{{ student?.gender }}</span>
          </div>

          <div class="info-item">
            <span class="label">Số điện thoại:</span>
            <span class="value">{{ student?.phone }}</span>
          </div>

          <div class="info-item">
            <span class="label">Địa chỉ:</span>
            <span class="value">{{ student?.address }}</span>
          </div>

          <div class="info-item">
            <span class="label">Lớp:</span>
            <span class="value">{{ student?.class }}</span>
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
                <span class="credit-value">{{ student?.sumCredit || 0 }}</span>
                <span class="credit-separator">/</span>
                <span class="credit-total">132</span>
                <span class="credit-unit">tín chỉ</span>
              </div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress"
                  :style="{
                    width: `${((student?.sumCredit || 0) / 132) * 100}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="info-item">
            <span class="label">CPA:</span>
            <span class="value">{{ student?.cpa || 0 }}</span>
          </div>

          <div class="info-item">
            <span class="label">Trạng thái:</span>
            <span class="value" :class="getStatusClass(student?.status)">
              {{ student?.status || 'Không' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Các nút hành động -->
    <div class="action-buttons">
      <button class="btn btn-back" @click="router.push('/teacher/students')">
        <i class="fas fa-arrow-left"></i>
        Quay lại
      </button>
      <button v-if="!isEditing" class="btn btn-edit" @click="startEdit">
        <i class="fas fa-edit"></i>
        Chỉnh sửa
      </button>
    </div>

    <el-dialog
      v-model="isEditing"
      title="Chỉnh sửa thông tin sinh viên"
      width="50%"
    >
      <el-form ref="formRef" :model="editedStudent" :rules="rules">
        <el-form-item label="MSSV" prop="studentId">
          <el-input v-model="editedStudent.studentId" />
        </el-form-item>
        
        <el-form-item label="Họ và tên" prop="fullName">
          <el-input v-model="editedStudent.fullName" />
        </el-form-item>

        <el-form-item label="Ngày sinh" prop="birthDate">
          <el-date-picker v-model="editedStudent.birthDate" type="date" />
        </el-form-item>

        <el-form-item label="Giới tính" prop="gender">
          <el-select v-model="editedStudent.gender">
            <el-option label="Nam" value="Nam" />
            <el-option label="Nữ" value="Nữ" />
          </el-select>
        </el-form-item>

        <el-form-item label="Số điện thoại" prop="phone">
          <el-input v-model="editedStudent.phone" />
        </el-form-item>

        <el-form-item label="Địa chỉ" prop="address">
          <el-input v-model="editedStudent.address" />
        </el-form-item>

        <el-form-item label="Lớp" prop="class">
          <el-input v-model="editedStudent.class" />
        </el-form-item>

        <el-form-item label="Số tín chỉ" prop="sumCredit">
          <el-input-number 
            v-model="editedStudent.sumCredit"
            :min="0"
            :max="132"
          />
        </el-form-item>

        <el-form-item label="CPA" prop="cpa">
          <el-input-number 
            v-model="editedStudent.cpa"
            :min="0"
            :max="4.0"
            :precision="1"
            :step="0.1"
          />
        </el-form-item>

        <el-form-item label="Trạng thái" prop="status">
          <el-select v-model="editedStudent.status">
            <el-option label="Không" value="Không" />
            <el-option label="Cảnh báo mức 1" value="Cảnh báo mức 1" />
            <el-option label="Cảnh báo mức 2" value="Cảnh báo mức 2" />
            <el-option label="Cảnh báo mức 3" value="Cảnh báo mức 3" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="cancelEdit">Hủy</el-button>
        <el-button type="primary" @click="validateAndSave">
          Lưu thay đổi
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const studentStore = useStudentStore()
const student = ref(null)
const editedStudent = ref(null)
const isEditing = ref(false)

// Lấy thông tin sinh viên
onMounted(async () => {
  try {
    const id = route.params.id
    student.value = await studentStore.getStudentById(id)
    
    if (!student.value) {
      ElMessage.error('Không tìm thấy sinh viên')
      router.push('/teacher/students')
      return
    }
  } catch (error) {
    console.error('Error loading student:', error)
    ElMessage.error('Không thể tải thông tin sinh viên')
    router.push('/teacher/students')
  }
})

// Bắt đầu chỉnh sửa
const startEdit = () => {
  editedStudent.value = { ...student.value }
  isEditing.value = true
}

// Hủy chỉnh sửa
const cancelEdit = () => {
  if (confirm('Bạn có chắc muốn hủy các thay đổi?')) {
    editedStudent.value = null
    isEditing.value = false
  }
}

// Lưu thay đổi
const saveChanges = async () => {
  try {
    await studentStore.updateStudent(route.params.id, editedStudent.value)
    ElMessage.success('Cập nhật thành công')
    student.value = { ...editedStudent.value }
    isEditing.value = false
  } catch (error) {
    console.error('Error saving changes:', error)
    ElMessage.error('Không thể cập nhật thông tin sinh viên')
  }
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

// Format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Quy tắc kiểm tra form
const rules = {
  studentId: [
    { required: true, message: 'Vui lòng nhập MSSV' },
    { pattern: /^\d{8,}$/, message: 'MSSV phải có ít nhất 8 chữ số' }
  ],
  fullName: [
    { required: true, message: 'Vui lòng nhập họ tên' },
    { min: 3, message: 'Tên phải có ít nhất 3 ký tự' }
  ],
  phone: [
    { pattern: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' }
  ],
  class: [
    { required: true, message: 'Vui lòng nhập lớp' }
  ],
  sumCredit: [
    { required: true, message: 'Vui lòng nhập số tín chỉ' },
    { type: 'number', min: 0, max: 132, message: 'Số tín chỉ từ 0-132' }
  ],
  cpa: [
    { required: true, message: 'Vui lòng nhập CPA' },
    { type: 'number', min: 0, max: 4.0, message: 'CPA từ 0-4.0' }
  ]
}

const formRef = ref(null)

// Dữ liệu và lưu thay đổi
const validateAndSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    await saveChanges()
  } catch (error) {
    console.error('Validation error:', error)
    ElMessage.error('Vui lòng kiểm tra lại thông tin')
  }
}
</script>

<style scoped>
.student-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.card-title {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5rem;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.label {
  min-width: 150px;
  color: #666;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #2c3e50;
  margin-left: 20px;
}

.input-value {
  flex: 1;
  margin-left: 20px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-value:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 3px rgba(33, 150, 243, 0.3);
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
  color: #ffc107;
}

.status-danger {
  color: #f44336;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-back {
  background: #f44336;
  color: white;
}

.btn-edit {
  background: #4caf50;
  color: white;
}

.btn-save {
  background: #2196f3;
  color: white;
}

.btn-cancel {
  background: #9e9e9e;
  color: white;
}

.unit {
  margin-left: 5px;
  color: #666;
}

select.input-value {
  background-color: white;
}
</style> 