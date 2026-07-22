<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import SwitchButton from '@/widgets/SwitchButton.vue'

const authStore = useAuthStore()

// const baseURL = import.meta.env.VITE_APP_BASE_URL
const avatar = useAvatar()
// ---------------------------------
import {
  AnnoouncementIconFille,
  ArrowSmallUpIcon,
  DocumentIconFille,
  EditIcon,
  LockFille,
  LogoutIcon,
  MoneyIconFille,
  PolicyIconFill,
  UsersIcon,
} from '@/stores/Icons'
import { onMounted, ref } from 'vue'

import ChangePassword from '@/components/students_component/ChangePassword.vue'
import AlertMessageLogout from '@/components/students_component/AlertMessageLogout.vue'
import Profile_Infos from '@/components/students_component/Profile_Infos.vue'
import { useAuthStore } from '@/stores/auth'
import { useAvatar } from '@/composables/useAvatar'
import Loading from '@/widgets/Loading.vue'
import AnnoouncementIconVueFille from '@/assets/icons/AnnoouncementIconVueFille.vue'

const pages = ref([
  {
    title: 'បុគ្គលិកអន្តេវាសិកដ្ឋាន',
    boby: 'អ្នកប្រើប្រាស់អាចមើលអំពិបុគ្គលិកគ្រប់គ្រងអន្តរវាសិកដ្ឋាន',
    route: 'student-staff',
    icon: UsersIcon,
  },
  {
    title: 'សេចក្ដីជូនដំណឹង',
    boby: 'សេចក្ដីជូនដំណឹង',
    route: 'student-announcement',
    icon: AnnoouncementIconFille,
  },
  {
    title: 'ប្រវត្តិស្នើរសុំច្បាប់',
    boby: 'អ្នកប្រើប្រាស់អាចមើលអំពំប្រវត្តិស្នើរសុំច្បាប់របស់ខ្លួន',
    route: 'student-leave',
    icon: DocumentIconFille,
  },
  {
    title: 'ប្រវត្តិស្នើរបង់ថ្លៃស្នាក់នៅ',
    boby: 'បទបញ្ជារផ្ទៃក្នុងនៃអន្តេវាសិកដ្ឋាន',
    route: 'student-payments',
    icon: MoneyIconFille,
  },
  {
    title: 'បទបញ្ជារផ្ទៃក្នុងរបស់អន្តេវាសិកដ្ឋាន',
    boby: 'អ្នកប្រើប្រាស់អាចមើលអំពីបទបញ្ជារផ្ទៃក្នុងនៃអន្តេវាសិកដ្ឋាន',
    route: 'student-policy',
    icon: PolicyIconFill,
  },
  {
    title: 'ប្រវត្តិរូបរបស់ខ្ញុំ',
    boby: 'អាចមើល និងធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួនបាន',
    route: 'student-user',
    icon: EditIcon,
  },
])

// ---------
const isShowChangePassword = ref(false)

const handdleChangPassword = () => {
  isShowChangePassword.value = !isShowChangePassword.value
}

const isAlertLogout = ref(false)

const handdleLogout = () => {
  isAlertLogout.value = !isAlertLogout.value
}
const submitData = (data: any) => {
  // console.log('This is: ', data)
  // Submit form data for change password ------------------------
  authStore.changePasswordOfUser(data)
}

// --------- Logout Accounts
const logoutAccount = () => {
  authStore.logout()
}

const isCloseSar = ref(false)

const handleCloseSar = (value: boolean) => {
  isCloseSar.value = value

  localStorage.setItem('isCloseSar', value.toString())
}

onMounted(() => {
  isCloseSar.value = localStorage.getItem('isCloseSar') === 'true'
})
</script>

