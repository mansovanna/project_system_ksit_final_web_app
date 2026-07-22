<script setup lang="ts">
import {
  AnnoouncementIconFille,
  AnnoouncementIconOutline,
  BedIconFille,
  BedIconOutline,
  DashboardIcon,
  DashboardOutlineIcon,
  DocumentIcon,
  DocumentIconFille,
  MoneyIconFille,
  MoneyIconOutlien,
  PolicyIconFill,
  PolicyIconOutline,
  SettingFillIcon,
  SettingOutlineIcon,
  UsersIcon,
} from '@/stores/Icons'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const route = useRoute()

const pages = ref([
  {
    route: 'student-home',
    title: 'Dashboard',
    icon: DashboardIcon,
    icon_out: DashboardOutlineIcon,
  },
  {
    route: 'student-leave',
    title: 'Leave',
    icon: DocumentIconFille,
    icon_out: DocumentIcon,
  },

  {
    route: 'student-stays',
    title: 'Stays',
    icon: BedIconFille,
    icon_out: BedIconOutline,
  },
  {
    route: 'student-payments',
    title: 'Payments',
    icon: MoneyIconFille,
    icon_out: MoneyIconOutlien,
  },
  {
    route: 'student-announcement',
    title: 'Announcement',
    icon: AnnoouncementIconFille,
    icon_out: AnnoouncementIconOutline,
  },
  {
    route: 'student-staff',
    title: 'Staff',
    icon: UsersIcon,
    icon_out: UsersIcon,
  },
  {
    route: 'student-policy',
    title: 'Policy',
    icon: PolicyIconFill,
    icon_out: PolicyIconOutline,
  },
  {
    route: 'student-settings',
    title: 'Setting',
    icon: SettingFillIcon,
    icon_out: SettingOutlineIcon,
  },
])
</script>

<template>
  <aside>
    <div
      class="w-full min-w-60 h-screen flex flex-col bg-white dark:bg-dark dark:border-slate-600 border-r border-slate-200 font-Kantumruy overflow-y-auto"
    >
      <div class="px-6 text-slate-300 space-y-0.5 max-md:block hidden">
        <hr />
        <hr />
      </div>
      <p class="p-4 font-medium text-slate-400 dark:text-white">General - Menu</p>
      <ul class="space-y-1 flex-1 overflow-y-auto set-scrollbar">
        <li v-for="(page, index) in pages" :key="index" :title="page.title">
          <RouterLink :to="{ name: page.route }">
            <div
              class="flex items-center gap-3 over:bg-slate-100 p-2 cursor-pointer hover:bg-blue-700/10 dark:text-white"
              :class="
                route.name == page.route
                  ? 'bg-slate-200 text-green-600 dark:bg-green-700 '
                  : 'text-slate-700'
              "
            >
              <component
                :is="route.name == page.route ? page.icon : page.icon_out"
                class="w-5 h-5"
              />
              <span class="font-medium">{{ page.title }}</span>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
