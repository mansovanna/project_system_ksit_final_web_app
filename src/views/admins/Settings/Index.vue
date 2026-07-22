<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useAvatar } from '@/composables/useAvatar'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import {
  ArrowSmallUpIcon,
  CameraIcon,
  ComputerIcon,
  DeleteIcon,
  LogoutIcon,
  PolicyIcon,
} from '@/stores/Icons'
import { useAuthStore } from '@/stores/auth'
import Loading from '@/widgets/Loading.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import BoxChangePassword from '@/views/admins/Settings/BoxChangePassword.vue'

const avatar = useAvatar()

const authStore = useAuthStore()

const formData = reactive({
  first_name: authStore.current_use?.first_name,
  last_name: authStore.current_use?.last_name,
  user_name: authStore.current_use?.user_name,
  email: authStore.current_use?.email,
  phone_number: authStore.current_use?.phone_number,
  bio: authStore.current_use?.bio,
  password: '',
  password_confirme: '',
  password_old: '',
  profile_photo_path: null as File | null,
})

// check data update

const isUpdate = computed(() => {
  return (
    formData.first_name !== authStore.current_use?.first_name ||
    formData.last_name !== authStore.current_use?.last_name ||
    formData.user_name !== authStore.current_use?.user_name ||
    formData.email !== authStore.current_use?.email ||
    formData.phone_number !== authStore.current_use?.phone_number ||
    formData.bio !== authStore.current_use?.bio
  )
})

// validate form
const validateForm = () => {
  if (!formData.first_name) {
    return (authStore.errors.first_name = 'First name is required')
  }
  if (!formData.last_name) {
    return (authStore.errors.last_name = 'Last name is required')
  }
  if (!formData.user_name) {
    return (authStore.errors.user_name = 'User name is required')
  }
  if (!formData.email) {
    return (authStore.errors.email = 'Email is required')
  }
  if (!formData.phone_number) {
    return (authStore.errors.phone_number = 'Phone number is required')
  }
  if (!formData.bio) {
    return (authStore.errors.bio = 'Bio is required')
  }
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
// handle submit update info
const submitUpdateInfo = () => {
  //
  validateForm()
  if (!validateEmail(formData.email ?? '')) {
    return (authStore.errors.email = 'Please enter a valid email')
  }

  // sumbit data to api
  const data = new FormData()
  data.append('first_name', formData.first_name ?? '')
  data.append('last_name', formData.last_name ?? '')
  data.append('user_name', formData.user_name ?? '')
  data.append('email', formData.email ?? '')
  data.append('phone_number', formData.phone_number ?? '')
  data.append('bio', formData.bio ?? '')

  authStore.changeInfo(data)
}

// check profile image
const uploadProgress = ref(0)
const isUploading = ref(false)
const avatarPreview = ref<string | null>(null)
const check_select_file = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  if (!file) return

  // Show preview instantly
  if (file) {
    avatarPreview.value = URL.createObjectURL(file)
    formData.profile_photo_path = file
  }

  // Start upload
  isUploading.value = true
  uploadProgress.value = 0

  const MAX_FILE_SIZE = 5 * 1024 * 1024

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2)

    authStore.errorMessage = `The selected image is ${sizeMB} MB. Maximum allowed size is 5 MB.`

    return
  }

  authStore.update_profile_image(file, (percent) => {
    uploadProgress.value = percent
    if (percent === 100) {
      // optional: hide overlay a bit later
      setTimeout(() => (isUploading.value = false), 500)
    }
  })
}

// OnMounted data

onMounted(() => {
  formData.first_name = authStore.current_use?.first_name
  formData.last_name = authStore.current_use?.last_name
  formData.user_name = authStore.current_use?.user_name
  formData.email = authStore.current_use?.email
  formData.phone_number = authStore.current_use?.phone_number
  formData.bio = authStore.current_use?.bio

  // clear error
  authStore.errors.first_name = ''
  authStore.errors.last_name = ''
  authStore.errors.user_name = ''
  authStore.errors.email = ''
  authStore.errors.phone_number = ''
  authStore.errors.bio = ''
  authStore.errors.password = ''
  authStore.errors.password_confirme = ''
  authStore.errors.password_old = ''
  authStore.errorMessage = ''
  authStore.successMessage = ''
})
</script>

