import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import TeacherLayout from '@/views/teacher/TeacherLayout.vue'
import Dashboard from '@/views/teacher/Dashboard.vue'
import Students from '@/views/teacher/Students.vue'
import AddStudent from '@/views/teacher/AddStudent.vue'
import StudentDetail from '@/views/teacher/StudentDetail.vue'
import StudentProfile from '@/views/student/StudentProfile.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'students',
        name: 'students',
        component: Students,
      },
      {
        path: 'students/add',
        name: 'add-student',
        component: AddStudent,
      },
      {
        path: 'students/:id',
        name: 'student-detail',
        component: StudentDetail
      }
    ],
  },
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/views/student/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    redirect: '/student/profile',
    children: [
      {
        path: 'profile',
        name: 'StudentProfile',
        component: StudentProfile
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token
  const userRole = authStore.user?.role

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.role && to.meta.role !== userRole) {
    next(userRole === 'teacher' ? '/teacher/dashboard' : '/student')
  } else {
    next()
  }
})

export default router
