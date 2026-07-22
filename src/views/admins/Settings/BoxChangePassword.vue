<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { reactive, computed, ref } from 'vue'
import Loading from '@/widgets/Loading.vue'
const authStore = useAuthStore()
const formData = reactive({
  password: '',
  password_confirme: '',
  password_old: '',
})

const isShowPassword = ref(false)

// handle show password
// const handleShowPassword = () => {
//   isShowPassword.value = !isShowPassword.value
// }

// handle password strength
const passwordStrength = computed(() => {
  const password = formData.password || ''

  let score = 0

  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  let message = ''
  let color = ''

  switch (score) {
    case 0:
      message = 'Enter a password'
      color = 'text-slate-500'
      break
    case 1:
      message = 'Weak password'
      color = 'text-red-500'
      break
    case 2:
      message = 'Fair password'
      color = 'text-orange-500'
      break
    case 3:
      message = 'Good password'
      color = 'text-yellow-500'
      break
    case 4:
      message = 'Strong password'
      color = 'text-green-500'
      break
  }

  return {
    score,
    message,
    color,
  }
})

// validate password
const validatePassword = (): boolean => {
  // clear error
  authStore.errors.password = ''
  authStore.errors.password_confirme = ''
  authStore.errors.password_old = ''

  // start chacking
  if (!formData.password_old) {
    authStore.errors.password_old = 'Password old is required'
    return false
  }
  if (!formData.password) {
    authStore.errors.password = 'Password is required'
    return false
  }

  if (formData.password != formData.password_confirme) {
    authStore.errors.password_confirme = 'Password confirm is not match'
    return false
  }
  // ...
  return true
}
// handle submit change password
const submitChangePassword = () => {
  const isValid = validatePassword()
  if (!isValid) return

  const data = new FormData()
  data.append('password', formData.password ?? '')
  data.append('password_confirmation', formData.password_confirme ?? '')
  data.append('password_old', formData.password_old ?? '')
  // confirmation
  authStore.changePassword(data)
}
</script>

<template>
  <div class="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 rounded-xl">
    <!-- Block header -->
    <div class="p-4">
      <h1 class="font-Kantumruy text-lg dark:text-white">ផ្លាស់ប្ដូរពាក្យសម្ងាត់</h1>
      <p class="font-Kantumruy text-sm dark:text-white">ប្រើពាក្យ 8+ តួ រួមមានលេខ និងសញ្ញា</p>
      <div
        v-if="authStore.passwordMessage.message"
        class="mt-2 p-2 rounded-lg"
        :class="
          authStore.passwordMessage.type === 'success'
            ? 'bg-green-500/10 text-green-600'
            : 'bg-red-500/10 text-red-600'
        "
      >
        <p class="font-Kantumruy text-sm">{{ authStore.passwordMessage.message }}</p>
      </div>
    </div>
    <!-- End Block header -->
    <hr class="w-full text-slate-200 dark:text-slate-500" />

    <!-- Block form -->
    <div class="w-full space-y-1 p-4">
      <!-- field 1 -->
      <div class="w-full">
        <label class="font-Kantumruy text-sm">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
        <div class="mt-1.5">
          <input
            :type="isShowPassword ? 'text' : 'password'"
            v-model="formData.password_old"
            class="w-full font-Kantumruy placeholder:font-medium p-2 border rounded-lg outline-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="********"
            :class="
              authStore.errors.password_old
                ? 'border-red-500 bg-red-500/10 text-red-600'
                : 'bg-slate-50 dark:bg-slate-700  border-slate-300 dark:border-slate-500 '
            "
          />
          <p
            v-if="authStore.errors.password_old"
            class="font-Kantumruy text-xs text-red-500 dark:text-red-400"
          >
            {{ authStore.errors.password_old }}
          </p>
        </div>
      </div>
      <!-- End field 1 -->

      <!-- field 2 -->
      <div class="w-full">
        <label class="font-Kantumruy text-sm">ពាក្យសម្ងាត់ថ្មី</label>
        <div class="mt-1.5">
          <input
            :type="isShowPassword ? 'text' : 'password'"
            v-model="formData.password"
            class="w-full font-Kantumruy placeholder:font-medium p-2 border rounded-lg outline-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="********"
            :class="
              authStore.errors.password
                ? 'border-red-500 bg-red-500/10 text-red-600'
                : 'bg-slate-50 dark:bg-slate-700  border-slate-300 dark:border-slate-500 '
            "
          />

          <!-- Block rang passowrd -->
          <div class="w-full grid grid-cols-4 gap-2 mt-2">
            <span
              v-for="i in 4"
              :key="i"
              class="w-full rounded-full p-1"
              :class="
                i <= passwordStrength.score
                  ? passwordStrength.score === 1
                    ? 'bg-red-500'
                    : passwordStrength.score === 2
                      ? 'bg-orange-500'
                      : passwordStrength.score === 3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  : 'bg-slate-200'
              "
            ></span>
          </div>

          <!-- End Block rage password -->

          <!-- Block message -->
          <p
            v-if="formData.password || authStore.errors.password_old"
            class="mt-0.5 font-Kantumruy text-xs"
            :class="passwordStrength.color"
          >
            {{ passwordStrength.message || authStore.errors.password_old }}
          </p>

          <p
            v-if="authStore.errors.password && !passwordStrength.message"
            class="font-Kantumruy text-xs text-red-500 dark:text-red-400"
          >
            {{ authStore.errors.password }}
          </p>
        </div>
      </div>
      <!-- End field 2 -->

      <!-- field 3 -->
      <div class="w-full">
        <label class="font-Kantumruy text-sm">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
        <div class="mt-1.5">
          <input
            :type="isShowPassword ? 'text' : 'password'"
            v-model="formData.password_confirme"
            class="w-full font-Kantumruy placeholder:font-medium p-2 border rounded-lg outline-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="********"
            :class="
              authStore.errors.password_confirme
                ? 'border-red-500 bg-red-500/10 text-red-600'
                : 'bg-slate-50 dark:bg-slate-700  border-slate-300 dark:border-slate-500 '
            "
          />

          <!-- Block message -->
          <p
            v-if="authStore.errors.password_confirme"
            class="font-Kantumruy text-xs text-red-500 dark:text-red-400"
          >
            {{ authStore.errors.password_confirme }}
          </p>
        </div>
      </div>
      <!-- End field 3 -->

      <!-- Block check box show pass -->
      <div class="w-full flex justify-start items-center mt-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="w-4 h-4" v-model="isShowPassword" />
          <span class="font-Kantumruy text-sm">បង្ហាញពាក្យសម្ងាត់</span>
        </label>
      </div>

      <!-- Block button -->
      <div class="w-full flex justify-end items-center gap-4">
        <button
          @click="submitChangePassword"
          :disabled="
            authStore.passwordMessage.loading || authStore.passwordMessage.type == 'success'
          "
          class="px-4 py-2 disabled:bg-slate-400 disabled:cursor-not-allowed bg-blue-600 text-white font-Kantumruy rounded-lg hover:bg-blue-500 transition-all duration-300 cursor-pointer"
        >
          <span v-if="!authStore.passwordMessage.loading"> រក្សាទុកពាក្យសម្ងាត់</span>
          <div
            v-if="authStore.passwordMessage.loading"
            class="flex justify-center items-center gap-2"
          >
            <div class="w-5 h-5">
              <component :is="Loading" />
            </div>
            <p>Loading...</p>
          </div>
        </button>
      </div>
      <!-- End Block button -->
    </div>
  </div>
</template>
