import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/Pages/core/PageLogin.vue';
import Main from '@/Pages/MainPage.vue';
import Home from '@/Pages/Home.vue';
import Profile from '@/Pages/Profile.vue';
import { isTokenNearExpiration, RenewToken } from "@/services/apiService.js";
const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      breadcrumb: [{ name: 'Home', link: '/Home' },
      ],
    },
  },

  {
    path: '/Main',
    name: 'Main',
    component: Main,
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    // เช็คว่าหน้าปลายทางต้องการการล็อกอินหรือไม่
    if (!to.meta.allowAnonymous) {
      if (isTokenNearExpiration()) {
        // หาก Token ใกล้หมดอายุ ให้ Renew Token
        await RenewToken(localStorage.getItem('refreshTokenQa'));
      }
    }
    next(); // อนุญาตให้เปลี่ยน Route
  } catch (error) {
    console.error('Error during token renewal:', error);
    localStorage.removeItem('accessTokenQa');
    localStorage.removeItem('refreshTokenQa');
    next({ name: 'Login' }); // ส่งกลับหน้า Login
  }
});

export default router;
