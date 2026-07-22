<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <label class="inline-flex items-center cursor-pointer gap-2">
    <input
      type="checkbox"
      class="sr-only peer"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <div
      class="relative w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/40 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"
    />
    <span v-if="label" class="text-sm text-slate-600 dark:text-slate-400 font-Kantumruy">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
