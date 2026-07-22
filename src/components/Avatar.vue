<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'

const avatar = useAvatar()

const props = defineProps<{
  image: string
  title: string
  url: string
}>()
</script>

<template>
  <img
    :src="props.image ? props.url + props.image : avatar.textToImage(props.title ?? 'User')"
    alt="avatar"
    class="w-full h-full rounded-full font-Kantumruy flex justify-center items-center object-center object-cover border-2 border-blue-600"
  />
</template>
