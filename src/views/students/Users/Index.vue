<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import Profile_Infos from '@/components/students_component/Profile_Infos.vue'
</script>

<template>
  <StudentLayouts>
    <div class="p-4">
      <Profile_Infos />
    </div>
  </StudentLayouts>
</template>
