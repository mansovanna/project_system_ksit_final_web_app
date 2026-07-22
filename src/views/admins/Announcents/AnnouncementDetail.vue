<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnnouncementStore } from '@/stores/announcement_store'
import { ref, onMounted, computed } from 'vue'
import {
  ArrowBackIcon,
  ClockIcon,
  CloseIcon,
  DateIcon,
  DeleteIcon,
  DocumentIcon,
  DownloadIcon,
  EditIcon,
  LinkIcon,
  ViewIcon,
} from '@/stores/Icons'
import Loading from '@/widgets/Loading.vue'
import NotData from '@/widgets/NotData.vue'

const route = useRoute()
const router = useRouter()
const announcementStore = useAnnouncementStore()
const id = route.params.id as string

const announcement = computed(() => announcementStore.data_list?.data)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const formatTime = (time: string) =>
  new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

// Block handle file for update file pdf or png
const selectedFile = ref<File | null>(null)
const fileTypeError = ref(false)

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  fileTypeError.value = false
  selectedFile.value = null

  if (!file) return

  const allowed = ['application/pdf', 'image/png']

  if (!allowed.includes(file.type)) {
    fileTypeError.value = true
    target.value = ''
    return
  }

  selectedFile.value = file
}

const updateFile = () => {
  if (!selectedFile.value) return
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  announcementStore.updateAnnouncementFile(announcementStore.item.id, formData)
}

// handle add file
const handleFiles = (e: Event) => {
  announcementStore.isErrorMessage.file = ''
  announcementStore.formData.files = []
  const target = e.target as HTMLInputElement

  if (target.files) {
    announcementStore.formData.files = Array.from(target.files)
  }
}

const submitAddFiles = () => {
  const formData = new FormData()
  if (announcementStore.formData.files) {
    announcementStore.formData.files.forEach((file) => {
      formData.append('files[]', file)
    })
    formData.append('announcement_id', id)
  }
  announcementStore.addFiles(formData)
}

const handleOpenFormAddFile = () => {
  announcementStore.item.id = ''
  announcementStore.item.status = 'create'
  announcementStore.isShowUpdateFile = !announcementStore.isShowUpdateFile
}

// handle butto update file
const handleUpdateFile = (id: string) => {
  announcementStore.isShowUpdateFile = !announcementStore.isShowUpdateFile
  announcementStore.item.id = id
  announcementStore.item.status = 'update'
}

// handle reset data file
const handleResetFile = () => {
  selectedFile.value = null
  announcementStore.isShowUpdateFile = false
  announcementStore.item.id = ''
  announcementStore.item.status = ''
}

// Handle Delete
const handleDeleteFile = (id: string) => {
  announcementStore.deleteFile(id)
}

// ---------------

onMounted(() => announcementStore.announcementDetail(id))
</script>

