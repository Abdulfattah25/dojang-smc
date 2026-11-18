import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../stores/auth.js';

import PublicLayout from '../layouts/PublicLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

import RegisterView from '../views/public/RegisterView.vue';
import SuccessView from '../views/public/SuccessView.vue';

// Lazy-loaded Admin Routes (drastically optimizes initial bundle size)
const LoginView = () => import('../views/admin/LoginView.vue');
const DashboardView = () => import('../views/admin/DashboardView.vue');
const ApplicantsView = () => import('../views/admin/ApplicantsView.vue');
const MembersView = () => import('../views/admin/MembersView.vue');
const PaymentsView = () => import('../views/admin/PaymentsView.vue');
const ReportsView = () => import('../views/admin/ReportsView.vue');
const UsersView = () => import('../views/admin/UsersView.vue');

const routes = [
  // Public Routes
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'Register',
        component: RegisterView,
        meta: { title: 'Pendaftaran Siswa Baru - Taekwondo Satria Muda Club' }
      },
      {
        path: 'success',
        name: 'Success',
        component: SuccessView,
        meta: { title: 'Pendaftaran Berhasil - Taekwondo Satria Muda Club' }
      }
    ]
  },

  // Admin Auth Gate (PWA Start Screen)
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: LoginView,
    meta: { guestOnly: true, title: 'Login Pengurus - Satria Muda Club' }
  },

  // Admin Protected App Shell
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: DashboardView,
        meta: { title: 'Dashboard - Satria Muda Club' }
      },
      {
        path: 'applicants',
        name: 'AdminApplicants',
        component: ApplicantsView,
        meta: { title: 'Verifikasi Pendaftar - Satria Muda Club' }
      },
      {
        path: 'members',
        name: 'AdminMembers',
        component: MembersView,
        meta: { title: 'Data Anggota - Satria Muda Club' }
      },
      {
        path: 'payments',
        name: 'AdminPayments',
        component: PaymentsView,
        meta: { title: 'Status Pembayaran - Satria Muda Club' }
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: ReportsView,
        meta: { title: 'Laporan & Rekap - Satria Muda Club' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: UsersView,
        meta: { requiresSuperadmin: true, title: 'Manajemen Pengurus - Satria Muda Club' }
      }
    ]
  },

  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuth();

  // Initialize auth state if not done yet
  if (!auth.state.isInitialized) {
    await auth.checkAuth();
  }

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // If page requires guest (e.g. login) and user is logged in
  if (to.meta.guestOnly && auth.state.isAuthenticated) {
    return next('/admin/dashboard');
  }

  // If page requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.state.isAuthenticated) {
      return next('/admin/login');
    }

    // If page requires superadmin
    if (to.matched.some(record => record.meta.requiresSuperadmin)) {
      if (!auth.isSuperadmin.value) {
        return next('/admin/dashboard');
      }
    }
  }

  next();
});

export default router;
