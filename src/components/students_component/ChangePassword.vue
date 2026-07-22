<script setup lang="ts">
import { ref } from 'vue'
import { CloseIcon } from '@/stores/Icons'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/widgets/Loading.vue'

const authStore = useAuthStore()
/* =========================
   Emits
========================= */
const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'submit',
    payload: {
      old_password: string
      new_password: string
    },
  ): void
}>()

/* =========================
   State
========================= */
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')

/* =========================
   Validation + Submit
========================= */
const handleSubmit = () => {
  error.value = ''

  if (!oldPassword.value) {
    error.value = 'Current password is required'
    return
  }

  if (!newPassword.value) {
    error.value = 'New password is required'
    return
  }

  if (newPassword.value.length < 6) {
    error.value = 'New password must be at least 6 characters'
    return
  }

  if (!confirmPassword.value) {
    error.value = 'Please confirm your new password'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (oldPassword.value === newPassword.value) {
    error.value = 'New password must be different from current password'
    return
  }

  emit('submit', {
    old_password: oldPassword.value,
    new_password: newPassword.value,
  })
}

const isShowPass = ref(false)

// const handleShowPass = () => {
//   isShowPass.value = !isShowPass.value
// }
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-dark/60 p-4"
    @click="emit('close')"
  >
    <div
      class="w-full max-w-md rounded-lg border border-green-700 bg-white dark:bg-gray-600"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between relative px-3 py-3">
        <h1 class="font-Kantumruy text-xl font-medium text-gray-800 dark:text-white">
          Change Password
        </h1>

        <button
          @click="emit('close')"
          class="hover:bg-red-400 bg-red-500 rounded-full p-1 text-white"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <hr class="text-slate-300 dark:text-slate-400" />
      <!-- Form -->

      <form @submit.prevent="handleSubmit" class="px-4 py-4">
        <p
          class="px-4 font-poppins py-2 rounded-md"
          :class="
            authStore.errorMessage
              ? 'text-red-500 bg-red-600/20'
              : authStore.successMessage
                ? 'text-green-500 bg-green-600/20'
                : 'hidden'
          "
        >
          {{ authStore.errorMessage ?? 'N/A' }} {{ authStore.successMessage ?? 'N/A' }}
        </p>
        <div class="space-y-3 mt-4">
          <input
            v-model="oldPassword"
            :type="isShowPass ? 'text' : 'password'"
            placeholder="Current password"
            class="w-full rounded border font-Kantumruy border-slate-200 px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-400 dark:border-gray-600 dark:bg-gray-700"
          />

          <input
            v-model="newPassword"
            :type="isShowPass ? 'text' : 'password'"
            placeholder="New password"
            class="w-full rounded border font-Kantumruy border-slate-200 px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-400 dark:border-gray-600 dark:bg-gray-700"
          />

          <input
            v-model="confirmPassword"
            :type="isShowPass ? 'text' : 'password'"
            placeholder="Confirm new password"
            class="w-full rounded border font-Kantumruy px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring focus:ring-green-400 dark:border-gray-600 dark:bg-gray-700"
            :class="error ? 'border-red-500 ' : 'border-slate-200'"
          />

          <p v-if="error" class="text-sm text-red-500">
            {{ error }}
          </p>
        </div>

        <div class="mt-3 w-auto flex justify-start">
          <label class="flex justify-start items-center gap-2 group">
            <input type="checkbox" class="w-5 h-5" v-model="isShowPass" />
            <p class="font-Kantumruy group-hover:underline group-hover:text-blue-600">
              Show Passowrd
            </p>
          </label>
        </div>

        <!-- Actions -->
        <div class="mt-5 flex justify-end gap-2">
          <div
            @click="emit('close')"
            class="rounded border border-slate-200 font-Kantumruy px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer dark:hover:bg-gray-700"
          >
            Cancel
          </div>

          <button
            :disabled="!oldPassword || !newPassword || !confirmPassword || authStore.isLoading"
            class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed font-Kantumruy disabled:opacity-50"
          >
            <span
              v-if="authStore.isLoading"
              class="font-poppins flex justify-center items-center gap-2"
              ><div class="w-5 h-5">
                <loading />
              </div>
              Loading...</span
            >
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
