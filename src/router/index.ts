import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
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
          path: 'users-new',
          name: 'users-new',
          component: () => import('@/views/admins/Users/StudentNew.vue'),
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
          component: import('@/views/admins/Staff/Index.vue'),
        },
        {
          path: 'staff-profile/:id',
          name: 'staff-profile',
          component: import('@/views/admins/Staff/StaffProfile.vue'),
        },
        {
          path: 'leaves',
          name: 'leaves',
          component: import('@/views/admins/Leave/Index.vue'),
        },
        {
          path: 'builds',
          name: 'builds',
          component: import('@/views/admins/Builds/Index.vue'),
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: import('@/views/admins/Rooms/Index.vue'),
        },
        {
          path: 'rooms/:id',
          name: 'rooms-detailt',
          component: import('@/views/admins/Rooms/RoomDetail.vue'),
        },
        {
          path: 'payments',
          name: 'payments',
          component: import('@/views/admins/Payments/Index.vue'),
        },
        {
          path: 'report-paymented',
          name: 'report-paymented',
          component: import('@/views/admins/Reports/Paymented.vue'),
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: import('@/views/admins/Announcents/Index.vue'),
        },
        {
          path: 'report-student',
          name: 'report-student',
          component: import('@/views/admins/Reports/student_report.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'student',
      component: () => import('@/views/students/Home/Index.vue'),
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

export default router
