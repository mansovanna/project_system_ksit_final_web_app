<script setup lang="ts">
import NavBar from '@/components/admin_component/NavBar.vue'
import SideBar from '@/components/admin_component/SideBar.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>
`

<!-- ----------------------------------------------------------------------------------- -->
<template>
  <div class="flex w-full max-h-screen relative">
    <SideBar
      class="max-md:fixed duration-400 ease-in-out z-50"
      :class="appStore.isMenuApp ? 'max-md:left-0' : ' max-md:-left-full'"
    />

    <!-- block overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-40 opacity-0 duration-300 ease-in-out transition-opacity"
      @click="appStore.isMenuApp = false"
      :class="!appStore.isMenuApp ? 'pointer-events-none ' : 'max-md:opacity-100'"
    ></div>
    <!-- End Block overlay -->
    <div class="w-full flex-1 flex flex-col min-h-screen overflow-y-auto">
      <NavBar class="sticky top-0 right-0 z-30" />

      <main class="w-full">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
