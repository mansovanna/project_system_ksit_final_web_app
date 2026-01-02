<script setup lang="ts">
import { CloseIcon } from '@/stores/Icons'
</script>

<template>
  <div
    class="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-700 rounded-xl w-full max-w-xl shadow-lg relative overflow-clip"
      @click.stop
    >
      <div class="w-full flex justify-between items-center p-4">
        <!-- Block -->
        <button
          @click="$emit('close')"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>

        <h1 class="font-Kantumruy text-lg font-medium text-slate-600 dark:text-slate-300">
          Update Building
        </h1>
      </div>
      <hr class="text-slate-300 dark:text-slate-500" />
      <!-- Icon -->
      <div>
        <div class="flex flex-col justify-start items-start gap-3 p-4 w-full">
          <!-- ----------- -->
          <div class="w-full grid grid-cols-2 gap-4">
            <div class="w-full">
              <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Name</span>
              <div class="mt-1">
                <input
                  type="text"
                  placeholder="Please Enter"
                  class="w-full p-2 border border-slate-200 dark:text-slate-100 placeholder:font-Kantumruy dark:border-slate-400 rounded focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <!-- ------------- -->
            <div class="w-full">
              <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Name</span>
              <div class="mt-1">
                <select
                  class="w-full capitalize dark:text-slate-300 font-Kantumruy p-2.5 border border-slate-200 dark:border-slate-400 rounded focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="male" class="w-full capitalize p-2">male</option>
                  <option value="female" class="w-full capitalize p-2">female</option>
                </select>
              </div>
            </div>

            <!-- <div class="w-full">
              <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Floor</span>
              <div class="mt-1">
                <input
                  type="number"
                  placeholder="Please Enter"
                  class="w-full p-2 border placeholder:font-Kantumruy dark:text-slate-100 border-slate-200 dark:border-slate-400 rounded focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div class="w-full">
              <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Rooms</span>
              <div class="mt-1">
                <input
                  type="number"
                  placeholder="Please Enter"
                  class="w-full p-2 border placeholder:font-Kantumruy dark:text-slate-100 border-slate-200 dark:border-slate-400 rounded focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div> -->
          </div>
          <div class="w-full flex justify-end mt-4">
            <button
              class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-Kantumruy rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
