<template>
  <div class="dashboard">
    <div class="stats-container">
      <div class="stat-card">
        <i class="fas fa-users stat-icon"></i>
        <div class="stat-info">
          <div class="stat-title">Tổng số sinh viên</div>
          <div class="stat-number">{{ totalStudents }}</div>
        </div>
      </div>

      <div class="stat-card">
        <i class="fas fa-school stat-icon"></i>
        <div class="stat-info">
          <div class="stat-title">Tổng số lớp</div>
          <div class="stat-number">{{ totalClasses }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()
const totalStudents = ref(0)
const totalClasses = ref(0)

// Lấy dữ liệu dashboard
onMounted(async () => {
  try {
    await studentStore.fetchStudents()
    
    // Tính tổng số sinh viên
    totalStudents.value = studentStore.students.length

    // Tính tổng số lớp (unique)
    const classes = new Set(studentStore.students.map(s => s.class))
    totalClasses.value = classes.size

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
  color: #304156;
}

.stat-info {
  flex: 1;
}

.stat-title {
  color: #606266;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #304156;
}
</style>