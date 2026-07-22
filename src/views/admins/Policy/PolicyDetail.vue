<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowBackIcon,
  DateIcon,
  DocumentIcon,
  DownloadIcon,
  EditIcon,
  LinkIcon,
  ReloadIcon,
  ViewIcon,
} from '@/stores/Icons'
import { useRoute } from 'vue-router'
import { usePolicyStore } from '@/stores/policy_store'
import Loading from '@/widgets/Loading.vue'

const policyStore = usePolicyStore()

const expandedDescription = ref(false)
const isDownloading = ref(false)

const downloadFile = async (filePath: string) => {
  try {
    isDownloading.value = true

    const link = document.createElement('a')

    link.href = filePath

    // optional file name
    link.download = filePath.split('/').pop() || 'policy.pdf'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
  } catch (error) {
    console.error('Download failed:', error)
  } finally {
    setTimeout(() => {
      isDownloading.value = false
    }, 1000)
  }
}

const viewFile = (filePath: string) => {
  if (!filePath) {
    return
  }

  window.open(filePath, '_blank')
}

const editFile = (id: string) => {
  // policyStore.showEdit(id)
  policyStore.isShowUpdateFile = !policyStore.isShowUpdateFile
}

const route = useRoute()
const policyId = route.params.id as string

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })
}

// --------------------------------------
interface FormTouched {
  title: boolean
  description: boolean
  file: boolean
}

interface FormData {
  title: string
  description: string
  file: File | null
  fileName: string
}

interface FormErrors {
  title: string[]
  description: string[]
  file: string[]
}

const errors = reactive<FormErrors>({
  title: [],
  description: [],
  file: [],
})

const formData = reactive<FormData>({
  title: '',
  description: '',
  file: null,
  fileName: '',
})

const touched = reactive<FormTouched>({
  title: false,
  description: false,
  file: false,
})

const validateFile = (): boolean => {
  errors.file = []

  // file optional
  if (!formData.file) {
    return true
  }

  const maxSize = 10 * 1024 * 1024 // 10MB

  const fileNameLower = formData.file.name.toLowerCase()

  // check size
  if (formData.file.size > maxSize) {
    errors.file.push('File size must not exceed 10MB')
  }

  // check only pdf
  const isPdf = formData.file.type === 'application/pdf' || fileNameLower.endsWith('.pdf')

  if (!isPdf) {
    errors.file.push('Only PDF files are allowed')
  }

  return errors.file.length === 0
}

//
const fileName = ref<string>('')
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  // Reset file state first
  formData.file = null
  fileName.value = ''
  errors.file = []

  // Check if files exist and have items
  if (target.files && target.files.length > 0) {
    const selectedFile = target.files[0]

    if (selectedFile) {
      formData.file = selectedFile
      fileName.value = selectedFile.name
      touched.file = true
      validateFile()
    }
  } else {
    // File input cleared
    touched.file = true
    validateFile()
  }
}

// -------------
onMounted(() => {
  //
  policyStore.getPolicyById(policyId)
})

// handdle update file
const handdleUpdateFile = () => {
  // check file
  if (formData.file && route.params.id) {
    policyStore.policyUpdateFile(Number(route.params.id), formData.file)
  }
}
</script>

