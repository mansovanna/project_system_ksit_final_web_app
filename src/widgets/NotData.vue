<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { NotDataIcon, NotDataSVGICON } from '@/stores/Icons'
defineProps({
  message: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 200,
  },
})
</script>

<template>
  <div class="text-nowrap flex flex-col items-center justify-center">
    <div :style="{ width: `${size}px` }">
      <img :src="NotDataSVGICON" alt="" />
    </div>
    <span v-html="message" class="font-Kantumruy text-slate-500 dark:text-slate-400 text-lg"></span>
  </div>
</template>
