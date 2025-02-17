import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/Pages/core/PageLogin.vue';
import Main from '@/Pages/MainPage.vue';
import ProductionForm from '@/Pages/ProductionForm.vue';
import Profile from '@/Pages/Profile.vue';
import { isTokenNearExpiration, RenewToken } from "@/services/apiService.js";
const routes = [
  {
    path: '/ProductionForm',
    name: 'ProductionForm',
    component: ProductionForm,
    meta: {
      breadcrumb: [{ name: 'ProductionForm', link: '/ProductionForm' },
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
        await RenewToken(localStorage.getItem('refreshTokenProductionForm'));
      }
    }
    next(); // อนุญาตให้เปลี่ยน Route
  } catch (error) {
    console.error('Error during token renewal:', error);
    localStorage.removeItem('accessTokenProductionForm');
    localStorage.removeItem('refreshTokenProductionForm');
    next({ name: 'Login' }); // ส่งกลับหน้า Login
  }
});

export default router;
