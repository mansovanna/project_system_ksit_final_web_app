<script setup lang="ts">

const props = defineProps(
  {
    title: {
      type: Object as () => { main: string, sub: string },
      required: true,
    },
  }
)


</script>


<template>
  <div>
    <h1 class="text-2xl  font-medium font-Kantumruy ">{{ props.title.main }}</h1>
    <p class="text-sm text-slate-500">{{ props.title.sub }}</p>
  </div>
</template>
