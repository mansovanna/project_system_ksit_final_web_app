<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { DateIcon } from '@/stores/Icons'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)

  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div
    class="bg-white/70 dark:bg-gray-900/50 rounded-2xl shadow hover:shadow-lg transition p-6 max-md:p-5 border-l-4 max-lg:max-w-full max-w-[600px] max-lg:w-full mx-auto border-warning"
  >
    <!-- Header -->

    <!-- Titles -->
    <h2 class="font-hanuman text-xl text-green-800 dark:text-white font-bold mb-1">
      {{ authStore.data_annon?.data.title ?? 'Null' }}
    </h2>
    <span
      class="text-sm text-slate-500 font-Kantumruy dark:text-slate-300 flex justify-start items-center"
    >
      <component :is="DateIcon" />
      {{
        authStore.data_annon?.data.created_at
          ? formatDateTime(authStore.data_annon?.data.created_at)
          : 'Null'
      }}
    </span>

    <!-- Description -->
    <p class="font-Kantumruy text-slate-700 dark:text-white leading-relaxed line-clamp-2">
      {{ authStore.data_annon?.data.description ?? 'Null' }}
    </p>

    <!-- Action -->
    <div class="mt-4">
      <button
        disabled
        @click="router.push({ name: 'view-detail', params: { id: authStore.data_annon?.data.id } })"
        class="text-sm font-Kantumruy text-green-800 dark:text-slate-300 hover:text-warning transition cursor-pointer"
      >
        អានបន្ថែម →
      </button>
    </div>
  </div>
</template>
