<script setup lang="ts">
import { SearchIcon } from '@/stores/Icons'
</script>

<template>
  <div
    class="bg-white h-50 rounded-xl mt-4 p-6 border border-slate-300 flex justify-center items-center gap-4"
  >
    <!--  -->
    <p class="font-Kantumruy font-medium text-red-500">Data is availableData!</p>
    <component class="text-red-400 w-12 h-12" :is="SearchIcon" />
  </div>
</template>
