import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiredRole?: string | string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true, requiredRole: ['admin', 'staff'] },

      children: [
        {
          path: '',
          name: 'admin-home',
          component: () => import('@/views/admins/Home/Index.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/admins/Users/Index.vue'),
        },
        {
          path: 'users-profile/:id',
          name: 'users-profile',
          component: () => import('@/views/admins/Users/StudentProfile.vue'),
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/views/admins/Settings/Index.vue'),
        },
        {
          path: 'detail-leave:id',
          name: 'detail-leave',
          component: () => import('@/views/admins/Leave/DetailsLeave.vue'),
        },
        {
          path: 'staff',
          name: 'staff',
          component: () => import('@/views/admins/Staff/Index.vue'),
        },
        {
          path: 'staff-profile/:id',
          name: 'staff-profile',
          component: () => import('@/views/admins/Staff/StaffProfile.vue'),
        },
        {
          path: 'leaves',
          name: 'leaves',
          component: () => import('@/views/admins/Leave/Index.vue'),
        },
        {
          path: 'leaves-detail/:id',
          name: 'leaves-detail',
          component: () => import('@/views/admins/Leave/DetailsLeave.vue'),
        },
        {
          path: 'builds',
          name: 'builds',
          component: () => import('@/views/admins/Builds/Index.vue'),
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: () => import('@/views/admins/Rooms/Index.vue'),
        },
        {
          path: 'rooms/:id',
          name: 'rooms-detailt',
          component: () => import('@/views/admins/Rooms/RoomDetail.vue'),
        },
        {
          path: 'payments',
          name: 'payments',
          component: () => import('@/views/admins/Payments/Index.vue'),
        },
        {
          path: 'payments-detail/:id',
          name: 'payments-detail',
          component: () => import('@/views/admins/Payments/PaymentDetail.vue'),
        },
        {
          path: 'banks',
          name: 'banks',
          component: () => import('@/views/admins/Payments/Banks.vue'),
        },
        {
          path: 'report-leaves',
          name: 'report-leaves',
          component: () => import('@/views/admins/Reports/leaves_report.vue'),
        },
        {
          path: 'report-paymented',
          name: 'report-paymented',
          component: () => import('@/views/admins/Reports/Paymented.vue'),
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: () => import('@/views/admins/Announcents/Index.vue'),
        },
        {
          path: 'announcements-detail/:id',
          name: 'announcements-detail',
          component: () => import('@/views/admins/Announcents/AnnouncementDetail.vue'),
        },
        {
          path: 'report-student',
          name: 'report-student',
          component: () => import('@/views/admins/Reports/student_report.vue'),
        },
        {
          path: 'policy',
          name: 'policy',
          component: () => import('@/views/admins/Policy/Index.vue'),
        },
        {
          path: 'policy/:id',
          name: 'policy-detail',
          component: () => import('@/views/admins/Policy/PolicyDetail.vue'),
        },
      ],
    },

    // --------------
    {
      path: '/student',
      name: 'student',
      meta: { requiresAuth: true, requirePdRole: 'user' },
      children: [
        {
          path: '',
          name: 'student-home',
          component: () => import('@/views/students/Home/home.vue'),
        },
        {
          path: 'student-leave',
          name: 'student-leave',
          component: () => import('@/views/students/Leaves/Index.vue'),
        },
        {
          path: 'student-leave-request',
          name: 'student-leave-request',
          component: () => import('@/views/students/Leaves/RequestLeave.vue'),
        },
        {
          path: 'student-stays',
          name: 'student-stays',
          component: () => import('@/views/students/Stays/Index.vue'),
        },

        {
          path: 'student-payments',
          name: 'student-payments',
          component: () => import('@/views/students/Payments/Index.vue'),
        },
        {
          path: 'student-payment-request',
          name: 'student-payment-request',
          component: () => import('@/views/students/Payments/Request.vue'),
        },
        {
          path: 'student-payment-detail/:id',
          name: 'student-payment-detail',
          component: () => import('@/views/students/Payments/PaymentDetail.vue'),
        },
        {
          path: 'student-announcement',
          name: 'student-announcement',
          component: () => import('@/views/students/Announcement/Inxe.vue'),
        },
        {
          path: 'student-announcement-detail/:id',
          name: 'student-announcement-detail',
          component: () => import('@/views/students/Announcement/Detailt.vue'),
        },
        {
          path: 'student-staff',
          name: 'student-staff',
          component: () => import('@/views/students/Staffs/Index.vue'),
        },
        {
          path: 'student-policy',
          name: 'student-policy',
          component: () => import('@/views/students/Policy/Index.vue'),
        },
        {
          path: 'student-user',
          name: 'student-user',
          component: () => import('@/views/students/Users/Index.vue'),
        },
        {
          path: 'student-settings',
          name: 'student-settings',
          component: () => import('@/views/students/Settings/Index.vue'),
        },
      ],
    },
    // -------
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },

    {
      // is not set auth work.
      path: '/',
      name: 'index',
      component: () => import('@/views/Index.vue'),
    },
    {
      path: '/view-detail/:id',
      name: 'view-detail',
      component: () => import('@/views/ViewDetailAnn.vue'),
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isLoggedIn = !!authStore.token
  const userRole = authStore.current_use?.role ?? ''

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' })
  }

  if (to.meta.requiredRole) {
    const allowed = Array.isArray(to.meta.requiredRole)
      ? to.meta.requiredRole
      : [to.meta.requiredRole]

    if (!allowed.includes(userRole)) {
      // Redirect to appropriate home or a forbidden page
      return next({ name: 'login' })
    }
  }

  if (to.meta.requiredRole === 'admin' || to.meta.requiredRole === 'staff') {
    if (userRole === 'admin' || userRole === 'staff') {
      return next()
    } else {
      return next({ name: 'login' })
    }
  } else if (to.meta.requiredRole === 'student') {
    if (userRole === 'user') {
      return next()
    } else {
      return next({ name: 'login' })
    }
  }

  next()
})

export default router
