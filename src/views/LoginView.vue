<script setup lang="ts">
import { ref } from 'vue'
import LockIconFilleVue from '@/assets/icons/LockIconFilleVue.vue'
import { UserFillIcon, ViewIcon, ViewOutline } from '@/stores/Icons'
import { useAuthStore } from '@/stores/auth'
import BlockLogoSchool from '@/widgets/BlockLogoSchool.vue'
import Loading from '@/widgets/Loading.vue'

const authStore = useAuthStore()
// -------------------------------
const isOpen = ref(false)

const showPassword = () => {
  isOpen.value = !isOpen.value
}

const formData = ref({
  login: '',
  password: '',
})

const resetMessage = () => {
  authStore.isMessageError.login = ''
  authStore.isMessageError.password = ''
}

const submit = () => {
  resetMessage()

  if (!formData.value.login) {
    authStore.isMessageError.login = 'Email or ID Card is required'
  }

  if (!formData.value.password) {
    authStore.isMessageError.password = 'Password is required'
  }

  if (authStore.isMessageError.login || authStore.isMessageError.password) return

  // console.log('Submit success', formData.value)
  authStore.loginForm(formData.value.login, formData.value.password)
}
</script>

<template>
  <!-- Main Wrapper -->
  <div class="w-full h-screen overflow-auto">
    <div
      class="w-full min-h-screen bg-slate-200 dark:bg-slate-900 flex flex-col lg:flex-row relative"
    >
      <!-- Left Panel -->
      <div
        class="w-1/2 max-lg:w-full h-screen flex justify-center items-center max-lg:h-auto bg-green-800 p-5 relative overflow-hidden"
      >
        <div class="w-96 h-96 bg-yellow-100/10 rounded-full absolute -right-32 -top-20"></div>
        <div class="w-24 h-24 bg-yellow-600/10 rounded-full absolute top-10 left-10"></div>
        <BlockLogoSchool />
      </div>

      <!-- Right Panel -->
      <div class="w-full lg:w-1/2 max-lg:w-full flex justify-center items-center p-4 sm:p-6">
        <form @submit.prevent="submit" class="w-full max-w-md sm:max-w-lg">
          <div
            class="bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 p-4 sm:p-6"
          >
            <!-- Title -->
            <h1 class="font-Kantumruy text-2xl text-green-700 font-bold">Login Account</h1>
            <p class="font-Kantumruy mt-1 text-sm sm:text-base text-slate-400">
              Please enter your information below
            </p>

            <!-- Login -->
            <div class="mt-4">
              <label for="login" class="font-Kantumruy text-sm text-slate-500"
                >ID Card Number <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <input
                  v-model="formData.login"
                  type="text"
                  placeholder="ID Card Number"
                  class="w-full px-3 py-2 pl-10 font-Kantumruy rounded-md focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
                  :class="[
                    authStore.isMessageError.login
                      ? 'border-red-500 ring-2 ring-red-500/40 bg-red-500/10'
                      : 'bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700',
                  ]"
                />
                <div class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700">
                  <component :is="UserFillIcon" />
                </div>
              </div>
              <p class="mt-1 text-xs text-red-500 font-Kantumruy">
                {{ authStore.isMessageError.login }}
              </p>
            </div>

            <!-- Password -->
            <div class="mt-4">
              <label for="password" class="font-Kantumruy text-sm text-slate-500"
                >Password <span class="text-red-500">*</span></label
              >
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="isOpen ? 'text' : 'password'"
                  placeholder="********"
                  class="w-full px-10 py-2 font-Kantumruy rounded-md focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
                  :class="[
                    authStore.isMessageError.password
                      ? 'border-red-500 ring-2 ring-red-500/40 bg-red-500/10'
                      : 'bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700',
                  ]"
                />
                <div class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700">
                  <component :is="LockIconFilleVue" />
                </div>

                <!-- Toggle Password -->
                <div class="absolute inset-y-0 -right-2 flex items-center px-2">
                  <button
                    type="button"
                    @click="showPassword"
                    class="w-9 h-9 rounded-full hover:bg-green-700 text-green-700 hover:text-white flex items-center justify-center"
                  >
                    <component :is="isOpen ? ViewOutline : ViewIcon" />
                  </button>
                </div>
              </div>
              <p class="mt-1 text-xs text-red-500 font-Kantumruy">
                {{ authStore.isMessageError.password }}
              </p>
            </div>

            <!-- Submit -->

            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="mt-6 w-full font-Kantumruy disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-900 hover:bg-green-800 text-white p-3 rounded-md"
            >
              <span v-if="authStore.isLoading" class="flex justify-center items-center gap-2">
                <div class="flex justify-center items-center w-5 h-5">
                  <Loading />
                </div>
                <span>Loding...</span>
              </span>
              <span v-else>Submit</span>
            </button>

            <!-- Divider -->
            <div class="w-full mt-6 flex items-center gap-2">
              <hr class="w-full border-slate-300" />
              <div>
                <div class="w-4 h-4 bg-green-700 rotate-45"></div>
              </div>
              <hr class="w-full border-slate-300" />
            </div>

            <!-- Register -->
            <div class="mt-4 text-center text-sm sm:text-base">
              <span class="text-slate-400 font-Kantumruy">Don't have an account?</span>
              <RouterLink
                :to="{ name: 'register' }"
                class="ml-1 text-blue-600 hover:underline font-Kantumruy cursor-pointer"
              >
                Register
              </RouterLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
