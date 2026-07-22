<script setup lang="ts">
import { CloseIcon } from '@/stores/Icons'
import { useAnnouncementStore } from '@/stores/announcement_store'

const formData = new FormData()

const announStore = useAnnouncementStore()

// const handleFile = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   if (target.files && target.files[0]) {
//     announStore.formData.file = target.files[0]
//   }
// }

const handleFile = (e: Event) => {
  announStore.isErrorMessage.file = ''
  announStore.formData.files = []
  const target = e.target as HTMLInputElement

  if (target.files) {
    announStore.formData.files = Array.from(target.files)

    console.log(announStore.formData.files)
  }
}

const handleSave = () => {
  announStore.isErrorMessage.title = ''
  announStore.isErrorMessage.description = ''
  announStore.isErrorMessage.file = ''

  if (announStore.formData.title.length <= 0) {
    return (announStore.isErrorMessage.title = 'Required data!, Please')
  }

  if (announStore.formData.description.length <= 0) {
    return (announStore.isErrorMessage.description = 'Require data!, Please')
  }

  formData.append('title', announStore.formData.title)
  formData.append('description', announStore.formData.description)
  formData.append('status', announStore.formData.status)

  if (announStore.formData.files) {
    announStore.formData.files.forEach((file) => {
      formData.append('files[]', file)
    })
  }

  announStore.postAnnounce(formData)
}

const props = defineProps({
  isOpenCreate: {
    type: Boolean,
    default: false,
    required: true,
  },
})
</script>

<template>
  <!-- backdrop-blur-sm -->

  <div
    @click="$emit('close')"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  >
    <Transition name="model">
      <div
        v-if="props.isOpenCreate"
        class="w-full max-w-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl animate-[fadeIn_.2s_ease]"
        @click.stop
      >
        <!-- header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-400"
        >
          <h1 class="text-lg font-semibold font-Kantumruy text-gray-800 dark:text-white">
            Create Announcement
          </h1>

          <button
            @click="$emit('close')"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400 transition"
          >
            <component :is="CloseIcon" />
          </button>
        </div>

        <!-- form -->
        <form @submit.prevent="handleSave" class="p-6 pt-2 space-y-5">
          <span
            v-if="announStore.isErrorMessage.messageError"
            class="text-red-500 font-Kantumruy text-xs px-4"
            >{{ announStore.isErrorMessage.messageError }}</span
          >
          <!-- title -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700 font-Kantumruy"> Title </label>

            <input
              v-model="announStore.formData.title"
              type="text"
              placeholder="Enter announcement title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              :class="announStore.isErrorMessage.title ? 'border-red-400' : ''"
            />
            <span class="text-red-500 text-xs font-Kantumruy">{{
              announStore.isErrorMessage.title
            }}</span>
          </div>

          <!-- description -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700 font-Kantumruy"> Description </label>

            <textarea
              v-model="announStore.formData.description"
              rows="3"
              placeholder="Write announcement details..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              :class="announStore.isErrorMessage.description ? 'border-red-400' : ''"
            ></textarea>
            <span class="text-red-500 text-xs font-Kantumruy">{{
              announStore.isErrorMessage.description
            }}</span>
          </div>

          <!-- file upload -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700 font-Kantumruy"> Attachment </label>

            <input
              type="file"
              multiple
              @change="handleFile"
              accept=".pdf,.png"
              class="font-Kantumruy w-full text-sm border border-gray-300 rounded-lg file:mr-3 file:py-2 file:px-4 file:border-0 dark:file:bg-green-600 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            <p
              v-if="announStore.formData.files.length > 0"
              class="text-xs text-green-500 font-Kantumruy"
            >
              {{ announStore.formData.files.length }} file(s) selected
            </p>
          </div>

          <!-- status -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700 font-Kantumruy"> Status </label>

            <select
              v-model="announStore.formData.status"
              class="w-full px-3 font-Kantumruy py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <!-- footer buttons -->
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-400">
            <button
              type="button"
              @click="$emit('close')"
              class="px-5 py-2 dark:text-white dark:hover:text-red-500 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-Kantumruy"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="announStore.isLoadings"
              class="px-6 py-2 rounded-lg bg-green-600 cursor-pointer text-white hover:bg-green-500 transition font-Kantumruy shadow-sm"
            >
              <span v-if="announStore.isLoadings">Loading...</span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.model-enter-active,
.model-leave-active {
  transition: all 0.3s ease;
}
.model-enter-from,
.model-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
