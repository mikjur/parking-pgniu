import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Проверка авторизации перед переходом
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    // Если страница требует авторизации, но токена нет — редирект на логин
    next('/login')
  } else if (to.path === '/login' && token) {
    // Если уже авторизован и идёт на логин — редирект на главную
    next('/')
  } else {
    next()
  }
})

export default router