<template>
  <AdminLayouts title="Settings">
    <div class="max-w-full mx-auto p-6 py-4 space-y-4">
      <!-- ================= PROFILE IMAGE (TOP) ================= -->
      <div>
        <h1 class="font-Kantumruy text-lg font-medium">Profile & Setting</h1>
        <p class="font-Kantumruy text-sm">គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពគណនី</p>
      </div>

      <!-- Block Info.... -->
      <div class="w-full flex items-start gap-4 max-lg:flex-col">
        <!-- Block Profile Info -->
        <div
          class="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 overflow-clip"
        >
          <!-- Block Profile Image -->
          <div class="bg-linear-to-r from-green-600 to-green-400">
            <div class="w-full stripe-bg relative group">
              <div class="w-full h-35 stripe-bg-2 relative">
                <div
                  class="flex items-center justify-center absolute -bottom-1/3 left-4 rounded-full"
                >
                  <div class="relative">
                    <img
                      :src="
                        avatarPreview ||
                        authStore.current_use?.profile_photo_url ||
                        avatar.textToImage(authStore.current_use?.user_name || 'Admin')
                      "
                      class="w-40 h-40 rounded-full border-4 border-white ring-4 ring-slate-300 dark:ring-slate-500 object-cover object-center"
                      :alt="authStore.current_use?.user_name ?? 'Admin'"
                    />

                    <div
                      class="absolute font-Kantumruy inset-0 bg-black/40 bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity rounded-full"
                    >
                      Change
                    </div>

                    <div
                      v-if="isUploading"
                      class="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white"
                    >
                      <span class="text-sm font-bold">{{ uploadProgress }}%</span>
                    </div>

                    <!-- Block Button -->
                    <label
                      class="absolute bottom-1 right-1 w-10 h-10 text-white rounded-full bg-green-600 hover:bg-green-700 duration-300 p-2 flex justify-center items-center border border-slate-200 cursor-pointer"
                    >
                      <div title="Change Profile">
                        <component :is="CameraIcon" />
                      </div>
                      <input
                        type="file"
                        accept=".png,.jpg"
                        class="hidden"
                        @change="check_select_file"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Block Profile Image -->

          <!-- Block info -->
          <div class="w-full p-6 mt-10 space-y-2">
            <!-- Error Message -->
            <div v-if="authStore.errorMessage" class="font-Kantumruy">
              <div class="text-red-500 text-sm">{{ authStore.errorMessage }}</div>
            </div>
            <!-- Success Message -->
            <div v-if="authStore.successMessage" class="font-Kantumruy">
              <div class="text-green-500 text-sm">{{ authStore.successMessage }}</div>
            </div>

            <!-- End Error Message -->
            <!-- Block name -->
            <div class="flex flex-col justify-start items-start gap-2">
              <h1 class="font-Kantumruy text-xl capitalize font-medium">
                {{ authStore.current_use?.first_name ?? 'Null' }}
                {{ authStore.current_use?.last_name ?? 'Null' }}
              </h1>

              <!-- role -->
              <div
                class="px-4 flex justify-center items-center gap-1 py-1 bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-400 rounded-full capitalize font-Kantumruy text-xs"
              >
                <span>{{ authStore.current_use?.role ?? 'Null' }}</span>
                <component :is="PolicyIcon" class="w-5 h-5" />
              </div>
            </div>
            <!-- End Block name -->
            <h1 class="font-Kantumruy mt-4">ព័ត៌មានផ្ទាល់ខ្លួន</h1>
            <!-- Info... -->
            <div class="w-full space-y-2">
              <!-- Block selection 1 -->
              <div class="w-full flex items-start gap-4 max-lg:flex-col">
                <!-- field 1 -->
                <div class="w-full">
                  <label class="font-Kantumruy text-sm">នាមខ្លួន</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      v-model="formData.last_name"
                      class="w-full font-Kantumruy bg-slate-50 dark:bg-slate-700 p-2 border dark:border-slate-500 rounded-lg outline-0"
                      :class="{
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-slate-300':
                          !authStore.errors.last_name,
                        'focus:border-red-500 focus:ring-2 focus:ring-red-200 border-red-300 text-red-500':
                          authStore.errors.last_name,
                      }"
                      placeholder="នាមខ្លួន..."
                    />
                    <p
                      v-if="authStore.errors.last_name"
                      class="mt-0.5 font-Kantumruy text-xs text-red-500 dark:text-red-400"
                    >
                      {{ authStore.errors.last_name }}
                    </p>
                  </div>
                </div>
                <!-- End field 1 -->

                <!-- field 2 -->
                <div class="w-full">
                  <label class="font-Kantumruy text-sm">នាមត្រកូល</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      v-model="formData.first_name"
                      class="w-full font-Kantumruy bg-slate-50 dark:bg-slate-700 p-2 border dark:border-slate-500 rounded-lg outline-0"
                      :class="{
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-slate-300':
                          !authStore.errors.first_name,
                        'focus:border-red-500 focus:ring-2 focus:ring-red-200 border-red-300 text-red-500':
                          authStore.errors.first_name,
                      }"
                      placeholder="នាមត្រកូល..."
                    />
                    <p
                      v-if="authStore.errors.first_name"
                      class="mt-0.5 font-Kantumruy text-xs text-red-500 dark:text-red-400"
                    >
                      {{ authStore.errors.first_name }}
                    </p>
                  </div>
                </div>
                <!-- End field 2 -->
              </div>
              <!-- End Block section 1 -->

              <!-- Block section 2 -->
              <div class="w-full flex items-start gap-4 max-lg:flex-col">
                <!-- field 1 -->
                <div class="w-full">
                  <label class="font-Kantumruy text-sm">ឈ្មោះជាភាសាអង់គ្លេស</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      v-model="formData.user_name"
                      class="w-full font-Kantumruy bg-slate-50 dark:bg-slate-700 p-2 border dark:border-slate-500 rounded-lg outline-0"
                      :class="{
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-slate-300':
                          !authStore.errors.user_name,
                        'focus:border-red-500 focus:ring-2 focus:ring-red-200 border-red-300 text-red-500':
                          authStore.errors.user_name,
                      }"
                      placeholder="ឈ្មោះជាភាសាអង់គ្លេស..."
                    />
                    <p
                      v-if="authStore.errors.user_name"
                      class="mt-0.5 font-Kantumruy text-xs text-red-500 dark:text-red-400"
                    >
                      {{ authStore.errors.user_name }}
                    </p>
                  </div>
                </div>
                <!-- End field 1 -->

                <!-- field 2 -->
                <div class="w-full">
                  <label class="font-Kantumruy text-sm">អ៊ីម៊ែល</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      v-model="formData.email"
                      class="w-full font-Kantumruy bg-slate-50 dark:bg-slate-700 p-2 border dark:border-slate-500 rounded-lg outline-0"
                      :class="{
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-slate-300':
                          !authStore.errors.email,
                        'focus:border-red-500 focus:ring-2 focus:ring-red-200 border-red-300 text-red-500':
                          authStore.errors.email,
                      }"
                      placeholder="អ៊ីម៊ែល..."
                    />
                    <p
                      v-if="authStore.errors.email"
                      class="mt-0.5 font-Kantumruy text-xs text-red-500 dark:text-red-400"
                    >
                      {{ authStore.errors.email }}
                    </p>
                  </div>
                </div>
                <!-- End field 2 -->
              </div>
              <!-- End Block section 2 -->

              <!-- Block section 3 -->
              <div class="w-full flex items-start gap-4 max-lg:flex-col">
                <div class="w-full">
                  <label class="font-Kantumruy text-sm">លេខទូរស័ព្ទ</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      v-model="formData.phone_number"
                      class="w-full font-Kantumruy bg-slate-50 dark:bg-slate-700 p-2 border dark:border-slate-500 rounded-lg outline-0"
                      :class="{
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-slate-300':
                          !authStore.errors.phone_number,
                        'focus:border-red-500 focus:ring-2 focus:ring-red-200 border-red-300 text-red-500':
                          authStore.errors.phone_number,
                      }"
                      placeholder="លេខទូរស័ព្ទ..."
                    />
                    <p
                      v-if="authStore.errors.phone_number"
                      class="mt-0.5 font-Kantumruy text-xs text-red-500 dark:text-red-400"
                    >
                      {{ authStore.errors.phone_number }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- End Block section 3 -->
              <!-- Block section 4 -->
              <div class="w-full flex items-start gap-4 max-lg:flex-col">
                <!-- field 1 -->
                <div class="w-full">
                  <label class="font-Kantumruy text-sm">តួនាទី​ / ការពណ៍នាអំពីខ្លួនឯង</label>
                  <div class="mt-1">
                    <textarea
                      rows="4"
                      v-model="formData.bio"
                      class="w-full font-Kantumruy p-2 border bg-slate-50 dark:bg-slate-700 dark:border-slate-500 rounded-lg outline-0"
                      :class="{
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-slate-300':
                          !authStore.errors.bio,
                        'focus:border-red-500 focus:ring-2 focus:ring-red-200 border-red-300 text-red-500':
                          authStore.errors.bio,
                      }"
                      placeholder="តួនាទី / ការពណ៍នាអំពីខ្លួនឯង..."
                    ></textarea>
                    <p
                      v-if="authStore.errors.bio"
                      class="mt-0.5 font-Kantumruy text-xs text-red-500 dark:text-red-400"
                    >
                      {{ authStore.errors.bio }}
                    </p>
                  </div>
                </div>
                <!-- End field 1 -->
              </div>
              <!-- End Block section 3 -->

              <!-- Block Button -->
              <div class="w-full flex justify-end items-center gap-4">
                <button
                  @click="submitUpdateInfo()"
                  :disabled="!isUpdate || authStore.isLoadings"
                  class="px-4 py-2 disabled:bg-slate-400 disabled:cursor-not-allowed bg-blue-600 text-white font-Kantumruy rounded-lg hover:bg-blue-500 transition-all duration-300 cursor-pointer"
                >
                  <span v-if="!authStore.isLoadings"> រក្សាទុកព័ត៌មាន</span>
                  <div v-if="authStore.isLoadings" class="flex justify-center items-center gap-2">
                    <div class="w-5 h-5">
                      <component :is="Loading" />
                    </div>
                    <p>Loading...</p>
                  </div>
                </button>
              </div>
            </div>
            <!-- End Info... -->
          </div>
          <!-- End Block info -->
        </div>
        <!-- End Block Profile Info -->

        <!-- Block Security -->
        <div class="min-w-1/3 max-lg:w-full">
          <!-- Block change password -->
          <BoxChangePassword />
          <!-- End Block change password -->

          <!-- block card more -->

          <div
            class="bg-white space-y-1 p-4 dark:bg-slate-700 mt-4 border border-slate-300 dark:border-slate-500 rounded-xl"
          >
            <!-- Block button logout -->
            <button
              @click="authStore.logout"
              :disabled="authStore.isLoadings"
              class="w-full flex justify-between disabled:bg-slate-400 disabled:cursor-not-allowed items-center bg-green-500/10 hover:scale-105 active:scale-95 duration-300 rounded-md cursor-pointer"
            >
              <!-- Block Icon and title -->
              <div class="flex justify-center items-center gap-2">
                <div class="p-2 rounded-md bg-green-600 text-white">
                  <component :is="LogoutIcon" />
                </div>
                <!-- Block title -->
                <div>
                  <p class="font-Kantumruy font-medium">ចាកចេញ</p>
                </div>
                <!-- End Block title -->
              </div>

              <!-- Block Icon -->
              <div v-if="!authStore.isLoadings" class="p-1">
                <component class="rotate-90" :is="ArrowSmallUpIcon" />
              </div>
              <div v-else class="w-5 h-5">
                <component :is="Loading" />
              </div>
            </button>
            <!-- End Block button logout -->
            <hr class="w-full text-slate-200 dark:text-slate-500" />
            <!-- Block delete account -->
            <button
              :disabled="true"
              class="w-full flex justify-between disabled:bg-red-400/10 disabled:cursor-not-allowed items-center bg-red-500/10 hover:scale-105 active:scale-95 duration-300 rounded-md cursor-pointer"
            >
              <!-- Block Icon and title -->
              <div class="flex justify-center items-center gap-2">
                <div class="p-2 rounded-md bg-red-600 text-white">
                  <component :is="DeleteIcon" />
                </div>
                <!-- Block title -->
                <div>
                  <p class="font-Kantumruy font-medium">លុបគណនី</p>
                </div>
                <!-- End Block title -->
              </div>

              <!-- Block Icon -->
              <div class="p-1">
                <component class="rotate-90" :is="ArrowSmallUpIcon" />
              </div>
            </button>
            <!-- End Block button delete account -->
            <hr class="w-full text-slate-200 dark:text-slate-500" />
            <!-- about app -->
            <div class="w-full flex justify-start items-center gap-2">
              <!-- Block title -->
              <div class="p-2">
                <component :is="ComputerIcon" class="w-5 h-5" />
              </div>
              <div>
                <p class="font-Kantumruy">អំពីកម្មវិធី</p>
                <h1 class="font-Kantumruy ​font-medium">v.1.0.0</h1>
              </div>
              <!-- End Block title -->
            </div>
          </div>
          <!-- End block card more -->
        </div>
        <!-- End Block Security -->
      </div>
    </div>
  </AdminLayouts>
</template>
