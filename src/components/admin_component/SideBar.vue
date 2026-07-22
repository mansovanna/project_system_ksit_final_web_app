<script setup lang="ts">
import { ref, markRaw } from 'vue'
import {
  DashboardIcon,
  FolderFillIcon,
  SettingFillIcon,
  DashboardOutlineIcon,
  SettingOutlineIcon,
  UsersIcon,
  BuildIconOutline,
  BedIconFille,
  BedIconOutline,
  ArrowSmallUpIcon,
  AnnoouncementIconFille,
  AnnoouncementIconOutline,
  UsersIconOutline,
  DateIcon,
  DateIconFille,
  PaymentIcon,
  PaymentIconFille,
  BankIconVueFille,
  BankIconVueOutline,
  DocumentIcon,
  DocumentIconFille,
} from '@/stores/Icons'
import UserOutlineIcon from '@/assets/icons/UserOutlineIcon.vue'
import BuildIconVueFille from '@/assets/icons/BuildIconVueFille.vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const authStore = useAuthStore()

const route = useRoute()

const pages = ref([
  {
    title: 'General',
    pages: [
      {
        route: 'admin-home',
        title: 'Dashboard',
        icon: markRaw(DashboardIcon),
        icon_out: markRaw(DashboardOutlineIcon),
      },
      {
        route: 'users',
        title: 'Users Register',
        icon: markRaw(UsersIcon),
        icon_out: markRaw(UsersIconOutline),
      },
      {
        route: 'staff',
        title: 'Staffs',
        icon: markRaw(UsersIcon),
        icon_out: markRaw(UserOutlineIcon),
      },
      {
        route: 'leaves',
        title: 'Leaves Request',
        icon: markRaw(DateIconFille),
        icon_out: markRaw(DateIcon),
      },
    ],
  },
  {
    title: 'Facility',
    pages: [
      {
        route: 'builds',
        title: 'Building List',
        icon: markRaw(BuildIconVueFille),
        icon_out: markRaw(BuildIconOutline),
      },
      {
        route: 'rooms',
        title: 'Rooms List',
        icon: markRaw(BedIconFille),
        icon_out: markRaw(BedIconOutline),
      },
      {
        route: 'payments',
        title: 'Payments',
        icon: markRaw(PaymentIconFille),
        icon_out: markRaw(PaymentIcon),
      },
      {
        route: 'banks',
        title: 'Banks',
        icon: markRaw(BankIconVueFille),
        icon_out: markRaw(BankIconVueOutline),
      },
    ],
  },
  {
    title: 'System',
    pages: [
      {
        route: 'announcements',
        title: 'Announcements',
        icon: markRaw(AnnoouncementIconFille),
        icon_out: markRaw(AnnoouncementIconOutline),
      },
      {
        route: 'policy',
        title: 'Policy',
        icon: markRaw(DocumentIconFille),
        icon_out: markRaw(DocumentIcon),
      },
      {
        route: 'setting',
        title: 'Setting',
        icon: markRaw(SettingFillIcon),
        icon_out: markRaw(SettingOutlineIcon),
      },
    ],
  },
])

const isShowReport = ref(false)

const handleResport = () => {
  isShowReport.value = !isShowReport.value
}
</script>

