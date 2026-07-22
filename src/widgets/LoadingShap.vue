<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const prop: any = defineProps({
  title: {
    type: String,
  },
})
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 rounded-2xl">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <p v-if="prop.title" class="ml-2 font-Kantumruy">{{ prop.title ?? '' }}</p>
  </div>
</template>
