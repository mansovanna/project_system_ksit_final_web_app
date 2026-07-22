<script setup lang="ts">
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { MoonIcon, SunIcon } from '@/stores/Icons'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const themeData = useAppStore()

const authStoreApp = useAuthStore()
const router = useRouter()

// ----------------------------------

const handdleRouter = (role: string) => {
  if (!role) {
    router.push('/login')
  } else if (role == 'admin' || role == 'staff') {
    router.push('/admin')
  } else {
    router.push('/student')
  }
}

const pages = ref([
  { name: 'ទំព័រដើម', icon: null, link: 'home' },
  { name: 'បុគ្គលិក', icon: null, link: null },
  { name: 'ទំនាក់ទំនង', icon: null, link: null },
])

// ----
const route = useRoute()
</script>

<template>
  <header
    class="w-full bg-white dark:bg-gray-500/70 rounded-full border border-green-700 px-3.5 py-3 max-md:py-1.5 max-md:px-2 flex items-center justify-between gap-4"
  >
    <div class="flex justify-start items-center gap-3">
      <button
        @click="themeData.toggleApp"
        class="max-md:flex hidden w-9 h-9 p-1 justify-center items-center text-white max-md:p-0 dark:bg-green-700 bg-green-700/20 hover:bg-green-500/80 cursor-pointer hover:text-white rounded-full"
      >
        <component :is="MenuIcon" />
      </button>

      <img class="w-11 h-11 bg-slate-300 rounded-full" src="../../assets/images/logo.jpg" />
    </div>

    <div class="flex justify-end items-center gap-3">
      <ul
        v-if="false"
        :class="!themeData.isMenuApp ? 'max-md:hidden' : ''"
        class="flex gap-4 max-md:gap-1 text-lg max-md:absolute top-16 left-0 max-lg:dark:bg-slate-600/90 max-md:bg-white max-md:rounded-lg max-md:flex-col max-md:w-full max-md:overflow-clip max-md:py-2 max-md:border border-green-700"
      >
        <li v-for="(page, index) in pages" :key="index">
          <RouterLink to="#">
            <div
              class="text-green-700 dark:text-white max-lg:text-green-700 max-lg:dark:text-white max-lg:hover:bg-slate-500/20 max-lg:dark:hover:bg-slate-500 font-semibold hover:underline flex items-center gap-2 justify-center relative max-md:w-full max-md:py-2 max-md:px-4 max-md:hover:bg-slate-100 max-md:text-left max-md:justify-start"
              :class="route.name === page.link ? 'max-md:bg-slate-200' : ''"
            >
              <component :is="page ? page.icon : null" class="w-5 h-5" />
              <span class="font-hanuman">{{ page.name }}</span>

              <span
                :class="route.name === page.link ? 'block' : 'hidden'"
                class="absolute -bottom-1 rounded-full bg-warning p-0.5 right-0 left-0 max-md:hidden"
              ></span>
            </div>
          </RouterLink>
        </li>
        <!-- <hr class="text-slate-200 max-md:block hidden" />
        <li>

        </li>
        <li class="max-md:py-2">

        </li> -->
      </ul>

      <button
        @click="themeData.themDarkMode"
        class="w-10 h-10 border border-warning rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 group"
      >
        <component
          v-if="themeData.isDarkMode === 'light'"
          :is="MoonIcon"
          class="w-full h-full p-2 text-warning group-hover:scale-150 ease-in-out duration-300 group-hover:rotate-180"
        />
        <component
          v-else
          :is="SunIcon"
          class="w-full h-full p-2 text-warning group-hover:scale-150 ease-in-out duration-300 group-hover:rotate-180"
        />
      </button>

      <button
        @click="handdleRouter(String(authStoreApp.current_use?.role || authStoreApp.user?.type))"
        class="bg-green-700 max-md:px-4 text-md text-white px-5 py-2 rounded-full font-semibold font-hanuman hover:bg-green-800 dark:bg-green-600 dark:text-white transition-colors duration-300"
      >
        ចូលគណនី
      </button>
    </div>
  </header>
</template>
