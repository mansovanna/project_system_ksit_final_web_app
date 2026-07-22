<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
  error?: string
  label?: string
  required?: boolean
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <p v-if="label" class="font-Kantumruy text-sm text-slate-500">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </p>
    <div class="relative">
      <input
        :type="type || 'text'"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        class="w-full px-3 py-2 font-Kantumruy rounded-md focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
        :class="[
          error
            ? 'border-red-500 ring-2 ring-red-500/40 bg-red-500/10'
            : 'bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700',
          $slots.default ? 'pl-10' : '',
        ]"
      />

      <div
        v-if="$slots.default"
        class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700 font-Kantumruy"
      >
        <slot />
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-500 mt-1 font-Kantumruy">{{ error }}</p>
  </div>
</template>
