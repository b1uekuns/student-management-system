<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="students-container">
    <h2 class="page-title text-center">Quản Lý Sinh Viên</h2>

    <!-- Loading state -->
    <div v-if="studentStore.loading" class="loading">
      <div class="loading-spinner"></div>
      Đang tải...
    </div>

    <!-- Trạng thái lỗi -->
    <div v-if="studentStore.error" class="error">
      <i class="fas fa-exclamation-circle"></i>
      {{ studentStore.error }}
    </div>

    <!-- Nội dung chính -->
    <div v-else>
      <div class="controls">
        <div class="class-select">
          Lớp
          <select v-model="selectedClass">
            <option value="">Tất cả</option>
            <option v-for="className in classList" :key="className" :value="className">
              {{ className }}
            </option>
          </select>
        </div>

        <button class="btn btn-primary" @click="router.push('/teacher/students/add')">
          <i class="fas fa-plus"></i> Thêm sinh viên
        </button>
      </div>

      <div class="table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th class="text-center">STT</th>
              <th
                class="text-center"
                :class="{ active: sortConfig.field === 'studentId' }"
                @click="sortStudents('studentId')"
              >
                MSSV
                <i
                  class="fas"
                  :class="{
                    'fa-sort': sortConfig.field !== 'studentId',
                    'fa-sort-up': sortConfig.field === 'studentId' && sortConfig.direction === 'asc',
                    'fa-sort-down':
                      sortConfig.field === 'studentId' && sortConfig.direction === 'desc',
                  }"
                ></i>
              </th>
              <th
                class="text-center"
                :class="{ active: sortConfig.field === 'fullName' }"
                @click="sortStudents('fullName')"
              >
                Họ và tên
                <i
                  class="fas"
                  :class="{
                    'fa-sort': sortConfig.field !== 'fullName',
                    'fa-sort-alpha-up':
                      sortConfig.field === 'fullName' && sortConfig.direction === 'asc',
                    'fa-sort-alpha-down':
                      sortConfig.field === 'fullName' && sortConfig.direction === 'desc',
                  }"
                ></i>
              </th>
              <th class="text-center">Ngày sinh</th>
              <th class="text-center">Giới tính</th>
              <th
                class="text-center"
                :class="{ active: sortConfig.field === 'cpa' }"
                @click="sortStudents('cpa')"
              >
                CPA
                <i
                  class="fas"
                  :class="{
                    'fa-sort': sortConfig.field !== 'cpa',
                    'fa-sort-up': sortConfig.field === 'cpa' && sortConfig.direction === 'asc',
                    'fa-sort-down': sortConfig.field === 'cpa' && sortConfig.direction === 'desc',
                  }"
                ></i>
              </th>
              <th class="text-center">Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
            <tr class="filter-row">
              <th></th>
              <th>
                <input
                  type="text"
                  v-model="filters.mssv"
                  placeholder="Tìm MSSV..."
                  class="filter-input"
                />
              </th>
              <th>
                <input
                  type="text"
                  v-model="filters.name"
                  placeholder="Tìm họ tên..."
                  class="filter-input"
                />
              </th>
              <th></th>
              <th>
                <select v-model="filters.gender" class="filter-input">
                  <option value=""></option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </th>
              <th>
                <select v-model="filters.cpa" class="filter-input">
                  <option value=""></option>
                  <option value="3.6-4.0">3.6 - 4.0</option>
                  <option value="3.2-3.59">3.2 - 3.59</option>
                  <option value="2.5-3.19">2.5 - 3.19</option>
                  <option value="2.0-2.49">2.0 - 2.49</option>
                  <option value="1.5-1.99">1.5 - 1.99</option>
                  <option value="1.0-1.49">1.0 - 1.49</option>
                  <option value="0-0.99">&lt; 1.0</option>
                </select>
              </th>
              <th>
                <select v-model="filters.status" class="filter-input">
                  <option value=""></option>
                  <option value="Không">Không</option>
                  <option value="Cảnh báo mức 1">Cảnh báo mức 1</option>
                  <option value="Cảnh báo mức 2">Cảnh báo mức 2</option>
                  <option value="Cảnh báo mức 3">Cảnh báo mức 3</option>
                </select>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!filteredStudents.length">
              <td colspan="8" class="no-data">Không có dữ liệu sinh viên</td>
            </tr>
            <tr v-else v-for="(student, index) in paginatedStudents" :key="student._id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ student.studentId }}</td>
              <td class="text-center">{{ student.fullName }}</td>
              <td class="text-center">{{ formatDate(student.birthDate) }}</td>
              <td class="text-center">{{ student.gender }}</td>
              <td class="text-center">{{ student.cpa }}</td>
              <td class="text-center">
                <span :class="['status', getStatusClass(student.status)]">
                  {{ student.status }}
                </span>
              </td>
              <td class="text-center actions">
                <button class="btn btn-detail" @click="viewDetails(student)">
                  <i class="fas fa-info-circle"></i> Chi tiết
                </button>
                <el-popconfirm
                  title="Bạn có chắc chắn muốn xóa sinh viên này?"
                  confirm-button-text="Xóa"
                  cancel-button-text="Hủy"
                  @confirm="deleteStudent(student._id)"
                >
                  <template #reference>
                    <button class="btn btn-delete">
                      <i class="fas fa-trash"></i> Xóa
                    </button>
                  </template>
                </el-popconfirm>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Phân trang -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="totalStudents"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStudentStore } from '@/stores/student'
