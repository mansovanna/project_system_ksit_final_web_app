<script setup lang="ts">
import { CloseIcon } from '@/stores/Icons'
</script>

<template>
  <div
    @click="$emit('close')"
    class="w-full h-screen flex justify-center items-center bg-black/30 fixed top-0 right-0 bottom-0 left-0 z-50"
  >
    <div class="w-full max-w-lg bg-white rounded-lg" @click.stop>
      <div class="flex justify-between items-center p-4">
        <h1 class="font-Kantumruy font-medium">Create Announcement</h1>
        <button
          @click="$emit('close')"
          class="w-8 h-8 bg-red-500 text-white flex justify-center items-center rounded-full hover:bg-red-400 cursor-pointer"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <hr class="text-slate-300" />
      <div class="p-4 flex flex-col gap-6">
        <div>
          <label class="font-Kantumruy font-medium">Title</label>
          <input
            type="text"
            class="w-full border border-slate-300 p-2 rounded focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-200 mt-1"
          />
        </div>
        <div>
          <label class="font-Kantumruy font-medium">Body</label>
          <textarea
            class="w-full border border-slate-300 p-2 rounded focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-200 mt-1"
          ></textarea>
        </div>

        <div class="w-full flex justify-end items-center">
          <button
            class="px-6 py-2 bg-blue-600 text-white font-Kantumruy rounded-md hover:bg-blue-500 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
