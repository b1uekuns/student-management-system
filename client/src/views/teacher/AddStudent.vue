<template>
  <div class="add-student-container">
    <div class="header">
      <h1 class="page-title">Thêm sinh viên mới</h1>
    </div>
    <div class="form-container">
      <form @submit.prevent="addStudent">
        <div class="form-group">
          <label class="required">MSSV:</label>
          <input type="text" v-model="newStudent.studentId" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="required">Họ và tên:</label>
          <input type="text" v-model="newStudent.fullName" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="required">Ngày sinh:</label>
          <input type="date" v-model="newStudent.birthDate" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="required">Giới tính:</label>
          <select
            v-model="newStudent.gender"
            class="form-input"
            :class="{ placeholder: !newStudent.gender }"
            required
          >
            <option value="" disabled>--Select--</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div class="form-group">
          <label class="required">Số điện thoại:</label>
          <input type="text" v-model="newStudent.phone" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="required">Địa chỉ:</label>
          <input type="text" v-model="newStudent.address" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="required">Tổng số tín chỉ:</label>
          <input type="number" v-model.number="newStudent.sumCredit" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="required">CPA:</label>
          <input
            type="number"
            v-model.number="newStudent.cpa"
            step="0.1"
            min="0"
            max="4"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label class="required">Trạng thái:</label>
          <select
            v-model="newStudent.status"
            class="form-input"
            :class="{ placeholder: !newStudent.status }"
            required
          >
            <option value="" disabled>--Select--</option>
            <option value="Không">Không</option>
            <option value="Cảnh báo mức 1">Cảnh báo mức 1</option>
            <option value="Cảnh báo mức 2">Cảnh báo mức 2</option>
            <option value="Cảnh báo mức 3">Cảnh báo mức 3</option>
          </select>
        </div>
        <div class="form-group">
          <label class="required">Lớp:</label>
          <input type="text" v-model="newStudent.class" class="form-input" required />
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="goBack">Hủy</button>
          <button type="submit" class="btn btn-primary">Thêm</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student'

const router = useRouter()
const studentStore = useStudentStore()

// Dữ liệu sinh viên mới
const newStudent = ref({
  studentId: '',
  fullName: '',
  birthDate: '',
  gender: '',
  phone: '',
  address: '',
  sumCredit: '',
  cpa: '',
  status: '',
  class: '',
})

// Quay lại trang danh sách sinh viên
const goBack = () => {
  router.push('/teacher/students')
}

// Thêm sinh viên
const addStudent = async () => {
  try {
    // Dữ liệu cơ bản
    if (!newStudent.value.studentId || 
        !newStudent.value.fullName || 
        !newStudent.value.birthDate ||
        !newStudent.value.gender ||
        !newStudent.value.phone ||
        !newStudent.value.address ||
        !newStudent.value.class ||
        !newStudent.value.status) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    // Dữ liệu tín chỉ
    const sumCredit = Number(newStudent.value.sumCredit)
    if (isNaN(sumCredit) || sumCredit < 0) {
      alert('Tổng số tín chỉ không hợp lệ')
      return
    }

    // Dữ liệu CPA
    const cpa = Number(newStudent.value.cpa)
    if (isNaN(cpa) || cpa < 0 || cpa > 4) {
      alert('CPA phải từ 0 đến 4')
      return
    }

    // Thêm sinh viên
    const studentData = {
      ...newStudent.value,
      sumCredit: sumCredit,
      cpa: cpa
    }

    await studentStore.addStudent(studentData)
    alert('Thêm sinh viên thành công')

    // Reset form
    newStudent.value = {
      studentId: '',
      fullName: '',
      birthDate: '',
      gender: '',
      phone: '',
      address: '',
      sumCredit: '',
      cpa: '',
      status: '',
      class: ''
    }
  } catch (error) {
    alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message))
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 3px rgba(52, 152, 219, 0.3);
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

.btn-primary {
  background-color: #eb2424;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.page-title {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
}
.add-student-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  width: 100%;
}

.btn-primary:hover {
  background-color: #d41f1f;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

select.placeholder {
  color: #999;
}

select:not(.placeholder) {
  color: #333;
}

select option[value=''][disabled] {
  color: #999 !important;
}

select:focus option[value=''][disabled] {
  color: #999 !important;
}
select option {
  color: #333;
}
label.required::after {
  content: ' *';
  color: #eb2424;
}
</style>
