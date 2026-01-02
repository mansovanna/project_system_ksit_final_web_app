<script setup lang="ts">
import { UserFillIcon } from '@/stores/Icons'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  icon: { type: [Object, String], default: UserFillIcon },
  iconColor: {
    type: String,
  },
})
</script>

<template>
  <div
    class="w-full p-4 rounded-xl shadow-md flex gap-6 justify-start items-start overflow-clip relative"
    :class="color ? color : 'bg-white'"
  >
    <!--  -->
    <div class="rounded-full p-3" :class="color ? 'bg-white' : 'bg-slate-100'">
      <component
        :is="icon ?? UserFillIcon"
        class="w-10 h-10"
        :class="iconColor ?? 'text-slate-400'"
      />
    </div>

    <!-- Block info... -->
    <div :class="color ? 'text-white' : 'text-slate-500'">
      <h1 class="font-Kantumruy font-medium text-base">{{ props.title ?? 'Null' }}</h1>
      <p class="font-Kantumruy font-semibold text-xl">100K</p>
    </div>

    <!-- Block Style -->
    <span class="w-30 h-30 bg-slate-200/30 rounded-full absolute top-1 bottom-0 -right-15"></span>
    <span class="w-20 h-20 bg-slate-200/20 rounded-full absolute -top-5 bottom-0 right-20"></span>
  </div>
</template>
