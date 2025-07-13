<template>
  <div class="login-container">
    <div class="wrapper">
      <div class="form-box login">
        <h2>ĐĂNG NHẬP</h2>
        <!-- Thêm thông báo lỗi -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label>Email/MSSV</label>
            <div class="input-with-icon">
              <i class="fas fa-user"></i>
              <input type="text" v-model="loginForm.username" required :disabled="loading" />
            </div>
          </div>

          <div class="input-group">
            <label>Mật khẩu</label>
            <div class="input-with-icon">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="loginForm.password"
                required
                :disabled="loading"
              />
              <i
                class="fas"
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="togglePassword"
              ></i>
            </div>
          </div>
          <div class="remember-forgot">
            <label>
              <input type="checkbox" v-model="loginForm.remember" :disabled="loading" />
              Nhớ mật khẩu
            </label>
          </div>
          <button type="submit" class="btn" :disabled="loading || !isFormValid">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// Dữ liệu form đăng nhập
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Kiểm tra form hợp lệ
const isFormValid = computed(() => {
  return loginForm.value.username.trim() && loginForm.value.password.trim()
})

// Xử lý đăng nhập
const handleLogin = async () => {
  if (!isFormValid.value) {
    ElMessage.warning('Vui lòng nhập đầy đủ thông tin')
    return
  }

  loading.value = true
  try {
    const role = await authStore.login(
      loginForm.value.username,
      loginForm.value.password
    )
    
    // Chuyển hướng đến trang dashboard tương ứng
    if (role === 'teacher') {
      router.push('/teacher/dashboard')
    } else if (role === 'student') {
      router.push('/student')
    }
    
    ElMessage.success('Đăng nhập thành công')
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error(error || 'Đăng nhập thất bại')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.wrapper {
  width: 400px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  padding: 30px;
}

.form-box h2 {
  font-size: 32px;
  color: #df1111;
  text-align: center;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  color: #333;
  margin-bottom: 5px;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 10px;
  color: #666;
}

.input-with-icon input {
  padding-left: 35px;
}

.input-with-icon .fa-eye,
.input-with-icon .fa-eye-slash {
  right: 10px;
  left: auto;
  cursor: pointer;
}

.input-with-icon input[type='password'] {
  padding-right: 35px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  font-size: 14px;
}

.remember-forgot label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.remember-forgot a {
  color: #333;
  text-decoration: none;
}

.btn {
  width: 100%;
  padding: 12px;
  background: #e71e1e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.btn:hover {
  background: #c21a1a;
}
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .wrapper {
    width: 90%;
    margin: 0 20px;
  }
}
</style>
