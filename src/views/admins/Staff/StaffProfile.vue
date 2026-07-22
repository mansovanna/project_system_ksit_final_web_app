<!-- eslint-disable vue/valid-v-model -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import FormCreate from './FormCreate.vue'

import { useStaffStore } from '@/stores/staffStore'
import { ArrowSmallUpIcon, ArrowBackIcon, CloseIcon, CameraIcon, LockIcon } from '@/stores/Icons'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAvatar } from '@/composables/useAvatar'

import LoadingShap from '@/widgets/LoadingShap.vue'

const avatar = useAvatar()
const staffStore = useStaffStore()

const route = useRoute()
const router = useRouter()

const resetPassword = () => {
  staffStore.isShowResetPassword = !staffStore.isShowResetPassword
}

const formData = ref({
  first_name: '',
  last_name: '',
  user_name: '',
  email: '',
  bio: '',
  role: '',
  phone_number: '',
  status: '',
})
onMounted(() => {
  if (route.params.id) {
    staffStore.get_staff_by_id(Number(route.params.id))
  } else {
    router.back()
  }
})
//------------------------------------------------------------------------------
watch(
  () => staffStore.staff_info,
  (s) => {
    if (!s) return
    formData.value = {
      first_name: s.first_name || '',
      last_name: s.last_name || '',
      user_name: s.user_name || '',
      email: s.email || '',
      bio: s.bio || '',
      role: s.role || '',
      phone_number: s.phone_number || '',
      status: s.status || '',
    }
  },
  { immediate: true },
)
//--------------------------------------------------------------------------------

const submitResetPassword = () => {
  staffStore.isMessageError.password = ''

  if (!staffStore.formData.password) {
    staffStore.isMessageError.password = 'Password is required'
    return
  }

  if (staffStore.formData.password.length < 6) {
    staffStore.isMessageError.password = 'Password must be at least 6 characters'
    return
  }

  // Call API to reset password
  staffStore.reset_password(Number(route.params.id), staffStore.formData.password)
}

const submitUpdateProfile = () => {
  // Call API to update profile
  staffStore.update_staff(Number(route.params.id), formData.value)
}