<template>
  <aside>
    <div
      class="w-full min-w-60 h-screen flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 font-Kantumruy overflow-x-visible"
    >
      <div class="p-3 h-17.5 w-full flex justify-center items-center gap-2 relative">
        <span class="font-Kantumruy text-slate-700 dark:text-slate-300 uppercase font-bold"
          >Dormitory System</span
        >
        <div
          class="absolute top-0 -right-3 bottom-0 max-md:flex justify-center items-center hidden"
        >
          <button
            @click="useAppStore().isMenuApp = false"
            class="cursor-pointer bg-red-500 -rotate-90 rounded-full text-white flex justify-center items-center"
          >
            <component :is="ArrowSmallUpIcon" />
          </button>
        </div>
      </div>
      <hr class="border-slate-200 dark:border-slate-700" />
      <!-- Block menu -->
      <ul class="space-y-1 flex-1 overflow-y-auto set-scrollbar">
        <li v-for="(page, index) in pages" :key="index" :title="page.title">
          <ul>
            <li class="w-full p-2 font-Kantumruy text-slate-400">{{ page.title }}</li>
            <li v-for="(subPage, subIndex) in page.pages" :key="subIndex">
              <RouterLink
                v-if="
                  authStore.current_use?.role === 'admin' ||
                  (subPage.route !== 'banks' && subPage.route !== 'policy')
                "
                :to="{ name: subPage.route }"
              >
                <div
                  class="flex items-center gap-3 over:bg-slate-100 p-2 cursor-pointer hover:bg-blue-700/10"
                  :class="
                    route.name == subPage.route
                      ? 'bg-slate-200 text-blue-600 dark:bg-slate-700'
                      : 'text-slate-700 dark:text-slate-300'
                  "
                >
                  <component
                    :is="route.name == subPage.route ? subPage.icon : subPage.icon_out"
                    class="w-5 h-5"
                  />
                  <span class="font-medium">{{ subPage.title }}</span>
                </div>
              </RouterLink>
            </li>
          </ul>
        </li>

        <!-- <li class="rounded-md p-2">Reports</li> -->
        <li class="relative">
          <div
            @click="handleResport"
            :title="'Report'"
            class="flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-700 p-2 pl-2 cursor-pointer"
          >
            <div
              class="flex items-center gap-3"
              :class="
                isShowReport ||
                route.name == 'report-student' ||
                route.name == 'report-paymented' ||
                route.name == 'report-leaves'
                  ? 'text-blue-500'
                  : 'text-slate-700 dark:text-slate-300'
              "
            >
              <component :is="FolderFillIcon" class="w-5 h-5" />
              <span class="font-medium">Reports</span>
            </div>
            <div :class="isShowReport ? 'rotate-0' : 'rotate-180'">
              <component class="text-slate-500 dark:text-slate-300" :is="ArrowSmallUpIcon" />
            </div>
          </div>
          <!-- ---------------------- -->
          <span
            v-if="
              isShowReport ||
              route.name == 'report-student' ||
              route.name == 'report-paymented' ||
              route.name == 'report-leaves'
            "
            class="absolute top-8 left-4 bottom-5 p-[0.5px] bg-slate-400 dark:bg-slate-600 z-10"
          ></span>
          <!-- ---------------------- -->
          <ul
            class="px-2"
            v-if="
              isShowReport ||
              route.name == 'report-student' ||
              route.name == 'report-paymented' ||
              route.name == 'report-leaves'
            "
          >
            <li>
              <RouterLink :to="{ name: 'report-student' }">
                <div
                  class="rounded-md p-2 cursor-pointer pl-8 relative dark:hover:bg-blue-600/10"
                  :class="
                    route.name == 'report-student'
                      ? 'bg-slate-200 dark:bg-slate-700 dark:hover:bg-blue-600/10 text-blue-600 dark:text-blue-600'
                      : 'hover:bg-slate-100  dark:hover:bg-blue-600/10 hover:text-slate-700 dark:hover:text-slate-300'
                  "
                >
                  <div class="top-0 bottom-0 left-2 absolute flex justify-start items-center">
                    <span class="bg-slate-400 dark:bg-slate-500 w-5 p-[0.5px]"></span>
                  </div>
                  <span class="font-medium">Student Report</span>
                </div>
              </RouterLink>
            </li>

            <li>
              <RouterLink :to="{ name: 'report-leaves' }">
                <div
                  class="rounded-md p-2 cursor-pointer pl-8 relative dark:hover:bg-blue-600/10"
                  :class="
                    route.name == 'report-leaves'
                      ? 'bg-slate-200 dark:bg-slate-700 dark:hover:bg-blue-600/10 text-blue-600 dark:text-blue-600'
                      : 'hover:bg-slate-100  dark:hover:bg-blue-600/10 hover:text-slate-700 dark:hover:text-slate-300'
                  "
                >
                  <div class="top-0 bottom-0 left-2 absolute flex justify-start items-center">
                    <span class="bg-slate-400 dark:bg-slate-500 w-5 p-[0.5px]"></span>
                  </div>
                  <span class="font-medium">Leaves</span>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'report-paymented' }">
                <div
                  class="rounded-md p-2 cursor-pointer pl-8 relative dark:hover:bg-blue-600/10"
                  :class="
                    route.name == 'report-paymented'
                      ? 'bg-slate-200 dark:bg-slate-700 dark:hover:bg-blue-600/10 text-blue-600 dark:text-blue-600'
                      : 'hover:bg-slate-100  dark:hover:bg-blue-600/10 hover:text-slate-700 dark:hover:text-slate-300'
                  "
                >
                  <div class="top-0 bottom-0 left-2 absolute flex justify-start items-center">
                    <span class="bg-slate-400 dark:bg-slate-500 w-5 p-[0.5px]"></span>
                  </div>
                  <span class="font-medium">Payments</span>
                </div>
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>