<template>
  <AdminLayouts>
    <div
      class="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-6"
    >
      <!-- Container -->
      <div class="w-full">
        <!-- Back Button -->
        <button
          @click="$router.back()"
          class="inline-flex items-center gap-2 px-4 py-2 mb-6 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 font-Kantumruy"
        >
          <component :is="ArrowBackIcon" class="w-4 h-4" />
          <span class="text-sm font-medium">ត្រលប់ក្រោយ</span>
        </button>

        <!-- Main Card -->
        <div
          v-if="policyStore.data_id?.data"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in"
        >
          <!-- Header with Gradient -->
          <div class="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 md:p-10">
            <div class="space-y-4">
              <!-- Status Badge -->
              <div
                class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 capitalize text-white rounded-full text-xs font-semibold"
              >
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                {{ policyStore.data_id?.data.status }}
              </div>

              <!-- Title -->
              <h1 class="text-3xl md:text-4xl font-bold text-white font-Kantumruy leading-tight">
                {{ policyStore.data_id?.data.title }}
              </h1>

              <!-- Date Info -->
              <div class="flex flex-wrap gap-6 text-blue-100 text-sm pt-2 font-Kantumruy">
                <div class="flex items-center gap-2">
                  <span><component :is="DateIcon" /></span>
                  <span>{{ formatDate(policyStore.data_id?.data.created_at) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <component :is="ReloadIcon" />
                  <span
                    >ធ្វើបច្ចុប្បន្នភាព:
                    {{ formatDate(policyStore.data_id?.data.updated_at) }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Content Section -->
          <div class="p-8 md:p-10 border-b border-slate-200 dark:border-slate-700">
            <div class="space-y-4">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white font-Kantumruy">
                ពិសេសលម្អិត
              </h2>
              <p
                class="text-base leading-8 text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-Kantumruy transition-all duration-300"
                :class="{ 'line-clamp-3': !expandedDescription }"
              >
                {{ policyStore.data_id?.data.description }}
              </p>
              <button
                v-if="policyStore.data_id?.data.description.length > 200"
                @click="expandedDescription = !expandedDescription"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium font-Kantumruy transition-colors duration-200"
              >
                {{ expandedDescription ? 'ធ្វើឱ្យខ្លី' : 'មើលលម្អិត' }}
              </button>
            </div>
          </div>

          <!-- File Section -->
          <div class="p-8 md:p-10 border-b border-slate-200 dark:border-slate-700">
            <h2
              class="text-xl flex justify-start items-center gap-2 font-bold text-slate-900 dark:text-white font-Kantumruy mb-6"
            >
              <component :is="LinkIcon" class="w-4 h-4" /> ឯកសារភ្ជាប់
            </h2>

            <div
              v-if="policyStore.data_id?.data.file_path"
              class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <!-- File Icon -->
                  <div
                    class="w-16 h-16 rounded-lg bg-gradient-to-br text-white from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-3xl"><component :is="DocumentIcon" /></span>
                  </div>

                  <!-- File Info -->

                  <div>
                    <h3
                      class="text-lg font-semibold text-slate-900 dark:text-white font-Kantumruy mb-1"
                    >
                      {{ policyStore.data_id?.data.file_path ? 'File PDF' : 'File' }}
                    </h3>
                    <div class="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span class="flex items-center gap-1">
                        <component :is="DateIcon" />
                        {{ formatDate(policyStore.data_id?.data.created_at) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <component :is="ReloadIcon" />
                        {{ formatDate(policyStore.data_id?.data.updated_at) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 flex-shrink-0">
                  <button
                    @click="viewFile(policyStore.data_id?.data.file_path)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium font-Kantumruy flex items-center gap-2"
                  >
                    <span><component :is="ViewIcon" /></span>
                    មើល
                  </button>
                  <!--  -->
                  <button
                    @click="editFile(policyStore.data_id?.data.id.toString())"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium font-Kantumruy flex items-center gap-2"
                  >
                    <span><component :is="EditIcon" /></span>
                    កែប្រែ
                  </button>
                  <button
                    @click="downloadFile(policyStore.data_id?.data.file_path)"
                    :disabled="isDownloading || !policyStore.data_id?.data.file_path"
                    class="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-60 text-slate-900 dark:text-white rounded-lg transition-all duration-200 text-sm font-medium font-Kantumruy flex items-center gap-2"
                  >
                    <span v-if="!isDownloading"><component :is="DownloadIcon" /></span>
                    <span
                      v-else
                      class="inline-block w-4 h-4 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"
                    ></span>
                    {{ isDownloading ? 'ទាញយក...' : 'ទាញយក' }}
                  </button>
                </div>
              </div>

              <!-- File Preview Info -->
              <div
                class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/30 text-xs text-slate-600 dark:text-slate-400 font-Kantumruy"
              >
                <p>💡 ចូលក្នុងលើកឧបករណ៍មើលឯកសារដើម្បីមើលលម្អិតលម្អូលពេញលេញ</p>
              </div>

              <!--Block update file -->
              <!-- ----------------------------------------------- -->
              <!-- File Upload Field -->

              <div v-if="policyStore.isShowUpdateFile" class="space-y-2 relative mt-4">
                <label
                  for="file"
                  class="font-Kantumruy font-semibold text-slate-700 flex items-center dark:text-white gap-2"
                >
                  File Document
                  <span class="text-red-500">*</span>
                </label>
                <p
                  v-if="policyStore.isLoadingUpdate.title && policyStore.isLoadingUpdate.type"
                  class="text-xs font-poppins p-2 rounded-md"
                  :class="
                    policyStore.isLoadingUpdate.title &&
                    policyStore.isLoadingUpdate.type === 'success'
                      ? 'text-green-600 bg-green-500/20'
                      : 'text-red-600 bg-red-500/20'
                  "
                >
                  {{ policyStore.isLoadingUpdate.title }}
                </p>
                <label
                  :class="[
                    'block relative border-2 border-dashed dark:bg-slate-800 dark:text-white rounded-xl p-4 text-center cursor-pointer transition-all duration-200',
                    touched.file && errors.file.length > 0
                      ? 'border-red-400 bg-red-50 hover:bg-red-100'
                      : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50',
                  ]"
                >
                  <input
                    id="file"
                    type="file"
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,application/pdf"
                    @change="handleFileChange"
                  />
                  <div class="py-2">
                    <p v-if="!fileName" class="text-sm font-medium text-slate-600">
                      <span>📁</span> Click to upload or drag file
                    </p>
                    <p v-else class="text-sm font-semibold text-blue-600">✓ {{ fileName }}</p>
                    <p class="text-xs text-slate-500 mt-1">PDF or DOCX (Max 10MB)</p>
                  </div>
                </label>
                <transition name="fade">
                  <div v-if="touched.file && errors.file.length > 0" class="space-y-1">
                    <p
                      v-for="(error, idx) in errors.file"
                      :key="idx"
                      class="text-xs text-red-600 flex items-center gap-1"
                    >
                      <span>⚠</span> {{ error }}
                    </p>
                  </div>
                </transition>
              </div>

              <!-- End Block update file -->

              <!-- Block button save -->
              <div class="w-full mt-4 top-0 bottom-0 right-2 flex justify-end items-center">
                <button
                  v-if="fileName"
                  @click="handdleUpdateFile"
                  title="SAVE File for update"
                  :disabled="policyStore.isLoadingUpdate.isLoading"
                  class="bg-green-600 text-white hover:bg-green-700 font-poppins cursor-pointer px-4 py-1.5 rounded-md flex justify-center items-center gap-1"
                >
                  <div
                    v-if="policyStore.isLoadingUpdate.isLoading"
                    class="flex justify-center items-center gap-2"
                  >
                    <span class="font-poppins">Loading...</span>
                    <div class="w-5 h-5 flex justify-center items-center">
                      <loading />
                    </div>
                  </div>
                  <span v-else>Save</span>
                </button>
              </div>

              <!-- ------------------------------------------------- -->
            </div>

            <div
              v-else
              class="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-8 border border-dashed border-slate-300 dark:border-slate-600 text-center"
            >
              <p class="text-slate-500 dark:text-slate-400 font-Kantumruy">មិនមានឯកសារភ្ជាប់ទេ</p>
            </div>
          </div>
        </div>

        <!-- loading data  -->
        <div v-if="policyStore.isLoading" class="w-full flex justify-center items-center p-4">
          <div class="w-10 h-10"><Loading /></div>
        </div>
      </div>
    </div>
  </AdminLayouts>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media print {
  button {
    display: none !important;
  }
}
</style>