const preview = ref<string | null>(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

const check_select_file = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  if (!file) return

  // Show preview instantly
  if (file) {
    preview.value = URL.createObjectURL(file)
  }

  // Start upload
  isUploading.value = true
  uploadProgress.value = 0

  if (file.size > 2 * 1024 * 1024) {
    alert('Image must be less than 2MB')
    return
  }

  staffStore.update_profile_image(Number(route.params.id), file, (percent) => {
    uploadProgress.value = percent
    if (percent === 100) {
      // optional: hide overlay a bit later
      setTimeout(() => (isUploading.value = false), 500)
    }
  })
}
</script>
<template>
  <!-- Block Reset password for staff by admin -->
  <div
    class="fixed w-full h-screen flex justify-center items-center bg-black/30 z-50"
    @click="resetPassword"
    v-if="staffStore.isShowResetPassword"
  >
    <div
      class="w-full max-w-1/3 bg-white dark:bg-slate-600 p-6 rounded-md shadow-2xl relative"
      @click.stop
    >
      <div class="absolute right-2 top-2">
        <button
          class="p-1 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer"
          @click="resetPassword"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <p class="font-Kantumruy text-red-500 dark:text-red-400">Reset Password</p>
      <form @submit.prevent="submitResetPassword">
        <div class="mt-2 flex relative">
          <input
            type="text"
            v-model="staffStore.formData.password"
            class="w-full p-2 bg-slate-100 dark:bg-gray-700 rounded focus:outline-0 focus:ring-blue-400 focus:ring-2 font-Kantumruy"
            placeholder="Create New Password"
          />
          <button
            class="font-Kantumruy px-4 bg-blue-600 text-white rounded-r absolute top-0 bottom-0 right-0 hover:bg-blue-500 cursor-pointer focus:ring-2 focus:ring-blue-400"
          >
            <span v-if="staffStore.isLoadingCreate" class="w-10">Loadin...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </form>
      <span class="text-xs text-red-500">{{ staffStore.isMessageError.password }}</span>
    </div>
  </div>
  <!-- End Block Reset password for staff by admin -->

  <FormCreate v-if="staffStore.isShowCreate" />
  <AdminLayouts>
    <div class="p-4">
      <!-- Add your admin home content here -->
      <div class="w-full p-4 border border-slate-300 bg-white dark:bg-slate-800 rounded-xl">
        <div class="w-full flex justify-between items-center">
          <div>
            <div class="flex justify-start items-center">
              <h1 class="font-Kantumruy text-slate-500">Dashboard</h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-slate-500">Staffs</h1>
              <component class="rotate-90 text-slate-500" :is="ArrowSmallUpIcon"></component>
              <h1 class="font-Kantumruy text-blue-500">Profile</h1>
            </div>
            <!-- <p class="font-Kantumruy text-slate-500 text-base">Overices</p> -->
          </div>
          <button
            class="px-4 py-2 pl-2 bg-red-600 text-white rounded-md hover:bg-red-500 font-Kantumruy cursor-pointer flex justify-center items-center"
            @click="$router.back()"
          >
            <component :is="ArrowBackIcon"></component>
            <span class="font-Kantumruy font-medium">Back</span>
          </button>
        </div>
        <hr class="text-slate-300 my-2" />

        <!-- ---------------------------------------------------- -->
        <LoadingShap v-if="staffStore.isLoading" />
        <!-- ---------------------------------------------------- -->

        <div v-else class="w-full flex justify-between gap-2 mt-4">
          <!--  -->
          <div class="w-1/2 flex flex-col justify-start items-start">
            <div class="relative">
              <div class="relative w-40 h-40">
                <!-- Avatar image -->
                <img
                  :src="
                    preview
                      ? preview
                      : staffStore.staff_info?.profile_photo_path
                        ? staffStore.staff_info.profile_photo_url
                        : avatar.textToImage(staffStore.staff_info?.user_name ?? 'User')
                  "
                  alt="profile"
                  class="w-40 h-40 rounded-full object-cover border-2 border-white ring-2 ring-blue-600"
                />

                <!-- Upload overlay -->
                <div
                  v-if="isUploading"
                  class="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white"
                >
                  <span class="text-sm font-bold">{{ uploadProgress }}%</span>
                </div>
              </div>

              <!-- Optional progress bar -->
              <div v-if="isUploading" class="w-40 mt-2">
                <div class="h-2 bg-slate-200 rounded overflow-hidden">
                  <div
                    class="h-full bg-blue-600 transition-all duration-200"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
              </div>

              <!-- File input -->
              <label
                for="file-input"
                class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-9 h-9 flex justify-center items-center cursor-pointer border-2 border-white hover:bg-blue-500"
              >
                <input
                  type="file"
                  id="file-input"
                  class="hidden"
                  accept="image/*"
                  @change="check_select_file"
                />
                <component :is="CameraIcon" />
              </label>
            </div>
            <div class="mt-4">
              <p class="font-Kantumruy font-medium">{{ staffStore.staff_info?.user_name }}</p>
              <p class="font-Kantumruy text-slate-400 text-xs">
                {{ staffStore.staff_info?.email }}
              </p>
              <!-- Block status -->
              <div class="mt-6 flex flex-col justify-start items-start gap-2">
                <button
                  @click="resetPassword"
                  class="flex justify-start items-center gap-1.5 cursor-pointer text-red-600 text-base hover:underline"
                >
                  <component :is="LockIcon" />
                  <span class="font-Kantumruy">Reset Password</span>
                </button>
              </div>
            </div>
          </div>
          <!-- ------- -->

          <div class="w-full border border-slate-300 rounded-md px-4 py-2">
            <p class="font-Kantumruy font-medium">Personal Staff</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">First Name</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    v-model="formData.first_name"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">Last Name</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    v-model="formData.last_name"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">User Name</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    v-model="formData.user_name"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">Phone</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    v-model="formData.phone_number"
                  />
                </div>
              </div>
            </div>

            <div class="mt-2">
              <span class="text-xs font-Kantumruy text-slate-400">Email Address</span>
              <div class="mt-0.5">
                <input
                  type="text"
                  class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                  v-model="formData.email"
                />
              </div>
            </div>

            <div class="flex gap-4 w-full">
              <div class="mt-2 w-full">
                <span class="text-xs font-Kantumruy text-slate-400">Role</span>
                <div class="mt-0.5">
                  <select
                    name="role"
                    id=""
                    class="w-full bg-slate-100 dark:bg-gray-600 dark:text-white p-2 rounded font-Kantumruy capitalize font-medium text-slate-500"
                    v-model="formData.role"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="user">Student</option>
                  </select>
                </div>
              </div>
              <!--  -->
              <div class="mt-2 w-full">
                <span class="text-xs font-Kantumruy text-slate-400">Status</span>
                <div class="mt-0.5 w-full">
                  <select
                    name="role"
                    id=""
                    class="w-full bg-slate-100 p-2 dark:bg-gray-600 dark:text-white rounded font-Kantumruy capitalize font-medium text-slate-500"
                    v-model="formData.status"
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="complete">complete</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <span class="text-xs font-Kantumruy text-slate-400">Bio</span>
              <div class="mt-0.5">
                <textarea
                  id=""
                  class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                  v-model="formData.bio"
                ></textarea>
              </div>
            </div>

            <div class="w-full flex justify-end itens-center py-2 mt-6">
              <button
                @click="submitUpdateProfile"
                class="px-6 py-2 text-white rounded-md font-Kantumruy bg-blue-700 hover:bg-blue-600 cursor-pointer"
              >
                <span v-if="staffStore.isLoadingUpdate" class="font-Kantumruy">Loading...!</span>
                <span v-else class="font-Kantumruy">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--  -->
    </div>
  </AdminLayouts>
</template>
