<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import IndexLayouts from '@/layouts/IndexLayouts.vue'
import staff_card_info from '@/components/students_component/staff_card_info.vue'
import Hero_Sections from '@/components/students_component/Hero_Sections.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { Building2Icon, Users2 } from '@lucide/vue'
import { FaceBookIcon } from '@/stores/Icons'
import YouTubeIcon from '@/assets/icons/YouTubeIcon.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.getOneAnnouncementOnly()
  authStore.getStaffOnly()
})
</script>

<template>
  <IndexLayouts>
    <!-- HERO SECTION -->
    <Hero_Sections />

    <!-- ANNOUNCEMENT SECTION -->

    <!-- STAFF SECTION -->
    <div class="w-full p-4 flex flex-col gap-4">
      <hr class="border-slate-300" />
      <div>
        <div class="w-full flex justify-between items-center relative">
          <div
            class="relative bg-gradient-to-r from-green-700 to-green-600 text-white font-hanuman px-10 max-lg:px-6 py-1 text-left overflow-clip"
          >
            <span class="flex items-center gap-2 text-lg">
              <Users2 class="size-5" />
              បុគ្គលិកអន្តេវាសិកដ្ឋាន
            </span>

            <!--  -->
            <div
              class="absolute z-10 max-md:-left-5 -left-1 top-0 bottom-0 border-t-0 rotate-180 dark:border-b-dark border-slate-200 border-l-transparent border-l-40 border-r-transparent border-r-0 border-b-80"
            ></div>

            <!--  -->
            <div
              class="absolute z-10 right-0 top-0 bottom-0 border-t-0 dark:border-b-dark border-slate-200 border-l-transparent border-l-40 border-r-transparent border-r-0 border-b-80"
            ></div>
          </div>

          <hr class="absolute right-0 left-0 top-0 text-green-600" />
          <RouterLink
            to="#"
            class="text-sm text-green-700 dark:text-white hover:underline font-asap py-2"
            >More</RouterLink
          >
        </div>
      </div>
      <!-- -------------------------------------------------------------- -->

      <div class="flex flex-wrap items-center justify-center gap-4 max-lg:mt-0 mt-4">
        <staff_card_info />
      </div>

      <!-- ABOUT SCHOOL SECTION -->
      <!-- <hr class="border-slate-300 my-2" /> -->
      <!-- ----------- -->
      <div class="w-full flex flex-col gap-4">
        <!-- <hr class="border-slate-300" /> -->
        <div class="w-full relative">
          <div class="w-full flex flex-row-reverse justify-between items-center">
            <div
              class="relative bg-gradient-to-l from-green-700 to-green-600 text-white font-hanuman px-10 max-lg:px-6 py-1 text-left overflow-clip"
            >
              <span class="flex items-center gap-2 text-lg pl-5">
                <Building2Icon class="size-5" />
                ទំនាក់ទំនង
              </span>

              <!--  -->
              <div
                class="absolute z-10 max-md:-left-5 -left-1 top-0 bottom-0 border-t-0 rotate-180 dark:border-b-dark border-slate-200 border-l-transparent border-l-40 border-r-transparent border-r-0 border-b-80"
              ></div>

              <!--  -->
              <div
                class="absolute z-10 right-0 top-0 bottom-0 border-t-0 dark:border-b-dark border-slate-200 border-l-transparent border-l-40 border-r-transparent border-r-0 border-b-80"
              ></div>
            </div>

            <hr class="absolute w-full right-0 left-0 top-0 text-green-600 z-10" />
            <!-- <RouterLink
              to="#"
              class="text-sm text-green-700 dark:text-white hover:underline font-asap py-2"
              >More</RouterLink
            > -->
          </div>
        </div>
        <!-- -------------------------------------------------------------- -->

        <hr class="absolute right-0 left-0 top-0 text-green-600" />
        <div class="flex justify-start items-center gap-3 max-lg:flex-col">
          <div class="w-1/2 max-lg:w-full bg-white p-4 dark:bg-slate-800 rounded-xl">
            <img
              class="rounded-xl w-full"
              src="https://ksit.edu.kh/wp-content/uploads/2025/06/IMG_4149-1200x600.jpg"
              alt=""
            />
          </div>

          <!-- Blokc info -->
          <div class="bg-white p-4 dark:bg-slate-800 rounded-xl w-1/2 max-lg:w-full">
            <ul class="flex flex-col gap-2">
              <li>
                <span class="flex gap-3 font-hanuman justify-start items-center">
                  អាសយដ្ឋាន៖ ផ្លូវជាតិលេខ​​ ៤៤ ភូមិអូរអង្គំ ឃុំអមលាំង ស្រុកថ្ពង ខេត្ត​កំពង់ស្ពឺ
                </span>
              </li>
              <li>
                <span class="flex gap-3 font-hanuman justify-start items-center">
                  លេខទំនាក់ទំនង៖​ 089 511 383 | 092 740 222 | 016 643 263
                </span>
              </li>
              <li>
                <a href="http://www.ksit.edu.kh" target="_blank" rel="noopener noreferrer">
                  <span class="flex gap-3 font-hanuman justify-start items-center">
                    គេហទំព័រ៖ www.ksit.edu.kh
                  </span>
                </a>
              </li>
              <li class="flex gap-2">
                <a href="http://www.ksit.edu.kh" target="_blank" rel="noopener noreferrer">
                  <span class="flex gap-3 font-hanuman justify-start items-center">
                    <div>
                      <component class="size-6" :is="FaceBookIcon" />
                    </div>
                  </span>
                </a>
                <a
                  href="https://www.youtube.com/@kampongspeuinstituteoftech/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="flex gap-3 font-hanuman justify-start items-center">
                    <div>
                      <component class="size-6" :is="YouTubeIcon" />
                    </div>
                  </span>
                </a>
              </li>

              <li>
                <div
                  class="w-full h-80 rounded-xl overflow-hidden border border-white/10 duration-300"
                >
                  <iframe
                    class="w-full h-full grayscale-[20%] contrast-125"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=R74M%2BFX4,+Kampong+Speu&output=embed"
                  >
                  </iframe>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- about   -->
    </div>
  </IndexLayouts>
</template>

<!-- [-webkit-text-stroke:_1px_white]
[-webkit-text-stroke:_1px_white] -->
