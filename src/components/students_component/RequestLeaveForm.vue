<script setup lang="ts">
import { useLeaveStudentStore } from '@/stores/leave_student_stote'
import Loading from '@/widgets/Loading.vue'
import { onMounted } from 'vue'

const leavesStore = useLeaveStudentStore()

const submit = () => {
  // Clear previous error messages
  leavesStore.errorMessage = {
    start_date: '',
    end_date: '',
    reason: '',
  }

  let hasError = false

  // Validate start date
  if (!leavesStore.formData.start_date) {
    leavesStore.errorMessage.start_date = 'សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម'
    hasError = true
  }

  // Validate end date
  if (!leavesStore.formData.end_date) {
    leavesStore.errorMessage.end_date = 'សូមជ្រើសរើសថ្ងៃបញ្ចប់'
    hasError = true
  } else if (leavesStore.formData.end_date < leavesStore.formData.start_date) {
    leavesStore.errorMessage.end_date = 'ថ្ងៃបញ្ចប់ត្រូវតែធំជាងថ្ងៃចាប់ផ្តើម'
    hasError = true
  }

  // Validate reason
  if (!leavesStore.formData.reason) {
    leavesStore.errorMessage.reason = 'សូមបញ្ចូលមូលហេតុ'
    hasError = true
  }

  if (!hasError) {
    // Submit the form (e.g., send data to the server)
    console.log('Form submitted:', leavesStore.formData)
    // Reset form after submission
    const formData = new FormData()
    formData.append('reason', leavesStore.formData.reason)
    formData.append('start_date', leavesStore.formData.start_date)
    formData.append('end_date', leavesStore.formData.end_date)
    // -------------------------------------------------------------------
    leavesStore.requestLeave(formData)
  }
}

onMounted(() => {
  leavesStore.isMessageLeave = {
    message: '',
    status: '',
  }
})
</script>

<template>
  <!-- Message Notification -->
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
      v-if="leavesStore.isMessageLeave.message"
      class="fixed bottom-10 right-4 w-full max-w-96 z-50"
    >
      <div
        class="p-4 rounded-lg shadow-md border w-full relative overflow-clip"
        :class="
          leavesStore.isMessageLeave.status === 'success'
            ? 'bg-gradient-to-r from-green-700 to-green-500 border-green-600'
            : 'bg-gradient-to-r from-red-600 to-red-400 border-red-600'
        "
      >
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="shrink-0 text-white">
            <svg
              v-if="leavesStore.isMessageLeave.status === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <!-- Message -->
          <p class="text-sm font-medium text-white flex-1">
            {{ leavesStore.isMessageLeave.message }}
          </p>

          <!-- Close Button -->
          <button
            class="shrink-0 text-white/70 hover:text-white transition-colors"
            @click="leavesStore.isMessageLeave.message = ''"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
  <!-- End Message Notification -->

  <div
    class="w-full bg-white dark:bg-slate-700/40 rounded-lg p-4 border border-green-700 dark:border-green-700 flex flex-col sticky top-19 max-h-[90vh] overflow-y-auto"
  >
    <h2 class="text-lg font-Kantumruy font-semibold text-slate-700 mb-4 dark:text-white">
      ស្នើសុំច្បាប់ឈប់
    </h2>

    <form class="space-y-4" @submit.prevent="submit">
      <!-- Date Range -->
      <div class="flex gap-2 items-start mt-2 max-md:flex-col">
        <div class="flex flex-col w-1/2 max-lg:w-full">
          <label class="block text-slate-600 dark:text-white mb-1 font-Kantumruy">
            ចន្លោះថ្ងៃ
          </label>
          <input
            v-model="leavesStore.formData.start_date"
            type="date"
            class="w-full border font-Kantumruy rounded-lg px-3 py-4 text-sm focus:ring-emerald-500 focus:outline-none focus:ring-2 placeholder:dark:text-slate-300 dark:text-white dark:bg-slate-800"
            :class="leavesStore.errorMessage.start_date ? 'border-red-500' : 'border-slate-200'"
          />
          <span class="text-red-600 text-xs mt-2 font-Kantumruy">{{
            leavesStore.errorMessage.start_date
          }}</span>
        </div>

        <div class="flex flex-col w-1/2 max-lg:w-full">
          <label class="block text-slate-600 dark:text-white mb-1 font-Kantumruy">
            ថ្ងៃមកវិញ
          </label>
          <input
            v-model="leavesStore.formData.end_date"
            type="date"
            class="w-full border font-Kantumruy rounded-lg px-3 py-4 text-sm focus:ring-emerald-500 focus:outline-none focus:ring-2 placeholder:dark:text-slate-300 dark:text-white dark:bg-slate-800"
            :class="leavesStore.errorMessage.end_date ? 'border-red-500' : 'border-slate-200'"
          />
          <span class="text-red-600 text-xs mt-2 font-Kantumruy">{{
            leavesStore.errorMessage.end_date
          }}</span>
        </div>
      </div>

      <!-- Reason -->
      <div>
        <label class="block text-slate-600 dark:text-white mb-1 font-Kantumruy"> មូលហេតុ </label>
        <textarea
          rows="3"
          v-model="leavesStore.formData.reason"
          placeholder="សូមបញ្ចូលមូលហេតុ..."
          class="w-full border font-Kantumruy rounded-lg px-3 py-4 text-sm focus:ring-emerald-500 focus:outline-none focus:ring-2 placeholder:dark:text-slate-300 dark:text-white dark:bg-slate-800"
          :class="leavesStore.errorMessage.reason ? 'border-red-500' : 'border-slate-200'"
        ></textarea>

        <span class="text-red-600 text-xs font-Kantumruy mt-2">{{
          leavesStore.errorMessage.reason
        }}</span>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="leavesStore.isLoadings"
        class="w-full py-3 font-Kantumruy cursor-pointer rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 transition"
      >
        <div v-if="leavesStore.isLoadings" class="flex justify-center items-center gap-2">
          <div class="w-6 h-6"><loading /></div>
          <span class="font-Kantumruy">Loading...</span>
        </div>
        <span v-else class="font-Kantumruy">ផ្ញើសំណើ</span>
      </button>
    </form>
  </div>
</template>
