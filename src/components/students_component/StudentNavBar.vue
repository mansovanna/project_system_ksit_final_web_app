<script setup lang="ts">
import { ref, nextTick, onUnmounted, onMounted } from 'vue'
import Profile from '@/components/students_component/Profile.vue'
import {
  ArrowSmallUpIcon,
  DocumentIcon,
  DocumentIconFille,
  MenuIcon,
  MoneyIconFille,
  MoneyIconOutlien,
  MoonIcon,
  SunIcon,
  UserFillIcon,
  HomeIcon,
  UsersIconOutline,
  HomeIconOutline,
  BedIconFille,
  BedIconOutline,
  LogoSchool,
} from '@/stores/Icons'
import { useAppStore } from '@/stores/app'

import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAvatar } from '@/composables/useAvatar'

const route = useRoute()

const authStore = useAuthStore()
const avata = useAvatar()
const appStore = useAppStore()

const isProfileOpen = ref(false)

const themeData = useAppStore()

const pages = ref([
  {
    title: 'ទំព័រដើម',
    iconFill: HomeIcon,
    iconOutline: HomeIconOutline,
    route: 'student-home',
  },
  {
    title: 'សុំច្បាប់',
    iconFill: DocumentIconFille,
    iconOutline: DocumentIcon,
    route: 'student-leave-request',
  },
  {
    title: 'បង់ថ្លៃស្នាក់នៅ',
    iconFill: MoneyIconFille,
    iconOutline: MoneyIconOutlien,
    route: 'student-payment-request',
  },
  {
    title: 'ប្រវត្តិស្នាក់នៅ',
    iconFill: BedIconFille,
    iconOutline: BedIconOutline,
    route: 'student-stays',
  },
  {
    title: 'ប្រវត្តិរូប',
    iconFill: UserFillIcon,
    iconOutline: UsersIconOutline,
    route: 'student-settings',
  },
])

// Component and button refs
const profile_handle = ref<InstanceType<typeof Profile> | null>(null)
const profile_button = ref<HTMLElement | null>(null)

const toggleProfile = async () => {
  isProfileOpen.value = !isProfileOpen.value

  if (isProfileOpen.value) {
    await nextTick()
    if (profile_handle.value) {
      console.log('Profile component mounted:', profile_handle.value)
    }
  } else {
    if (profile_handle.value) {
      console.log('Profile component unmounted:', profile_handle.value)
    }
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const profileButtonEl = profile_button.value
  const profileComponentEl = profile_handle.value?.$el

  if (
    profileComponentEl &&
    !profileComponentEl.contains(event.target as Node) &&
    profileButtonEl &&
    !profileButtonEl.contains(event.target as Node)
  ) {
    isProfileOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div>
    <nav
      class="w-full bg-white dark:bg-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 font-Kantumruy"
    >
      <div class="flex justify-between items-center gap-4 py-3 px-5">
        <!-- Menu -->
        <div class="flex">
          <!-- Block menu -->
          <img :src="LogoSchool" alt="Not found" class="w-11 h-11 rounded-full" />
        </div>
        <button
          @click="appStore.toggleApp()"
          class="w-10 h-10 border​​ relative border-slate-200 rounded-md hidden justify-center items-center"
        >
          <component :is="MenuIcon" />
        </button>

        <div class="flex justify-end items-center gap-4 relative">
          <div
            class="w-10 h-10 border border-warning rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 group"
            @click="themeData.themDarkMode"
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
          </div>

          <!-- profile  -->
          <div
            @click="toggleProfile"
            ref="profile_button"
            class="flex justify-end items-center gap-3 border border-r-0 pl-3 max-md:p-0 max-md:border-0 border-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 dark:border-slate-600 cursor-pointer"
          >
            <div
              class="text-xl duration-200 ease-in-out max-md:hidden flex flex-col"
              :class="isProfileOpen ? 'rotate-180' : ''"
            >
              <component :is="ArrowSmallUpIcon" />
            </div>
            <div class="flex justify-end items-center gap-2">
              <div class="max-md:hidden flex flex-col">
                <h1 class="font-Kantumruy font-medium capitalize">
                  {{ authStore.current_use?.user_name ?? 'Null' }}
                </h1>
                <p class="font-Kantumruy font-medium text-slate-400 text-xs capitalize">
                  {{ authStore.current_use?.role ?? 'Null' }}
                </p>
              </div>
              <div></div>
              <!-- <img
                class="w-10 h-10 border border-slate-400 rounded-full object-cover"
                src="https://i.pravatar.cc/100"
                alt=""
              /> -->
              <img
                v-if="authStore.current_use?.profile_photo_path"
                class="w-10 h-10 border border-slate-400 rounded-full object-cover"
                :src="
                  authStore.current_use?.profile_photo_url
                    ? authStore.current_use.profile_photo_url
                    : avata.textToImage(authStore.current_use?.user_name ?? '')
                "
                alt=""
              />
              <img
                v-else
                class="w-10 h-10 border border-slate-400 rounded-full object-cover"
                :src="avata.textToImage(authStore.current_use?.user_name ?? '')"
                alt=""
              />
            </div>
          </div>
        </div>
        <!-- profile -->
        <Transition name="zoom-reverse">
          <Profile
            :name="authStore.current_use?.first_name + ' ' + authStore.current_use?.last_name"
            :email="authStore.current_use?.email || ' Null'"
            :avatar-url="
              authStore.current_use?.profile_photo_url
                ? authStore.current_use.profile_photo_url
                : 'null'
            "
            :role="authStore.current_use?.role || 'Null'"
            v-if="isProfileOpen"
            ref="profile_handle"
          />
        </Transition>
      </div>
    </nav>

    <!--  -->

    <!-- Bottom Navicator -->
    <nav
      class="hidden max-lg:flex justify-between gap-6 w-full py-2 px-6 bg-white dark:bg-slate-800"
    >
      <!-- ---------------------------------------------------------------------- -->
      <div v-for="(page, index) in pages" :key="index">
        <RouterLink :to="{ name: page.route }">
          <div
            :class="route.name == page.route ? 'text-green-600' : 'text-slate-700 dark:text-white'"
            class="rounded-full flex flex-col justify-center items-center gap-1"
          >
            <component
              :is="route.name == page.route ? page.iconFill : page.iconOutline"
              class="w-8 h-8"
            />
            <span class="text-xs font-Kantumruy line-clamp-1">{{ page.title }} </span>
          </div>
        </RouterLink>
      </div>
      <!-- ---------------------------------------------------------------------- -->
    </nav>
  </div>
</template>

<style>
/* Zoom reverse animation */
.zoom-reverse-enter-active,
.zoom-reverse-leave-active {
  transition:
    transform 0.25s ease-in-out,
    opacity 0.25s ease;
}

/* Opening: zoom out (small → normal) */
.zoom-reverse-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.zoom-reverse-enter-to {
  transform: scale(1);
  opacity: 1;
}

/* Closing: zoom in (normal → bigger) */
.zoom-reverse-leave-from {
  transform: scale(1);
  opacity: 1;
}
.zoom-reverse-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
