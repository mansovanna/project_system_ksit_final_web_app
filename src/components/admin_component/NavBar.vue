<script setup lang="ts">
import { ref, nextTick, onUnmounted, onMounted } from 'vue'
import Profile from './Profile.vue'
import { ArrowSmallUpIcon, LogoSchool, MenuIcon, MoonIcon, SunIcon } from '@/stores/Icons'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useAvatar } from '@/composables/useAvatar'

const avatar = useAvatar()
const authStoreApp = useAuthStore()

const isProfileOpen = ref(false)

const themeData = useAppStore()

// Component and button refs
const profile_handle = ref<InstanceType<typeof Profile> | null>(null)
const profile_button = ref<HTMLElement | null>(null)

const toggleProfile = async () => {
  isProfileOpen.value = !isProfileOpen.value

  if (isProfileOpen.value) {
    await nextTick()
    if (profile_handle.value) {
      // console.log('Profile component mounted:', profile_handle.value)
    }
  } else {
    if (profile_handle.value) {
      // console.log('Profile component unmounted:', profile_handle.value)
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
  <nav
    class="w-full bg-white dark:bg-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 font-Kantumruy"
  >
    <div class="flex justify-between items-center gap-4 py-3 px-5">
      <!-- Menu -->

      <div class="flex justify-start items-center gap-4">
        <button
          @click="useAppStore().isMenuApp = !useAppStore().isMenuApp"
          class="w-10 h-10 border border-slate-200 rounded-md max-md:flex hidden justify-center items-center"
        >
          <component :is="MenuIcon" />
        </button>

        <img :src="LogoSchool" alt="" class="w-12 h-12 rounded-full object-center object-contain" />
        <!-- ShowRouer -->
        <!-- <div>
          <h1 class="font-Kantumruy font-medium uppercase">
            {{ $route.name }}
          </h1>
        </div> -->
      </div>

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
                {{ authStoreApp.current_use?.user_name ?? 'NUll' }}
              </h1>
              <p class="font-Kantumruy font-medium text-slate-400 text-xs capitalize">
                {{ authStoreApp.current_use?.role ?? 'NULL' }}
              </p>
            </div>
            <img
              :src="
                authStoreApp.current_use?.profile_photo_url
                  ? authStoreApp.current_use?.profile_photo_url
                  : avatar.textToImage(authStoreApp.current_use?.user_name ?? 'User')
              "
              alt="avatar"
              class="w-11 h-11 rounded-full font-Kantumruy flex justify-center items-center object-cover object-center"
            />
          </div>
        </div>
      </div>
      <!-- profile -->
      <Transition name="zoom-reverse">
        <Profile
          :user="authStoreApp.current_use?.user_name"
          :role="authStoreApp.current_use?.role"
          v-if="isProfileOpen"
          ref="profile_handle"
        />
      </Transition>
    </div>
  </nav>
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
