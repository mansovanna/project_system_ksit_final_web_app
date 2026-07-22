<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import PaymentForm from '@/components/students_component/PaymentForm.vue'
import StudentLayouts from '@/layouts/StudentLayouts.vue'
</script>

<template>
  <StudentLayouts>
    <div class="w-full p-4">
      <PaymentForm />
    </div>
  </StudentLayouts>
</template>
