<script setup lang="ts">
import NavBar from '@/components/students_component/StudentNavBar.vue'
import SideBar from '@/components/students_component/StudentSidebar.vue'
// import { useAppStore } from '@/stores/app'

// const appStore = useAppStore()
</script>

<!-- ----------------------------------------------------------------------------------- -->
<template>
  <div class="flex w-full max-h-screen relative">
    <SideBar class="max-lg:fixed duration-400 ease-in-out max-lg:-left-full z-50 max-lg:top-0" />
    <!-- :class="appStore.isMenuApp ? 'left-0' : ''" -->
    <!-- overlay -->
    <!-- <div
      class="fixed max-lg:flex hidden w-full h-screen z-40 top-0 duration-200 ease-in-out bg-dark/50"
      :class="appStore.isMenuApp ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      @click="appStore.toggleApp()"
    ></div> -->
    <!-- End overlay -->
    <div class="w-full flex-1 flex flex-col min-h-screen overflow-y-auto">
      <NavBar class="sticky top-0 right-0 z-30 max-lg:-top-16" />

      <main class="w-full">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
