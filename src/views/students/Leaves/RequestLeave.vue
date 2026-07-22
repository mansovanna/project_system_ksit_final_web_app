<script setup lang="ts">
import StudentLayouts from '@/layouts/StudentLayouts.vue'
import RequestLeaveForm from '@/components/students_component/RequestLeaveForm.vue'
</script>

<template>
  <StudentLayouts>
    <div class="p-4 flex max-lg:flex-col gap-4">
      <RequestLeaveForm />
    </div>
  </StudentLayouts>
</template>
