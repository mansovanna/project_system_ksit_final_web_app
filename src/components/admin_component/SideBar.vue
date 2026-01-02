<script setup lang="ts">
import {
  DashboardIcon,
  FolderFillIcon,
  SettingFillIcon,
  DashboardOutlineIcon,
  UserFillIcon,
  SettingOutlineIcon,
  UsersIcon,
  DocumentIcon,
  DocumentIconFille,
  BuildIconOutline,
  BedIconFille,
  BedIconOutline,
  MoneyIconFille,
  MoneyIconOutlien,
  ArrowSmallUpIcon,
  AnnoouncementIconFille,
  AnnoouncementIconOutline,
} from '@/stores/Icons'
import AdminTitle from './AdminTitle.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import UserOutlineIcon from '@/assets/icons/UserOutlineIcon.vue'
import BuildIconVueFille from '@/assets/icons/BuildIconVueFille.vue'

const route = useRoute()

// const props = defineProps({
//   title: {
//     type: String,
//     required: true,
//   },
// });

const pages = ref([
  {
    route: 'admin-home',
    title: 'Dashboard',
    icon: DashboardIcon,
    icon_out: DashboardOutlineIcon,
  },

  {
    route: 'users-new',
    title: 'Users Register',
    icon: UserFillIcon,
    icon_out: UserFillIcon,
  },
  {
    route: 'staff',
    title: 'Staffs',
    icon: UsersIcon,
    icon_out: UserOutlineIcon,
  },
  {
    route: 'leaves',
    title: 'Leaves Request',
    icon: DocumentIconFille,
    icon_out: DocumentIcon,
  },
  {
    route: 'builds',
    title: 'Building List',
    icon: BuildIconVueFille,
    icon_out: BuildIconOutline,
  },
  {
    route: 'rooms',
    title: 'Rooms List',
    icon: BedIconFille,
    icon_out: BedIconOutline,
  },
  {
    route: 'payments',
    title: 'Payments',
    icon: MoneyIconFille,
    icon_out: MoneyIconOutlien,
  },
  {
    route: 'announcements',
    title: 'Announcements',
    icon: AnnoouncementIconFille,
    icon_out: AnnoouncementIconOutline,
  },
  {
    route: 'setting',
    title: 'Setting',
    icon: SettingFillIcon,
    icon_out: SettingOutlineIcon,
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
      class="w-full min-w-60 h-screen flex flex-col bg-white border-r border-slate-200 font-Kantumruy overflow-y-auto"
    >
      <div class="justify-center items-center gap-4 py-5 px-5 max-md:flex hidden">
        <AdminTitle :title="{ main: 'Admin LD', sub: '' }" />
      </div>
      <div class="px-6 text-slate-300 space-y-0.5 max-md:block hidden">
        <hr />
        <hr />
      </div>
      <p class="p-4 font-medium text-slate-400">General - Menu</p>
      <ul class="space-y-1 flex-1 overflow-y-auto set-scrollbar">
        <li v-for="(page, index) in pages" :key="index" :title="page.title">
          <RouterLink :to="{ name: page.route }">
            <div
              class="flex items-center gap-3 over:bg-slate-100 p-2 cursor-pointer hover:bg-blue-700/10"
              :class="route.name == page.route ? 'bg-slate-200 text-blue-600' : 'text-slate-700'"
            >
              <component
                :is="route.name == page.route ? page.icon : page.icon_out"
                class="w-5 h-5"
              />
              <span class="font-medium">{{ page.title }}</span>
            </div>
          </RouterLink>
        </li>

        <!-- <li class="rounded-md p-2">Reports</li> -->
        <li class="relative">
          <div
            @click="handleResport"
            :title="'Report'"
            class="flex justify-between items-center hover:bg-slate-100 pl-0 p-2 pl-2 cursor-pointer"
          >
            <div
              class="flex items-center gap-3"
              :class="
                isShowReport ||
                route.name == 'report-student' ||
                route.name == 'report-paymented' ||
                route.name == 'leaves'
                  ? 'text-blue-500'
                  : 'text-slate-700'
              "
            >
              <component :is="FolderFillIcon" class="w-5 h-5" />
              <span class="font-medium">Reports</span>
            </div>
            <div :class="isShowReport ? 'rotate-0' : 'rotate-180'">
              <component class="text-slate-500" :is="ArrowSmallUpIcon" />
            </div>
          </div>
          <!-- ---------------------- -->
          <span
            v-if="
              isShowReport ||
              route.name == 'report-student' ||
              route.name == 'report-paymented' ||
              route.name == 'leaves'
            "
            class="absolute top-8 left-4 bottom-5 p-[0.5px] bg-slate-400 z-10"
          ></span>
          <!-- ---------------------- -->
          <ul
            class="px-2"
            v-if="
              isShowReport ||
              route.name == 'report-student' ||
              route.name == 'report-paymented' ||
              route.name == 'leaves'
            "
          >
            <li
              class="hover:bg-slate-100 rounded-md p-2 cursor-pointer pl-8 relative hover:text-slate-700"
              :class="route.name == 'report-student' ? 'bg-blue-600 text-white' : ''"
            >
              <RouterLink :to="{ name: 'report-student' }">
                <div class="top-0 bottom-0 left-2 absolute flex justify-start items-center">
                  <span class="bg-slate-400 w-5 p-[0.5px]"></span>
                </div>
                <span class="font-medium">Users</span>
              </RouterLink>
            </li>
            <li class="hover:bg-slate-100 rounded-md p-2 cursor-pointer pl-8 relative">
              <RouterLink to="#">
                <div class="top-0 bottom-0 left-2 absolute flex justify-start items-center">
                  <span class="w-5 p-[0.5px]"></span>
                </div>
                <span class="text-slate-700 font-medium">Leave</span>
              </RouterLink>
            </li>
            <li
              class="hover:bg-slate-100 rounded-md p-2 cursor-pointer pl-8 relative hover:text-slate-700"
              :class="route.name == 'report-paymented' ? 'bg-blue-600 text-white' : ''"
            >
              <RouterLink :to="{ name: 'report-paymented' }">
                <div class="top-0 bottom-0 left-2 absolute flex justify-start items-center">
                  <span class="bg-slate-400 w-5 p-[0.5px]"></span>
                </div>
                <span class="font-medium">Payment</span>
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>
