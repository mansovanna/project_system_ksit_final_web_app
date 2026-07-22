<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { CloseIcon } from '@/stores/Icons'
import { usePolicyStore } from '@/stores/policy_store'

const policyStore = usePolicyStore()

interface FormData {
  title: string
  description: string
  file: File | null
}

interface FormErrors {
  title: string[]
  description: string[]
  file: string[]
}

interface FormTouched {
  title: boolean
  description: boolean
  file: boolean
}

const formData = reactive<FormData>({
  title: '',
  description: '',
  file: null,
})

const errors = reactive<FormErrors>({
  title: [],
  description: [],
  file: [],
})

const touched = reactive<FormTouched>({
  title: false,
  description: false,
  file: false,
})

const isLoading = ref(false)
const fileName = ref<string>('')
const successMessage = ref<string>('')

// Validation rules with null checks
const validateTitle = (): boolean => {
  errors.title = []

  // Check if null or undefined
  if (formData.title === null || formData.title === undefined) {
    errors.title.push('Title is required')
    return false
  }

  const trimmedTitle = String(formData.title).trim()

  if (trimmedTitle.length === 0) {
    errors.title.push('Title is required')
  } else if (trimmedTitle.length < 3) {
    errors.title.push('Title must be at least 3 characters')
  } else if (trimmedTitle.length > 100) {
    errors.title.push('Title must not exceed 100 characters')
  }

  return errors.title.length === 0
}

const validateDescription = (): boolean => {
  errors.description = []

  // Check if null or undefined
  if (formData.description === null || formData.description === undefined) {
    errors.description.push('Description is required')
    return false
  }

  const trimmedDescription = String(formData.description).trim()

  if (trimmedDescription.length === 0) {
    errors.description.push('Description is required')
  } else if (trimmedDescription.length < 10) {
    errors.description.push('Description must be at least 10 characters')
  } else if (trimmedDescription.length > 2000) {
    errors.description.push('Description must not exceed 2000 characters')
  }

  return errors.description.length === 0
}

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
// const validateForm = (): boolean => {
//   const titleValid = validateTitle()
//   const descriptionValid = validateDescription()
//   const fileValid = validateFile()
//   return titleValid && descriptionValid && fileValid
// }

const handleTitleBlur = () => {
  touched.title = true
  validateTitle()
}

const handleDescriptionBlur = () => {
  touched.description = true
  validateDescription()
}

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