<template>
  <AdminLayouts @click="handleResetFile">
    <div class="w-full p-4 md:p-6">
      <!-- Back Button -->
      <button
        @click="router.back()"
        class="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium font-Kantumruy text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white dark:hover:bg-red-700 transition-all duration-200"
      >
        <component :is="ArrowBackIcon" class="w-4 h-4" />
        ត្រលប់ក្រោយ
      </button>

      <!-- Loading State -->
      <div v-if="announcementStore.isLoading" class="flex justify-center items-center p-6">
        <div class="w-10 h-10"><Loading /></div>
      </div>

      <!-- Main Content -->
      <div
        v-if="!announcementStore.isLoading && announcementStore.data_list?.data"
        class="w-full p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
      >
        <!-- Title -->
        <h1 class="font-Kantumruy text-2xl text-slate-700 dark:text-white">
          {{ announcement?.title }}
        </h1>

        <!-- Meta Row -->
        <div class="flex items-center gap-4 mt-2 flex-wrap">
          <div class="flex items-center gap-1 text-slate-500 text-sm font-Kantumruy">
            <component :is="DateIcon" />
            {{ formatDate(String(announcement?.created_at)) }}
          </div>
          <div class="flex items-center gap-1 text-slate-500 text-sm font-Kantumruy">
            <component :is="ClockIcon" class="w-4 h-4" />
            {{ formatTime(String(announcement?.created_at)) }}
          </div>

          <!-- Status Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-1 rounded-full border capitalize font-Kantumruy text-sm relative"
            :class="announcement?.status === 'public' ? 'text-green-600' : 'text-red-600'"
          >
            <div class="absolute -top-1 right-0">
              <span class="relative flex size-3">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  :class="announcement?.status === 'public' ? 'bg-green-400' : 'bg-red-400'"
                />
                <span
                  class="relative inline-flex size-3 rounded-full"
                  :class="announcement?.status === 'public' ? 'bg-green-500' : 'bg-red-500'"
                />
              </span>
            </div>
            {{ announcement?.status === 'public' ? 'public' : 'private' }}
          </div>
        </div>

        <hr class="my-3 border-slate-200 dark:border-slate-700" />

        <!-- Description -->
        <p class="font-Kantumruy text-slate-500 dark:text-slate-400 text-lg">
          {{ announcement?.description }}
        </p>

        <hr class="my-3 border-slate-200 dark:border-slate-700" />

        <!-- Attachment Label -->
        <div class="flex items-center justify-between relative overflow-x-visible">
          <div class="flex items-center gap-1.5 mb-2 text-slate-500 text-sm font-Kantumruy">
            <component :is="LinkIcon" class="w-4 h-4" />
            ឯកសារភ្ជាប់
          </div>

          <!-- Block button create add -->
          <div @click.stop>
            <button
              @click="handleOpenFormAddFile()"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg capitalize cursor-pointer"
            >
              add file
            </button>
          </div>
          <!-- End Button create add -->
          <!-- Block form create file or add file -->

          <div
            @click.stop
            v-if="announcementStore.isShowUpdateFile && announcementStore.item.status === 'create'"
            class="absolute mt-4 bg-white max-w-lg max-md:left-0 top-10 w-full dark:bg-slate-800 rounded-xl p-6 border border-slate-300 dark:border-slate-600 shadow-lg z-10 right-0"
          >
            <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-1">Add file</h2>

            <div class="space-y-5">
              <div>
                <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Create new file or add new file is pdf or png!
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png"
                  @change="handleFiles"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                />
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  @click="announcementStore.isShowUpdateFile = false"
                  class="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="submitAddFiles"
                  :disabled="
                    !announcementStore.formData.files.length ||
                    announcementStore.isLoadingUpdate.isLoading
                  "
                  class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div class="flex items-center gap-1.5">
                    <div v-if="announcementStore.isLoadingUpdate.isLoading" class="w-5 h-5">
                      <Loading />
                    </div>
                    <span>{{
                      announcementStore.isLoadingUpdate.isLoading ? 'Loading...' : 'Update file'
                    }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- End Block form create file or add file -->
        </div>
        <!-- Block show file -->
        <div
          v-if="announcementStore.data_list?.data.files.length"
          class="grid grid-cols-4 gap-4 mt-4 max-lg:grid-cols-2 max-md:grid-cols-1"
        >
          <template v-for="(item, index) in announcementStore.data_list?.data.files" :key="index">
            <!-- PDF Attachment -->
            <div
              v-if="item.type === 'pdf'"
              class="relative flex flex-col bg-slate-100 dark:bg-slate-700 rounded-lg p-4 overflow-visible"
              :class="item.type == 'pdf' ? 'col-span-4' : 'col-span-4'"
            >
              <!-- Header -->
              <div class="w-full flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <div
                    class="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white"
                  >
                    <component :is="DocumentIcon" class="w-5 h-5" />
                  </div>

                  <span
                    class="font-Kantumruy text-slate-600 dark:text-slate-300 font-semibold uppercase"
                  >
                    {{ item.file_name }}
                  </span>
                </div>

                <div class="flex items-center gap-3" @click.stop>
                  <button
                    @click="handleUpdateFile(String(item.id))"
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-blue-500"
                  >
                    <component :is="EditIcon" />
                  </button>

                  <!-- Block Button delete -->

                  <button
                    @click="handleDeleteFile(String(item.id))"
                    :disabled="
                      announcementStore.item.id === String(item.id) &&
                      announcementStore.item.isLoading
                    "
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-red-500 cursor-pointer"
                  >
                    <div class="w-5 h-5 flex justify-center items-center">
                      <component
                        :is="
                          announcementStore.item.id === String(item.id) &&
                          announcementStore.item.isLoading &&
                          announcementStore.item.status === 'delete'
                            ? Loading
                            : DeleteIcon
                        "
                      />
                    </div>
                  </button>
                  <!-- End Block Button delete -->

                  <button
                    @click="
                      announcementStore.downloadFile(String(item.id), item.file_url, item.file_name)
                    "
                    :disabled="
                      announcementStore.item.id === String(item.id) &&
                      announcementStore.item.isLoading &&
                      announcementStore.item.status === 'download'
                    "
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-blue-500 cursor-pointer"
                  >
                    <div class="w-5 h-5 flex justify-center items-center">
                      <component
                        :is="
                          announcementStore.item.id === String(item.id) &&
                          announcementStore.item.isLoading &&
                          announcementStore.item.status === 'download'
                            ? Loading
                            : DownloadIcon
                        "
                      />
                    </div>
                  </button>
                </div>
              </div>

              <!-- Update Panel -->
              <transition name="fade">
                <div
                  v-if="
                    announcementStore.isShowUpdateFile &&
                    announcementStore.item.id == String(item.id)
                  "
                  class="absolute top-full right-0 mt-3 w-96 max-w-[95vw] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-lg p-4 z-50"
                  @click.stop
                >
                  <!-- Header -->
                  <div class="mb-3">
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Replace file
                    </label>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Choose a new file to replace the current one
                    </p>
                  </div>

                  <!-- Input -->
                  <input
                    type="file"
                    accept=".pdf,.png"
                    @change="handleFile"
                    :class="[
                      'border rounded px-3 py-2 w-full',
                      fileTypeError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500',
                    ]"
                  />
                  <p v-if="fileTypeError" class="text-red-500 text-sm mt-1">
                    Only PDF or PNG files are allowed.
                  </p>

                  <!-- Preview (optional but useful) -->
                  <div v-if="selectedFile" class="mt-2 text-xs text-slate-500">
                    Selected: {{ selectedFile.name }}
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      @click="handleResetFile"
                      class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      <component :is="CloseIcon" />
                    </button>

                    <button
                      type="button"
                      @click="updateFile"
                      :disabled="!selectedFile || announcementStore.item.isLoading"
                      class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          v-if="
                            announcementStore.item.isLoading &&
                            String(item.id) === announcementStore.item.id
                          "
                          class="w-4 h-4"
                        >
                          <Loading />
                        </div>

                        <span>
                          {{ announcementStore.item.isLoading ? 'Loading...' : 'Save' }}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
            <!-- End PDF Attachment -->
            <!-- ---------------------------- -->
            <!-- Image Attachment -->
            <div
              v-else-if="item.type === 'image'"
              class="relative overflow-hidden rounded-lg border border-slate-300 bg-slate-200 dark:bg-slate-800 group"
            >
              <!-- Image -->
              <img
                :src="item.file_url"
                :alt="item.file_name"
                class="w-full max-h-96 object-cover"
              />

              <!-- Overlay Actions -->
              <div
                class="absolute inset-0 flex items-center justify-center gap-3 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <!-- Edit -->
                <div @click.stop>
                  <button
                    @click="handleUpdateFile(String(item.id))"
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-500 hover:bg-slate-200"
                  >
                    <component :is="EditIcon" />
                  </button>
                </div>

                <!-- View -->
                <button
                  @click="announcementStore.preViewFile(item.file_url)"
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-warning text-white hover:bg-warning/80 cursor-pointer"
                >
                  <component :is="ViewIcon" />
                </button>

                <!-- Delete -->
                <button
                  @click="handleDeleteFile(String(item.id))"
                  :disabled="
                    announcementStore.item.id === String(item.id) &&
                    announcementStore.item.isLoading
                  "
                  class="flex items-center justify-center w-10 h-10 rounded-full bg-white text-red-500 hover:bg-slate-200"
                >
                  <component
                    :is="
                      announcementStore.item.id === String(item.id) &&
                      announcementStore.item.isLoading &&
                      announcementStore.item.status === 'delete'
                        ? Loading
                        : DeleteIcon
                    "
                  />
                </button>
              </div>

              <!-- Loading Overlay -->
              <div
                v-if="
                  announcementStore.item.id === String(item.id) &&
                  announcementStore.item.isLoading &&
                  ['delete', 'update'].includes(announcementStore.item.status)
                "
                class="absolute inset-0 flex items-center justify-center bg-black/50"
              >
                <div class="w-10 h-10">
                  <Loading />
                </div>
              </div>

              <!--  -->
              <!-- update fiel -->
              <div
                v-if="
                  announcementStore.isShowUpdateFile && announcementStore.item.status === 'update'
                "
                @click.stop
                class="fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center p-4 bg-black/50 z-50"
              >
                <!-- Update File Panel -->
                <transition name="fade">
                  <div
                    v-if="announcementStore.isShowUpdateFile"
                    class="top-full right-0 mt-3 z-50 w-96 max-w-[95vw] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 shadow-xl"
                    @click.stop
                  >
                    <!-- Header -->
                    <div class="mb-4">
                      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Replace File
                      </h3>

                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        Choose a new PDF or PNG file.
                      </p>
                    </div>

                    <!-- File Input -->
                    <div>
                      <input
                        type="file"
                        accept=".pdf,.png"
                        @change="handleFile"
                        :class="[
                          'w-full rounded-lg border px-3 py-2 text-sm',
                          fileTypeError
                            ? 'border-red-500'
                            : 'border-slate-300 dark:border-slate-600',
                        ]"
                      />

                      <p v-if="fileTypeError" class="mt-1 text-sm text-red-500">
                        Only PDF or PNG files are allowed.
                      </p>

                      <div v-if="selectedFile" class="mt-2 text-xs text-slate-500">
                        {{ selectedFile.name }}
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        @click="handleResetFile"
                        class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      >
                        <component :is="CloseIcon" />
                      </button>

                      <button
                        type="button"
                        @click="updateFile"
                        :disabled="!selectedFile || announcementStore.item.isLoading"
                        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div class="flex items-center gap-2 justify-center">
                          <div
                            v-if="
                              announcementStore.item.isLoading &&
                              announcementStore.item.id === String(announcementStore.item.id)
                            "
                            class="w-8 h-8"
                          >
                            <Loading class="w-4 h-4" />
                          </div>

                          <span>
                            {{ announcementStore.item.isLoading ? 'Loading...' : 'Save' }}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <!-- ---------------------------- -->
          </template>
        </div>
        <!-- End Block show file -->

        <div v-if="announcementStore.data_list?.data.files.length === 0" class="w-full">
          <NotData />
        </div>

        <!-- Block Show Image file preview -->
        <div
          @click="announcementStore.clearFilePreview()"
          v-if="announcementStore.isPreviewFile.status"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <transition name="fade">
            <div
              v-if="announcementStore.isPreviewFile.status"
              class="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
              @click.stop
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700"
              >
                <h1 class="font-semibold text-slate-700 dark:text-slate-200">Preview Image</h1>

                <button
                  @click="announcementStore.clearFilePreview()"
                  class="p-2 rounded-full hover:bg-red-500 hover:text-white cursor-pointer text-red-600 duration-500"
                >
                  <component :is="CloseIcon" />
                </button>
              </div>

              <!-- Image -->
              <div class="flex justify-center items-center p-4 h-[80vh]">
                <img
                  :src="announcementStore.isPreviewFile.file"
                  alt="Preview"
                  class="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </transition>
        </div>
        <!-- End Block Show Image file preview -->
      </div>
    </div>
  </AdminLayouts>
</template>
