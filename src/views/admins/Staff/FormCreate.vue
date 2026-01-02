<script setup lang="ts">
import { CloseIcon, PrintIcon } from '@/stores/Icons'
import { useStaffStore } from '@/stores/staffStore'

const staffStore = useStaffStore()
</script>

<template>
  <div
    class="w-full h-screen fixed bg-black/20 flex justify-center items-center z-50"
    @click="staffStore.handleCrate"
  >
    <Transition name="bounce">
      <div v-if="staffStore.isShowCreate" class="w-1/2 bg-white shadow rounded-lg" @click.stop>
        <div class="flex flex-row justify-between items-center p-4">
          <h1 class="font-Kantumruy font-medium text-xl">Form Add Staff</h1>

          <button
            @click="staffStore.handleCrate"
            class="w-8 h-8 bg-red-400 text-white flex justify-center items-center rounded-full cursor-pointer hover:bg-red-500"
          >
            <component :is="CloseIcon" />
          </button>
        </div>
        <hr class="text-slate-300" />
        <div class="px-4 py-3">
          <div class="grid grid-cols-2 gap-4">
            <!-- User Name -->
            <div class="flex flex-col">
              <label class="font-Kantumruy">User Name</label>
              <input
                type="text"
                class="px-4 py-2 border border-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 mt-2 rounded"
              />
            </div>

            <!-- Email -->
            <div class="flex flex-col">
              <label class="font-Kantumruy">Email</label>
              <input
                type="email"
                class="px-4 py-2 border border-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 mt-2 rounded"
              />
            </div>

            <!-- Bio -->
            <div class="flex flex-col">
              <label class="font-Kantumruy">Bio</label>
              <input
                type="text"
                class="px-4 py-2 border border-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 mt-2 rounded"
              />
            </div>

            <!-- Phone -->
            <div class="flex flex-col">
              <label class="font-Kantumruy">Phone</label>
              <input
                type="text"
                class="px-4 py-2 border border-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 mt-2 rounded"
              />
            </div>

            <!-- Password -->
            <div class="flex flex-col">
              <label class="font-Kantumruy">Password</label>
              <input
                type="text"
                class="px-4 py-2 border border-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 mt-2 rounded"
              />
            </div>
            <!-- Password Confirm -->
            <div class="flex flex-col">
              <label class="font-Kantumruy">Password Confirm</label>
              <input
                type="text"
                class="px-4 py-2 border border-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 mt-2 rounded"
              />
            </div>
          </div>

          <div class="w-full flex justify-end items-center mt-4">
            <button
              class="px-4 py-2 bg-blue-600 text-white font-Kantumruy rounded cursor-pointer hove:bg-blue-400 flex justify-center items-center gap-2"
            >
              <component :is="PrintIcon" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
