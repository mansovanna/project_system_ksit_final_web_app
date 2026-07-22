<!-- MinimalConfirm.vue -->
<script setup lang="ts">
import { WarningIcon } from '@/stores/Icons'
import Loading from '@/widgets/Loading.vue'

const emit = defineEmits(['close', 'confirm'])

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-dark/70 p-4"
    @click="emit('close')"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-5 dark:bg-gray-800 relative" @click.stop>
      <!-- <button class="  absolute right-4 top-4 bg-red-500 text-white rounded-full p-1" @click="emit('close')">
        <component :is="CloseIcon"/>
      </button> -->
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 w-10 h-10 flex justify-center items-center bg-red-500/30 rounded-full">
          <component :is="WarningIcon" class="h-6 w-6 text-red-500" />
        </div>
        <h3 class="font-Kantumruy text-lg font-semibold">បញ្ជាក់ការចាកចេញ</h3>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-5 font-hanuman">
        តើអ្នកពិតជាចង់ចាកចេញពីប្រព័ន្ធមែនទេ?
      </p>

      <div class="flex justify-end gap-2 font-Kantumruy">
        <button
          @click="emit('close')"
          class="px-4 py-2 border border-slate-200 rounded hover:bg-slate-500/10"
        >
          បោះបង់
        </button>
        <button
          @click="emit('confirm')"
          :disabled="isLoading"
          class="px-4 py-2 bg-red-600 text-white rounded font-Kantumruy"
        >
          <span v-if="isLoading" class="flex justify-center items-center gap-2 font-poppins">
            <div class="w-5 h-5">
              <loading :fill="'fill-red-400'" />
            </div>
            Loading...
          </span>
          <span v-else class="font-Kantumruy">ចាកចេញ</span>
        </button>
      </div>
    </div>
  </div>
</template>
