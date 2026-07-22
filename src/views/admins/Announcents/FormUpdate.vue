<script setup lang="ts">
import { CloseIcon } from '@/stores/Icons'
import { useAnnouncementStore } from '@/stores/announcement_store'
import { computed, onMounted } from 'vue'

const announStore = useAnnouncementStore()

const emit = defineEmits(['close', 'save'])

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

/* save */
const handleSave = () => {
  emit('save', announStore.formData)
}

onMounted(() => {
  announStore.formData.title = props.title
  announStore.formData.description = props.description
  announStore.formData.status = props.status
})

const isUnchanged = computed(() => {
  return (
    props.title === announStore.formData.title &&
    props.description === announStore.formData.description &&
    props.status === announStore.formData.status
  )
})

const handleColse = () => {
  announStore.formData.title = ''
  announStore.formData.description = ''
  announStore.formData.status = 'private'
  emit('close')
}
</script>

<template>
  <div @click="handleColse" class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div
      class="w-full max-w-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl animate-[fadeIn_.2s_ease]"
      @click.stop
    >
      <!-- header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-400"
      >
        <h1 class="text-lg font-semibold font-Kantumruy text-gray-800 dark:text-white">
          Update Announcement
        </h1>

        <button
          @click="handleColse"
          class="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400 transition"
        >
          <component :is="CloseIcon" />
        </button>
      </div>

      <!-- form -->
      <form @submit.prevent="handleSave" class="p-6 pt-1 space-y-3 w-full">
        <div
          v-if="announStore.isErrorMessage.messageError"
          class="text-red-500 font-Kantumruy text-xs bg-red-500/20 w-full px-2 py-1 mt-2 rounded-lg"
        >
          {{ announStore.isErrorMessage.messageError }}
        </div>
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

        <!-- status -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700 font-Kantumruy"> Status </label>

          <select
            v-model="announStore.formData.status"
            class="w-full px-3 font-Kantumruy py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition dark:bg-black1 dark:text-white"
          >
            <option class="dark:bg-black1 dark:text-slate-700" value="public">Public</option>
            <option class="dark:bg-black1 dark:text-slate-700" value="private">Private</option>
          </select>
        </div>

        <!-- Check updated message -->
        <div
          v-if="isUnchanged || announStore.isErrorMessage.messageError"
          class="text-amber-500 text-xs font-Kantumruy"
        >
          No changes detected. Please update at least one field before saving.
        </div>

        <!-- End Check update message -->
        <!-- footer buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-400">
          <button
            type="button"
            @click="handleColse"
            class="px-5 py-2 dark:text-white dark:hover:text-red-500 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-Kantumruy"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="announStore.item.isLoading || isUnchanged"
            class="px-6 py-2 rounded-lg bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="announStore.item.isLoading">Loading...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