import { useRouter } from 'vue-router'

const router = useRouter()
const studentStore = useStudentStore()
const selectedClass = ref('')

// Định nghĩa filters
const filters = ref({
  mssv: '',
  name: '',
  gender: '',
  cpa: '',
  status: '',
  class: '',
})

// Lấy danh sách lớp
const classList = computed(() => {
  const classes = new Set(studentStore.students.map((student) => student.class).filter(Boolean))
  return Array.from(classes).sort()
})

// Lọc và sắp xếp sinh viên
const filteredStudents = computed(() => {
  let result = studentStore.students.filter((student) => {
    return (
      (!filters.value.mssv || student.studentId.includes(filters.value.mssv)) &&
      (!filters.value.name ||
        student.fullName.toLowerCase().includes(filters.value.name.toLowerCase())) &&
      (!filters.value.gender || student.gender === filters.value.gender) &&
      (!filters.value.status || student.status === filters.value.status) &&
      (!filters.value.cpa || checkCpaRange(student.cpa, filters.value.cpa)) &&
      (!filters.value.class || student.class === filters.value.class) 
    )
  })

  // Sắp xếp nếu có
  if (sortConfig.value.field) {
    result.sort((a, b) => {
      let aVal = a[sortConfig.value.field]
      let bVal = b[sortConfig.value.field]

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortConfig.value.direction === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  return result
})
watch(selectedClass, (newValue) => {
  filters.value.class = newValue
})
// Kiểm tra khoảng CPA
const checkCpaRange = (studentCpa, filterRange) => {
  if (!filterRange) return true
  const [min, max] = filterRange.split('-').map(Number)
  return studentCpa >= min && studentCpa <= max
}

// Format date
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

// Theo dõi trạng thái sắp xếp
const sortConfig = ref({
  field: '',
  direction: 'asc',
})

// Cập nhật trạng thái sắp xếp
const sortStudents = (field) => {
  if (sortConfig.value.field === field) {
    if (sortConfig.value.direction === 'asc') {
      sortConfig.value.direction = 'desc'
    } else if (sortConfig.value.direction === 'desc') {
      sortConfig.value.field = ''
      sortConfig.value.direction = 'asc'
    }
  } else {
    sortConfig.value.field = field
    sortConfig.value.direction = 'asc'
  }
}

// Lấy class cho trạng thái
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
// Lấy danh sách sinh viên
onMounted(async () => {
  try {
    await studentStore.fetchStudents()
  } catch (error) {
    console.error('Lỗi khi tải danh sách sinh viên:', error)
  }
})

// Xóa sinh viên
const deleteStudent = async (studentId) => {
  try {
    if (!confirm('Bạn có chắc muốn xóa sinh viên này?')) return
    await studentStore.deleteStudent(studentId)
    alert('Xóa sinh viên thành công')
  } catch (error) {
    alert('Có lỗi xảy ra: ' + error.message)
  }
}

// Xem chi tiết
const viewDetails = (student) => {
  router.push(`/teacher/students/${student._id}`)
}

const currentPage = ref(1)
const pageSize = ref(10)

// Tính tổng số sinh viên
const totalStudents = computed(() => filteredStudents.value.length)

// Danh sách sinh viên đã phân trang
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

// Xử lý khi thay đổi số lượng hiển thị trên một trang
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

// Xử lý khi chuyển trang
const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.students-container {
  padding: 20px;
}
.text-center {
  text-align: center !important;
}
.page-title {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2rem;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.class-select select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-left: 5px;
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

.students-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid #ddd;
}

.students-table th,
.students-table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.students-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn-detail {
  background-color: #f39c12;
  color: white;
}

.btn-detail:hover {
  background-color: #e08e0b;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.filter-row th {
  padding: 8px;
  background-color: #fff;
}

.filter-input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 3px rgba(52, 152, 219, 0.3);
}

.fa-sort {
  margin-left: 5px;
  cursor: pointer;
  color: #666;
}

th {
  cursor: pointer;
}

th:hover .fa-sort {
  color: #333;
}
.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e71e1e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

th.active .fa-sort {
  color: #eb2424;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
