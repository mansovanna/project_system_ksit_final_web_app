<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import announcement_students from '@/components/students_component/AnnouncementStudents.vue'
import { AppIcon } from '@/stores/Icons'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/widgets/Loading.vue'

const image_slide = ref([
  'https://ksit.edu.kh/wp-content/uploads/2025/06/IMG_4164-1200x600.jpg',
  'https://ksit.edu.kh/wp-content/uploads/2025/06/IMG_2037-scaled-1200x600.jpg',
  'https://ksit.edu.kh/wp-content/uploads/2025/06/photo_2025-06-11_16-45-53-1200x600.jpg',
])

const authStore = useAuthStore()
</script>

<template>
  <div class="w-full relative">
    <!-- HERO IMAGE -->
    <img
      class="w-full h-[80vh] max-md:h-[80vh] object-cover object-center"
      :src="image_slide[0]"
      alt=""
    />

    <!-- OVERLAY -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-slate-200 dark:from-dark via-blue-900/30 to-blue-900/60"
    ></div>

    <!-- CONTENT -->
    <div
      class="absolute top-0 bottom-0 inset-0 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-8 px-4 sm:px-8 lg:px-12 pt-16 sm:pt-24 lg:pt-32"
    >
      <!-- TEXT BLOCK -->
      <div
        class="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
      >
        <h1
          class="font-hanuman font-black text-white text-2xl max-md:mt-12 sm:text-4xl lg:text-6xl leading-[1.5]"
        >
          តាំងចិត្តរៀន មានវិន័យ ច្នៃប្រឌិត
          <br class="hidden lg:block" />
          អនុវត្តពិត រួមសាមគ្គី
        </h1>

        <div class="mt-6 flex flex-row gap-4 justify-center lg:justify-start">
          <a
            href="https://t.me/+Hp2SeqYgaBgwOGQ1"
            target="_link"
            class="px-6 py-3 flex gap-0.5 bg-green-700 text-white font-Kantumruy rounded-full border border-green-700 hover:bg-transparent hover:border-white transition"
          >
            <component :is="AppIcon" />
            ទាញយកកម្មវិធី
          </a>

          <button
            @click="$router.push({ name: 'users' })"
            class="px-8 py-3 text-white font-Kantumruy rounded-full border border-white hover:bg-green-700 transition"
          >
            ចូលគណនី
          </button>
        </div>
      </div>

      <!-- ANNOUNCEMENT -->
      <div v-if="authStore.isLoading" class="p-4 bg-white dark:bg-slate-400 rounded-md">
        <div class="w-10 h-10">
          <loading />
        </div>
      </div>
      <div v-else class="w-full lg:w-auto">
        <announcement_students />
      </div>
    </div>
  </div>
</template>
