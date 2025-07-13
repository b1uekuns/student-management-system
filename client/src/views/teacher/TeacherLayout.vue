<template>
  <div :class="['teacher-layout', { 'sidebar-expanded': isSidebarExpanded }]">
    <div class="sidebar">
      <div class="sidebar-header">
        <button class="menu-toggle" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <nav class="nav-menu">
        <router-link to="/teacher/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-home"></i>
          <span>Trang Chủ</span>
        </router-link>
        <router-link to="/teacher/students" class="nav-item" active-class="active">
          <i class="fas fa-user-graduate"></i>
          <span>Sinh Viên</span>
        </router-link>
        <button @click="logout" class="nav-item logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng Xuất</span>
        </button>
      </nav>
    </div>

    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSidebarExpanded = ref(false)

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value
}

// Đăng xuất
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.teacher-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.sidebar {
  width: 60px;
  background: #c61818;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: width 0.3s ease;
}

.sidebar-expanded .sidebar {
  width: 250px;
}

.sidebar-header {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}

.menu-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: white;
  text-decoration: none;
  gap: 1rem;
  transition: background-color 0.3s;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item i {
  width: 24px;
  text-align: center;
  font-size: 1.2rem;
}

.nav-item span {
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.sidebar-expanded .nav-item span {
  opacity: 1;
}

.main-content {
  flex: 1;
  margin-left: 60px;
  padding: 1rem;
  transition: margin-left 0.3s ease;
}

.sidebar-expanded .main-content {
  margin-left: 250px;
}

.logout-btn {
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-expanded .sidebar {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