const handleSave = async () => {
  touched.title = true
  touched.description = true
  touched.file = true

  const titleValid = validateTitle()
  const descriptionValid = validateDescription()
  const fileValid = validateFile()

  if (!titleValid || !descriptionValid || !fileValid) {
    return
  }

  try {
    isLoading.value = true

    const data = new FormData()

    data.append('title', formData.title)
    data.append('description', formData.description)

    // check file before append
    if (formData.file) {
      data.append('file_path', formData.file)
    }

    console.log(formData.file)

    await policyStore.createPolicy(data)

    successMessage.value = '✓ Policy saved successfully!'

    resetForm()

    policyStore.handleShowModal()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  policyStore.handleShowModal()
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
  formData.file = null
  fileName.value = ''
  errors.title = []
  errors.description = []
  errors.file = []
  touched.title = false
  touched.description = false
  touched.file = false
  successMessage.value = ''
}

const titleCount = computed(() => (formData.title ? formData.title.length : 0))
const descriptionCount = computed(() => (formData.description ? formData.description.length : 0))
const titleCharLeft = computed(() => Math.max(0, 100 - titleCount.value))
const descriptionCharLeft = computed(() => Math.max(0, 2000 - descriptionCount.value))

// Computed property for form validity
// const isFormValid = computed(() => {
//   return validateForm()
// })
</script>

<template>
  <!-- backdrop-blur-sm -->
  <div
    class="fixed w-full h-screen top-0 left-0 bg-black/50 flex justify-center items-center z-50 p-4"
  >
    <div
      class="w-full max-w-[550px] bg-white dark:bg-slate-900 dark:border dark:border-slate-600 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-modal-enter"
    >
      <!-- Header -->
      <div class="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="font-poppins text-xl font-bold text-slate-900 dark:text-white">Policy Form</h1>
        </div>
        <button
          @click="handleCancel"
          class="p-2 hover:bg-red-400 rounded-full transition-all duration-200 text-red-500 hover:text-white duration-500"
          title="Close"
        >
          <component :is="CloseIcon" />
        </button>
      </div>

      <!-- Success Message -->
      <transition name="slide-down">
        <div
          v-if="successMessage"
          class="bg-green-50 border-b border-green-200 px-6 py-4 flex items-center gap-3"
        >
          <span class="text-xl">✓</span>
          <p class="text-sm font-medium text-green-700">{{ successMessage }}</p>
        </div>
      </transition>

      <!-- Form Content -->
      <form @submit.prevent="handleSave" class="p-6 space-y-5">
        <!-- Title Field -->
        <div class="space-y-2">
          <div class="flex justify-between items-baseline">
            <label for="title" class="font-Kantumruy font-semibold text-slate-700 dark:text-white">
              Title
              <span class="text-red-500">*</span>
            </label>
            <span
              :class="[
                'text-xs transition-colors',
                titleCharLeft < 20 ? 'text-red-500 font-semibold' : 'text-slate-400',
              ]"
            >
              {{ titleCount }}/100
            </span>
          </div>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Enter policy title..."
            maxlength="100"
            @blur="handleTitleBlur"
            :class="[
              'w-full px-4 py-3 dark:bg-slate-700 dark:text-white border rounded-xl font-Kantumruy transition-all duration-200 focus:outline-none',
              touched.title && errors.title.length > 0
                ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-400',
            ]"
          />
          <transition name="fade">
            <div v-if="touched.title && errors.title.length > 0" class="space-y-1">
              <p
                v-for="(error, idx) in errors.title"
                :key="idx"
                class="text-xs text-red-600 flex items-center gap-1"
              >
                <span>⚠</span> {{ error }}
              </p>
            </div>
          </transition>
        </div>

        <!-- Description Field -->
        <div class="space-y-2">
          <div class="flex justify-between items-baseline">
            <label
              for="description"
              class="font-Kantumruy font-semibold text-slate-700 dark:text-white"
            >
              Description
              <span class="text-red-500">*</span>
            </label>
            <span
              :class="[
                'text-xs transition-colors ',
                descriptionCharLeft < 200 ? 'text-orange-500 font-semibold' : 'text-slate-400',
              ]"
            >
              {{ descriptionCount }}/2000
            </span>
          </div>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Enter policy description in detail..."
            maxlength="2000"
            rows="5"
            @blur="handleDescriptionBlur"
            :class="[
              'w-full px-4 py-3 border dark:bg-slate-800 dark:text-white rounded-xl font-Kantumruy transition-all duration-200 focus:outline-none resize-none',
              touched.description && errors.description.length > 0
                ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-slate-400',
            ]"
          ></textarea>
          <transition name="fade">
            <div v-if="touched.description && errors.description.length > 0" class="space-y-1">
              <p
                v-for="(error, idx) in errors.description"
                :key="idx"
                class="text-xs text-red-600 flex items-center gap-1"
              >
                <span>⚠</span> {{ error }}
              </p>
            </div>
          </transition>
        </div>

        <!-- File Upload Field -->
        <div class="space-y-2">
          <label
            for="file"
            class="font-Kantumruy font-semibold text-slate-700 flex items-center dark:text-white gap-2"
          >
            File Document
            <span class="text-red-500">*</span>
          </label>
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
      </form>

      <!-- Footer Buttons -->
      <div
        class="bg-slate-50 dark:bg-slate-700 border-t border-slate-200 px-6 py-4 flex justify-end items-center gap-3"
      >
        <button
          @click="handleCancel"
          type="button"
          class="px-5 py-2.5 border border-red-500 text-rd-500 font-Kantumruy font-medium rounded-lg hover:bg-red-400 text-red-500 hover:text-white transition-all duration-200 active:scale-95"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          :disabled="policyStore.isLoading"
          type="button"
          class="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-Kantumruy font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95"
        >
          <span
            v-if="policyStore.isLoading"
            class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          ></span>
          <span>{{ isLoading ? 'Saving...' : 'Save' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
