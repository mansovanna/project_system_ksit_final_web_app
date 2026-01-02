<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
</script>
<template>
  <StudentLayouts>
    <div>
      <div class="w-full bg-slate-500 relative">
        <img
          class="w-full h-[80vh] object-cover object-center"
          src="https://ksit.edu.kh/wp-content/uploads/2025/06/photo_2025-06-11_16-45-53-1200x600.jpg"
          alt=""
        />

        <div class="absolute top-0 bottom-0 right-0 left-0 bg-dark/70"></div>
        <!-- <div class="absolute right-0 left-0 bottom-0 h-1/2 bg-amber-50"></div> -->4

        <div class="w-90 h-90 rounded-full bg-slate-50/20 absolute top-0 -left-50"></div>
      </div>
    </div>
  </StudentLayouts>
</template>
