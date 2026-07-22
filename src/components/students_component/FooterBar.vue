<script setup lang="ts">
import YouTubeIcon from '@/assets/icons/YouTubeIcon.vue'
import { FaceBookIcon, LogoSchool } from '@/stores/Icons'
import { MapPin, Phone, Mail } from '@lucide/vue'
</script>

<template>
  <footer class="relative bg-gradient-to-b from-green-900 to-green-950 text-white overflow-hidden">
    <!-- Decorative top accent -->
    <div
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-green-400 to-amber-400"
    ></div>

    <!-- Subtle background pattern -->
    <div class="absolute inset-0 opacity-5 pointer-events-none">
      <div class="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-green-400 blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-amber-400 blur-3xl"></div>
    </div>

    <!-- Main footer -->
    <div
      class="relative max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      <!-- Institute Info -->
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <img
            :src="LogoSchool"
            alt="Logo School"
            class="size-16 rounded-full ring-2 ring-amber-400/60 shadow-lg"
          />
          <div>
            <h3 class="text-base font-moul leading-snug text-shadow text-nowrap">
              វិទ្យាស្ថានបច្ចេកវិទ្យាកំពង់ស្ពឺ
            </h3>
            <p class="text-xs font-poppins text-green-200 tracking-wide">
              Kampong Spue Institute of Technology
            </p>
          </div>
        </div>
        <p class="text-sm text-green-200/90 leading-relaxed font-Kantumruy">
          Kampong Spue Institute of Technology provides quality technical education to develop
          skilled professionals for Cambodia's future.
        </p>
        <!-- Social icons -->
        <div class="flex gap-3 pt-2">
          <a
            href="#"
            class="p-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-green-900 transition-all duration-300"
          >
            <FaceBookIcon class="size-4" />
          </a>
          <a
            href="#"
            class="p-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-green-900 transition-all duration-300"
          >
            <YouTubeIcon class="size-4" />
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div v-if="false">
        <h3 class="text-lg font-semibold mb-4 font-Kantumruy relative inline-block">
          Quick Links
          <span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-400 rounded-full"></span>
        </h3>
        <ul class="space-y-2.5 text-sm text-green-200/90 font-Kantumruy">
          <li
            v-for="link in ['Home', 'About Us', 'Departments', 'Admissions', 'Contact']"
            :key="link"
          >
            <a
              href="#"
              class="group flex items-center gap-2 hover:text-amber-300 transition-colors duration-200"
            >
              <span
                class="w-0 group-hover:w-2 h-px bg-amber-300 transition-all duration-200"
              ></span>
              {{ link }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h3 class="text-lg font-semibold mb-4 font-Kantumruy relative inline-block">
          Contact Us
          <span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-400 rounded-full"></span>
        </h3>
        <ul class="space-y-3 text-sm text-green-200/90 font-Kantumruy">
          <li class="flex items-start gap-2.5">
            <MapPin class="size-4 mt-0.5 text-amber-300 shrink-0" />
            <span>ផ្លូវជាតិលេខ​​ ៤៤ ភូមិអូរអង្គំ ឃុំអមលាំង ស្រុកថ្ពង ខេត្ត​កំពង់ស្ពឺ</span>
          </li>
          <li class="flex items-center gap-2.5">
            <Phone class="size-4 text-amber-300 shrink-0" />
            <span>+855 89 511 383</span>
          </li>
          <li class="flex items-center gap-2.5">
            <Mail class="size-4 text-amber-300 shrink-0" />
            <span>info@ksit.edu.kh</span>
          </li>
        </ul>
      </div>

      <!-- Map -->
      <div>
        <h3 class="text-lg font-semibold mb-4 font-Kantumruy relative inline-block">
          Location
          <span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-amber-400 rounded-full"></span>
        </h3>
        <div
          class="w-full h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg hover:shadow-amber-400/20 transition-shadow duration-300"
        >
          <iframe
            class="w-full h-full grayscale-[20%] contrast-125"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=R74M%2BFX4,+Kampong+Speu&output=embed"
          >
          </iframe>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="relative border-t border-white/10 py-4 bg-black/10">
      <p class="text-center text-xs text-green-200/80 font-Kantumruy tracking-wide">
        © 2026 Kampong Spue Institute of Technology. All rights reserved.
      </p>
    </div>
  </footer>
</template>
