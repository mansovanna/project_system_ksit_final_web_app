<script setup lang="ts">
import NavBar from '@/components/students_component/NavBar.vue'
import FooterBar from '@/components/students_component/FooterBar.vue'
</script>

<template>
  <div class="w-full h-screen overflow-auto bg-slate-200 dark:bg-dark relative flex flex-col">
    <nav class="w-full px-4 fixed top-4 left-0 z-50 max-md:px-2 max-md:top-3">
      <nav-bar class="max-md:relative" />
    </nav>
    <!--  -->
    <main class="flex-1">
      <slot />
    </main>
    <footer class="w-full mt-8">
      <footer-bar />
    </footer>
  </div>
</template>
