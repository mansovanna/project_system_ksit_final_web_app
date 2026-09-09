<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md">
        <!-- Icon -->
        <div class="flex justify-center mb-[-36px] relative z-10">
          <div
            class="w-17 h-17 rounded-full bg-white border-[3px] border-emerald-800 flex items-center justify-center"
          >
            <component :is="InfoIcon" class="size-7 text-emerald-800" />
          </div>
        </div>

        <!-- Card -->
        <div
          class="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <!-- Header -->
          <div class="bg-emerald-800 pt-12 pb-4 text-center">
            <p class="text-white font-semibold text-base font-Kantumruy">បញ្ជាក់មុនពេលបង់ប្រាក់</p>
          </div>

          <!-- Body -->
          <div class="p-5">
            <p
              class="text-sm text-slate-500 dark:text-slate-400 font-Kantumruy mb-4 leading-relaxed"
            >
              សូមពិនិត្យឲ្យបានច្បាស់លាស់នូវចំណុចខាងក្រោមមុនពេលបង់ប្រាក់
            </p>

            <!-- Checklist -->
            <div class="flex flex-col gap-3 mb-5">
              <div
                v-for="(item, index) in checklistItems"
                :key="index"
                class="flex items-start gap-3"
              >
                <div
                  class="w-5 h-5 rounded-full bg-emerald-50 border-[1.5px] border-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <span class="text-[11px] font-medium text-emerald-800">{{ item.number }}</span>
                </div>
                <p
                  class="text-sm text-slate-700 dark:text-slate-300 font-Kantumruy leading-relaxed"
                  v-html="item.text"
                />
              </div>
            </div>

            <!-- Countdown -->
            <div
              class="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-3 flex items-center gap-3"
            >
              <svg width="32" height="32" viewBox="0 0 36 36" class="flex-shrink-0 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#065f46"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                  style="transition: stroke-dashoffset 1s linear"
                />
              </svg>
              <p
                class="text-xs text-slate-500 dark:text-slate-400 font-Kantumruy flex-1 leading-relaxed"
              >
                សារនឹងបិទស្វ័យប្រវត្តិក្នុងរយៈពេល
                <span class="font-semibold text-red-500 text-lg dark:text-red-500">{{
                  remaining
                }}</span>
                វិនាទី
              </p>
              <button
                @click="togglePause"
                class="text-xs px-3 bg-red-500 text-white py-1 rounded-md cursor-pointer hover:bg-red-600 dark:hover:bg-red-700 transition font-Kantumruy"
              >
                {{ paused ? 'បន្ត' : 'ផ្អាក' }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-slate-200 dark:border-slate-700 px-5 py-3 flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 py-2.5 text-sm font-Kantumruy text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              បោះបង់
            </button>
            <button
              @click="handleConfirm"
              class="flex-[2] py-2.5 text-sm font-semibold font-Kantumruy text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition"
            >
              យល់ព្រម បញ្ជាក់
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

import { InfoIcon } from '@/stores/Icons'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const TOTAL_SECONDS = 10
const remaining = ref(TOTAL_SECONDS)
const paused = ref(false)
const circumference = 2 * Math.PI * 15

const dashOffset = computed(() => circumference * (1 - remaining.value / TOTAL_SECONDS))

const checklistItems = [
  {
    number: '១',
    text: 'សូមពិនិត្យ <strong>ចំនួនទឹកប្រាក់</strong> ឲ្យត្រឹមត្រូវមុនពេលបង់',
  },
  {
    number: '២',
    text: 'ប្រសិនបើបង់ដោយ <strong>ដៃ</strong> សូម Upload វិក្កយបត្រ (receipt) ឲ្យបានច្បាស់',
  },
  {
    number: '៣',
    text: 'ប្រសិនបើបង់ដោយ <strong>PayWay</strong> សូមមិនបិទ browser រហូតដល់ការបង់ប្រាក់បញ្ចប់',
  },
  {
    number: '៤',
    text: 'ព័ត៌មានបង់ប្រាក់នឹងត្រូវបានពិនិត្យដោយ <strong>អ្នកគ្រប់គ្រង</strong> ប្រសិនបើមានបញ្ហា សូមទាក់ទង Admin',
  },
]

let timer: ReturnType<typeof setInterval> | null = null

function startTimer() {
  timer = setInterval(() => {
    if (paused.value) return
    remaining.value--
    if (remaining.value <= 0) {
      stopTimer()
      close()
    }
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function resetTimer() {
  stopTimer()
  remaining.value = TOTAL_SECONDS
  paused.value = false
}

function togglePause() {
  paused.value = !paused.value
}

function close() {
  emit('update:modelValue', false)
}

function handleCancel() {
  resetTimer()
  emit('cancel')
  close()
}

function handleConfirm() {
  resetTimer()
  emit('confirm')
  close()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      resetTimer()
      startTimer()
    } else {
      resetTimer()
    }
  },
)

onUnmounted(() => {
  stopTimer()
})
</script>
