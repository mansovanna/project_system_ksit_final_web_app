<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: false },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  name: { type: String, default: '' },
  id: { type: String, default: '' },
  error: { type: String, default: '' },
  class: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const value = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})

const hasPrefix = computed(() => !!slots.prefix)
const hasSuffix = computed(() => !!slots.suffix)
</script>

<template>
  <div class="w-full" :class="props.class">
    <label
      v-if="label"
      :for="id"
      class="block mb-1 text-sm font-Kantumruy text-slate-600 dark:text-slate-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative w-full">
      <!-- prefix slot -->
      <div
        v-if="hasPrefix"
        class="absolute top-0 bottom-0 left-0 flex justify-center items-center p-2 text-slate-400"
      >
        <slot name="prefix" />
      </div>

      <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :id="id"
        class="border py-2 rounded-md w-full placeholder:font-Kantumruy font-Kantumruy focus:outline-2 focus:outline-offset-2 focus:outline-blue-100 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
        :class="[
          hasPrefix ? 'pl-10' : 'pl-4',
          hasSuffix ? 'pr-10' : 'pr-4',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-200 bg-red-100 text-red-400 dark:bg-red-900 dark:text-red-100'
            : 'border-slate-300 dark:border-slate-600 focus:border-blue-400 bg-slate-50 dark:bg-slate-900 dark:text-white placeholder:text-slate-400 text-slate-600 ',
        ]"
      />

      <!-- suffix slot -->
      <div
        v-if="hasSuffix"
        class="absolute top-0 bottom-0 right-0 flex justify-center items-center p-2 text-slate-400"
      >
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-500 font-Kantumruy">
      {{ error }}
    </p>
  </div>
</template>
