<script setup lang="ts">
import { LogoSchool } from '@/stores/Icons'
</script>

<template>
  <div class="w-full flex flex-col gap-4 justify-center items-center">
    <img :src="LogoSchool" alt="" class="w-32 h-32 rounded-full" />
    <div class="flex flex-col justify-center items-center">
      <h1 class="font-Kantumruy text-xl text-white font-bold">Welcome to KSIT</h1>
      <h1 class="font-Kantumruy text-white">Dormitory System Management</h1>
    </div>
  </div>
</template>