<template>
  <StudentLayouts>
    <div
      class="px-4 py-3 flex flex-col gap-4 lg:flex-row max-md:flex-col justify-start items-start w-full max-md:pb-20"
    >
      <!-- Block Change Password -->
      <ChangePassword
        v-if="isShowChangePassword"
        @close="handdleChangPassword"
        @submit="submitData"
      />

      <!-- Block Alert Message Logout  -->
      <AlertMessageLogout
        v-if="isAlertLogout"
        @close="handdleLogout"
        @confirm="logoutAccount"
        :is-loading="authStore.isLoading"
      />
      <!-- Block left -->
      <div
        class="w-1/2 max-lg:min-w-xs max-lg:w-full flex flex-col justify-start items-start gap-4 sticky top-21 max-lg:relative max-lg:top-auto"
      >
        <div
          class="w-full bg-white rounded-2xl p-4 flex items-center gap-3 font-Kantumruy border border-slate-200 dark:bg-slate-800 dark:border-slate-600"
        >
          <div class="w-20 h-20 rounded-full" v-if="authStore.current_use?.profile_photo_path">
            <img
              :src="authStore.current_use.profile_photo_url"
              class="w-20 h-20 object-cover object-center border-3 border-slate-100 ring-2 ring-green-700 rounded-full"
            />
          </div>
          <!-- https://i.pravatar.cc/100 -->
          <img
            v-else
            :src="avatar.textToImage(authStore.current_use?.user_name ?? 'User')"
            class="w-20 h-20 border-3 border-slate-100 ring-2 ring-green-700 rounded-full"
          />
          <div>
            <p class="font-medium dark:text-white">
              {{ authStore.current_use?.last_name }} {{ authStore.current_use?.first_name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-slate-300 uppercase">
              ID: {{ authStore.current_use?.info?.id_card ?? 'N/A' }}
            </p>
          </div>
        </div>

        <!-- General -->
        <div
          class="w-full hidden max-lg:flex flex-col items-start bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-600 overflow-clip"
        >
          <p class="px-4 py-4 font-Kantumruy text-slate-600 font-medium dark:text-white">General</p>
          <!-- <hr class="w-full text-slate-100 dark:text-slate-500" /> -->
          <div class="w-full flex flex-col items-start">
            <div class="w-full" v-for="(page, index) in pages" :key="index">
              <RouterLink :to="{ name: page.route }">
                <div
                  class="w-full px-3 py-2 border-t border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 dark:border-slate-500 flex justify-between items-center"
                >
                  <div class="w-full flex justify-start items-center gap-3 font-Kantumruy text-sm">
                    <div
                      class="w-10 h-10 bg-green-700/10 p-2 flex justify-center items-center rounded-full text-green-700"
                    >
                      <component :is="page.icon" />
                    </div>

                    <div class="flex flex-col justify-start items-start">
                      <span class="font-Kantumruy">{{ page.title }}</span>
                      <span class="font-Kantumruy text-xs text-slate-400">{{ page.boby }}</span>
                    </div>
                  </div>
                  <div class="rotate-90 text-slate-600">
                    <component :is="ArrowSmallUpIcon" />
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
          <div class="p-1"></div>
        </div>

        <!-- End General -->

        <!-- Block Preferences -->
        <div
          class="w-full flex flex-col items-start bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-600 overflow-clip"
        >
          <p class="px-4 py-3 font-Kantumruy text-slate-600 font-medium dark:text-white">
            Preferences
          </p>
          <hr class="w-full text-slate-100 dark:text-slate-500" />
          <div class="w-full flex flex-col items-start">
            <!-- Close sar -->

            <div
              class="w-full px-3 py-2 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center border-b dark:border-slate-500"
            >
              <div class="w-full flex justify-start items-center gap-3 font-Kantumruy text-sm">
                <!--  -->
                <div
                  class="w-10 h-10 bg-orange-400/10 p-2 flex justify-center items-center rounded-full text-orange-400"
                >
                  <component :is="AnnoouncementIconVueFille" />
                </div>
                <div class="flex flex-col justify-start items-start">
                  <span class="font-Kantumruy">បិទការជូនសារបញ្ចាក់ការបង់ប្រាក់</span>
                  <span class="font-Kantumruy text-xs text-slate-400"
                    >មុខងារបិទការជូនសារបញ្ចាក់ការបង់ប្រាក់ ដើម្បីជៀសវាងការរំខានសម្រាប់អ្នក</span
                  >
                </div>
              </div>
              <!-- switch -->
              <div class="text-slate-600">
                <SwitchButton v-model="isCloseSar" @update:modelValue="handleCloseSar" />
              </div>
              <!-- End switch -->
            </div>
            <!-- End Close sar -->

            <div
              @click="handdleChangPassword"
              class="w-full px-3 py-2 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center border-b dark:border-slate-500"
            >
              <div class="w-full flex justify-start items-center gap-3 font-Kantumruy text-sm">
                <!--  -->
                <div
                  class="w-10 h-10 bg-green-700/10 p-2 flex justify-center items-center rounded-full text-green-700"
                >
                  <component :is="LockFille" />
                </div>
                <div class="flex flex-col justify-start items-start">
                  <span class="font-Kantumruy">ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់</span>
                  <span class="font-Kantumruy text-xs text-slate-400"
                    >ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់ ដើម្បីរក្សាសុវត្ថិភាព</span
                  >
                </div>
              </div>
              <div class="rotate-90 text-slate-600">
                <!-- <component :is="ArrowSmallUpIcon" /> -->
              </div>
            </div>

            <!-- ----------------- -->
            <button
              @click="handdleLogout"
              :disabled="authStore.isLoading"
              class="w-full disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center"
            >
              <div class="w-full flex justify-start items-center gap-3 font-Kantumruy text-sm">
                <!--  -->
                <div
                  class="w-10 h-10 bg-red-500/10 p-2 flex justify-center items-center rounded-full text-red-500"
                >
                  <component :is="LogoutIcon" />
                </div>
                <div class="flex flex-col justify-start items-start">
                  <span class="font-Kantumruy">ចាកចេញពីគណនី</span>
                  <span class="font-Kantumruy text-xs text-slate-400"
                    >ចាកចេញពីគណនី (ឈប់ប្រើប្រាស់បណ្ដោះអាសន្ន)</span
                  >
                </div>
              </div>
              <!-- authStore.isLoading -->
              <div v-if="authStore.isLoading" class="rotate-90 text-slate-600">
                <div class="w-5 h-5 flex justify-center items-center">
                  <component :is="Loading" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <!-- End Block left -->

      <!-- Block Right-->

      <div class="w-full max-lg:hidden">
        <Profile_Infos />
      </div>
    </div>
  </StudentLayouts>
</template>
