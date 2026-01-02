<script setup lang="ts">
import NavBar from '@/components/admin_component/NavBar.vue'
import SideBar from '@/components/admin_component/SideBar.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
`

<!-- ----------------------------------------------------------------------------------- -->
<template>
  <div class="flex w-full max-h-screen relative">
    <SideBar :title="props.title" class="max-md:fixed max-md:-left-full duration-400 ease-in-out" />
    <div class="w-full flex-1 flex flex-col min-h-screen overflow-y-auto">
      <NavBar class="sticky top-0 right-0 z-40" />

      <main class="w-full">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
