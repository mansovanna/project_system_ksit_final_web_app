<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import TableLeave from './TableLeave.vue'
import TableStays from './TableStays.vue'
import TablePayments from './TablePayments.vue'
import Loading from '@/widgets/Loading.vue'
import { useStaffStore } from '@/stores/staffStore'
import { ArrowSmallUpIcon, ArrowBackIcon, CloseIcon, UploadIcon, PrintIcon } from '@/stores/Icons'
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/user_store'
import { useAvatar } from '@/composables/useAvatar'
import UserFillIcon from '@/assets/icons/UserFillIcon.vue'
import { useAuthStore } from '@/stores/auth'

const password = ref('password@123')

const authStore = useAuthStore()

const staffStore = useStaffStore()
const avatar = useAvatar()

const userStore = useUsersStore()

const resetPassword = () => {
  if (password.value.trim() === '') {
    userStore.isMessageAny = {
      type: 'error',
      message: 'Password cannot be empty.',
    }

    return
  }

  if (password.value.length < 8) {
    userStore.isMessageAny = {
      type: 'error',
      message: 'Password must be at least 8 characters long.',
    }
    return
  }

  if (route.params.id) {
    userStore.changePasswordStudent(Number(route.params.id), password.value)
  } else {
    console.log('User ID is not found!')
  }
}

const route = useRoute()

// ─── Form State ────────────────────────────────────────────────────────────────
const formData = reactive({
  user_name: userStore.user_info?.user_name ?? '',
  first_name: userStore.user_info?.first_name ?? '',
  last_name: userStore.user_info?.last_name ?? '',
  email: userStore.user_info?.email ?? '',
  phone_number: userStore.user_info?.phone_number ?? '',
  role: userStore.user_info?.role ?? '',
  status: userStore.user_info?.status ?? '',
  bio: userStore.user_info?.bio ?? '',
  gender: userStore.user_info?.gender ?? '',
  info: {
    id: userStore.user_info?.info?.id ?? 0,
    id_card: userStore.user_info?.info?.id_card ?? '',
    phone_parent: userStore.user_info?.info?.phone_parent ?? '',
    date_of_birth: userStore.user_info?.info?.date_of_birth ?? '',
    major: userStore.user_info?.info?.major ?? '',
    level: userStore.user_info?.info?.level ?? '',
    year: userStore.user_info?.info?.year ?? '',
    address: userStore.user_info?.info?.address ?? '',
  },
})

watch(
  () => userStore.user_info,
  (newValue) => {
    if (newValue) {
      // assign data to form data
      formData.user_name = newValue.user_name ?? ''
      formData.first_name = newValue.first_name ?? ''
      formData.last_name = newValue.last_name ?? ''
      formData.email = newValue.email ?? ''
      formData.phone_number = newValue.phone_number ?? ''
      formData.role = newValue.role ?? ''
      formData.status = newValue.status ?? ''
      formData.bio = newValue.bio ?? ''
      formData.info.id = newValue.info?.id ?? 0
      formData.info.id_card = newValue.info?.id_card ?? ''
      formData.info.phone_parent = newValue.info?.phone_parent ?? ''
      formData.info.date_of_birth = newValue.info?.date_of_birth ?? ''
      formData.gender = newValue?.gender ?? ''
      formData.info.major = newValue.info?.major ?? ''
      formData.info.level = newValue.info?.level ?? ''
      formData.info.year = newValue.info?.year ?? ''
      formData.info.address = newValue.info?.address ?? ''
    }
  },
)

const isUpdate = computed(() => {
  return (
    formData.first_name !== userStore.user_info?.first_name ||
    formData.last_name !== userStore.user_info?.last_name ||
    formData.user_name !== userStore.user_info?.user_name ||
    formData.email !== userStore.user_info?.email ||
    formData.phone_number !== userStore.user_info?.phone_number ||
    formData.bio !== userStore.user_info?.bio ||
    formData.gender !== userStore.user_info?.gender ||
    formData.role !== userStore.user_info?.role ||
    formData.status !== userStore.user_info?.status ||
    formData.info.id_card !== userStore.user_info?.info?.id_card ||
    formData.info.phone_parent !== userStore.user_info?.info?.phone_parent ||
    formData.info.date_of_birth !== userStore.user_info?.info?.date_of_birth ||
    formData.info.major !== userStore.user_info?.info?.major ||
    formData.info.level !== userStore.user_info?.info?.level ||
    formData.info.year !== userStore.user_info?.info?.year ||
    formData.info.address !== userStore.user_info?.info?.address
  )
})
// Toggle handle mode show form
const isShowMore = ref(false)
const toggleShowMore = () => {
  isShowMore.value = !isShowMore.value
}

// ─── Profile photo URL ─────────────────────────────────────────────────────────
const photoUrl = computed(() =>
  userStore.user_info?.profile_photo_url?.length
    ? userStore.user_info?.profile_photo_url
    : avatar.textToImage(userStore.user_info?.user_name ?? 'Admin'),
)

// check data

// Validate

const formReset = () => {
  userStore.isErrors = {
    phone_number: '',
    gender: '',
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    role: '',
    status: '',
    bio: '',
    profile_photo_path: '',
    info: {
      id: 0,
      id_card: '',
      phone_parent: '',
      date_of_birth: '',
      major: '',
      level: '',
      year: '',
      address: '',
    },
    password: '',
    password_confirmation: '',
  }
}

const validateForm = () => {
  if (!formData.user_name) {
    //
    userStore.isErrors.user_name = 'Username is required!'
    return false
  }

  if (!formData.first_name) {
    //
    userStore.isErrors.first_name = 'First name is required!'
    return false
  }

  if (!formData.last_name) {
    //
    userStore.isErrors.last_name = 'Last name is required!'
    return false
  }

  if (!formData.email) {
    //
    userStore.isErrors.email = 'Email is required!'
    return false
  }

  if (!formData.phone_number) {
    //
    userStore.isErrors.phone_number = 'Phone number is required!'
    return false
  }

  if (!formData.role) {
    //
    userStore.isErrors.role = 'Role is required!'
    return false
  }

  if (!formData.status) {
    //
    userStore.isErrors.status = 'Status is required!'
    return false
  }

  if (!formData.bio) {
    //
    userStore.isErrors.bio = 'Bio is required!'
    return false
  }

  if (!formData.info.id_card) {
    //
    userStore.isErrors.info.id_card = 'ID card is required!'
    return false
  }

  if (!formData.info.phone_parent) {
    //
    userStore.isErrors.info.phone_parent = 'Phone parent is required!'
    return false
  }

  if (!formData.info.date_of_birth) {
    //
    userStore.isErrors.info.date_of_birth = 'Date of birth is required!'
    return false
  }

  if (!formData.gender) {
    //
    userStore.isErrors.gender = 'Gender is required!'
    return false
  }

  if (!formData.info.major) {
    //
    userStore.isErrors.info.major = 'Major is required!'
    return false
  }

  if (!formData.info.level) {
    //
    userStore.isErrors.info.level = 'Level is required!'
    return false
  }

  if (!formData.info.year) {
    //
    userStore.isErrors.info.year = 'Year is required!'
    return false
  }

  if (!formData.info.address) {
    //
    userStore.isErrors.info.address = 'Address is required!'
    return false
  }
}
// submit form data
const handleUpdateProfile = () => {
  formReset()
  // handfle
  if (validateForm()) {
    return
  }

  const data = new FormData()

  data.append('user_name', formData.user_name)
  data.append('first_name', formData.first_name)
  data.append('last_name', formData.last_name)
  data.append('email', formData.email)
  data.append('phone_number', formData.phone_number)
  data.append('role', formData.role)
  data.append('status', formData.status)
  data.append('bio', formData.bio)
  data.append('gender', formData.gender)
  data.append('id_card', formData.info.id_card)
  data.append('phone_parent', formData.info.phone_parent)
  data.append('date_of_birth', formData.info.date_of_birth)
  data.append('major', formData.info.major)
  data.append('level', formData.info.level)
  data.append('year', formData.info.year)
  data.append('address', formData.info.address)

  //
  userStore.updateInfoUsers(String(route.params.id), data)
}

const handleFileUpload = (e: Event) => {
  const input = e.target as HTMLInputElement

  if (!input.files?.length) return

  const file = input.files[0]

  if (!file) return

  if (file?.size > 5 * 1024 * 1024) {
    userStore.isMessageAny = {
      type: 'error',
      message: 'File size must be less than 5MB',
    }
    return
  }

  // upload file
  const data = new FormData()
  data.append('_method', 'PUT')
  data.append('profile_photo_path', file)
  // -------------------------------------
  userStore.updateProfileImage(String(route.params.id), data)
}
// ---------------------------------------

// Block handle Tap button

// ─── Tab Logic ───────────────────────────────────────────────
type TabKey = 'stays' | 'leave' | 'payment'

const isTap = ref<TabKey>('stays')

const taps: { label: TabKey }[] = [{ label: 'stays' }, { label: 'leave' }, { label: 'payment' }]

// Load data សម្រាប់ tab នីមួយៗ (lazy load)
const loadTabData = async (tab: TabKey) => {
  const studentId = Number(route.params.id)
  if (!studentId) return

  switch (tab) {
    case 'stays':
      break

    case 'leave':
      break

    case 'payment':
      break
  }
}

// Click tab: skip ប្រសិនបើ tab ដដែល
const handleTap = async (tab: TabKey) => {
  if (isTap.value === tab) return
  isTap.value = tab
  await loadTabData(tab)
}

onMounted(async () => {
  const studentId = Number(route.params.id)
  if (!studentId) return

  // Load profile
  await userStore.getStudentProfiles(studentId)

  // Load default tab (stays)
  await loadTabData('stays')

  formReset()
  // assign data to form data
  formData.user_name = userStore.user_info?.user_name ?? ''
  formData.first_name = userStore.user_info?.first_name ?? ''
  formData.last_name = userStore.user_info?.last_name ?? ''
  formData.email = userStore.user_info?.email ?? ''
  formData.phone_number = userStore.user_info?.phone_number ?? ''
  formData.role = userStore.user_info?.role ?? ''
  formData.status = userStore.user_info?.status ?? ''
  formData.bio = userStore.user_info?.bio ?? ''
  formData.info.id = userStore.user_info?.info?.id ?? 0
  formData.info.id_card = userStore.user_info?.info?.id_card ?? ''
  formData.info.phone_parent = userStore.user_info?.info?.phone_parent ?? ''
  formData.info.date_of_birth = userStore.user_info?.info?.date_of_birth ?? ''
  formData.gender = userStore.user_info?.gender ?? ''
  formData.info.major = userStore.user_info?.info?.major ?? ''
  formData.info.level = userStore.user_info?.info?.level ?? ''
  formData.info.year = userStore.user_info?.info?.year ?? ''
  formData.info.address = userStore.user_info?.info?.address ?? ''
})
</script>
<template>
  <!-- Block Reset password for staff by admin -->
  <div
    class="fixed w-full h-screen flex justify-center items-center bg-black/30 z-50 p-4"
    @click="userStore.isOponeResetPassword = false"
    v-if="userStore.isOponeResetPassword"
  >
    <div class="w-full md:w-1/2 lg:w-1/3 bg-white p-6 rounded-md shadow-2xl relative" @click.stop>
      <div class="absolute right-2 top-2">
        <button
          class="p-1 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer"
          @click="userStore.isOponeResetPassword = false"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <p class="font-Kantumruy text-red-500">Change Password</p>
      <div class="mt-2 flex relative">
        <input
          v-model="password"
          type="text"
          class="w-full p-2 bg-slate-100 rounded focus:outline-0 focus:ring-blue-400 focus:ring-2 font-Kantumruy"
          placeholder="Create New Password"
        />

        <button
          @click="resetPassword"
          class="font-Kantumruy px-4 bg-blue-600 text-white rounded-r absolute top-0 bottom-0 right-0 hover:bg-blue-500 cursor-pointer focus:ring-2 focus:ring-blue-400"
        >
          <span v-if="!userStore.isLoading">Save</span>
          <div v-else class="flex justify-center items-center">
            <div class="w-8 h-8">
              <loading />
            </div>
          </div>
        </button>
      </div>

      <span
        class="text-xs font-poppins"
        :class="userStore.isMessageAny.type == 'error' ? 'text-red-500' : 'text-green-700'"
        >{{ userStore.isMessageAny.message }}</span
      >
    </div>
  </div>
  <!-- End Block Reset password for staff by admin -->

  <FormCreate v-if="staffStore.isShowCreate" />
  <AdminLayouts title="Dashboard">
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

        <!-- Block Card info user -->
        <div class="w-full p-4 border border-slate-300 bg-white dark:bg-slate-800 rounded-xl">
          <!-- ── Header ─────────────────────────────────────────────────────────── -->
          <div class="flex justify-between items-center">
            <div>
              <h1 class="font-Kantumruy font-medium text-slate-500">Profile Info</h1>
              <p class="font-Kantumruy text-slate-400 text-xs">Personal Information</p>
            </div>

            <button
              @click="toggleShowMore"
              class="p-1 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-500 duration-300 transition-transform"
              :class="isShowMore ? '' : 'rotate-180'"
              :title="isShowMore ? 'Collapse' : 'Expand'"
            >
              <component :is="ArrowSmallUpIcon" />
            </button>
          </div>

          <!-- ── Body ───────────────────────────────────────────────────────────── -->
          <div class="w-full flex gap-4 mt-1 max-lg:flex-col">
            <!-- ── Left: Avatar Panel ──────────────────────────────────────────── -->
            <div class="min-w-1/3 max-w-1/3 max-lg:min-w-full max-lg:max-w-full">
              <!-- Banner + Avatar -->
              <div
                class="w-full relative overflow-visible rounded-t-2xl bg-radial-[at_5%_25%] from-green-700 to-green-500 to-75%"
              >
                <div class="w-full stripe-bg">
                  <div class="w-full h-30 stripe-bg-2 p-4 flex gap-4 justify-start items-center">
                    <div class="flex gap-4 items-center absolute -bottom-1/3">
                      <!-- Avatar -->
                      <div class="relative w-30 h-30 rounded-full">
                        <img
                          class="w-30 h-30 bg-white rounded-full object-cover object-center border-2 border-white ring-4 ring-blue-600"
                          :src="photoUrl"
                          :alt="userStore.user_info?.user_name ?? 'Avatar'"
                        />
                      </div>

                      <!-- Name / ID / Badges -->
                      <div>
                        <h1 class="font-Kantumruy font-medium text-white text-xl uppercase">
                          {{ userStore.user_info?.user_name ?? 'N/A' }}
                        </h1>
                        <p class="font-Kantumruy text-white text-xs font-medium">
                          ID Card: {{ userStore.user_info?.info?.id_card ?? 'N/A' }}
                        </p>

                        <!-- Role + Status badges -->
                        <div class="flex gap-2 mt-3">
                          <!-- Role badge -->
                          <span
                            class="font-Kantumruy text-white text-xs px-3 py-1.5 capitalize bg-blue-600 font-medium border border-blue-600 rounded-full flex items-center gap-1"
                          >
                            <component :is="UserFillIcon" class="w-4 h-4" />
                            {{ userStore.user_info?.role === 'user' ? 'Student' : 'Admin' }}
                          </span>

                          <!-- Status badge -->
                          <span
                            class="font-Kantumruy text-white text-xs px-3 py-1.5 capitalize font-medium border rounded-full"
                            :class="{
                              'bg-warning border-warning':
                                userStore.user_info?.status === 'pending',
                              'bg-green-500 border-white': userStore.user_info?.status === 'active',
                              'bg-red-500   border-red-500':
                                userStore.user_info?.status === 'block',
                            }"
                          >
                            {{ userStore.user_info?.status }}
                          </span>
                        </div>

                        <!-- Change photo -->
                        <div class="mt-2 flex">
                          <label class="cursor-pointer">
                            <div
                              class="bg-white hover:bg-blue-50 px-3 py-2 border rounded-full text-blue-600 flex justify-center items-center"
                            >
                              <div class="flex items-center gap-2">
                                <component :is="UploadIcon" class="w-4 h-4" />
                                <p class="font-Kantumruy text-blue-600 text-xs font-medium">
                                  Change Image
                                </p>
                              </div>
                            </div>
                            <input
                              @change="handleFileUpload"
                              type="file"
                              accept=".png,.jpg"
                              class="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- progress bar -->

              <div class="w-full mt-12" v-if="userStore.isUploading">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-body">Upload File</span>
                  <span class="text-sm font-medium text-body">{{ userStore.uploadProgress }}%</span>
                </div>
                <div class="w-full bg-neutral-quaternary rounded-full h-2 dark:bg-slate-500">
                  <div
                    class="bg-brand h-2 rounded-full bg-red-500"
                    :style="{ width: userStore.uploadProgress + '%' }"
                  ></div>
                </div>
              </div>

              <!-- End progress bar -->
              <!-- Change Password -->
              <div class="w-full mt-15">
                <button
                  type="button"
                  class="w-full bg-red-600 hover:bg-red-500 text-white font-Kantumruy font-medium py-2 rounded-full transition-colors duration-300"
                  @click="userStore.isOponeResetPassword = true"
                >
                  Change Password
                </button>
              </div>

              <!-- message -->
              <div class="w-full mt-2">
                <div
                  v-if="userStore.isMessageAny.message"
                  :class="{
                    'bg-green-50 border-green-500 text-green-500':
                      userStore.isMessageAny.type === 'success',
                    'bg-red-50 border-red-500 text-red-500':
                      userStore.isMessageAny.type === 'error',
                  }"
                  class="w-full p-2 rounded-md border"
                >
                  {{ userStore.isMessageAny.message }}
                </div>
              </div>
            </div>
            <!-- ── End Left Panel ──────────────────────────────────────────────── -->

            <!-- ── Right: Form ─────────────────────────────────────────────────── -->
            <div class="w-full max-lg:mt-2">
              <form class="space-y-3" @submit.prevent="handleUpdateProfile">
                <!-- Row 1: last_name / first_name / user_name -->
                <div class="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white">នាមខ្លួន</label>
                    <div class="mt-1">
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.last_name
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="text"
                        v-model="formData.last_name"
                        placeholder="នាមខ្លួន"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.last_name"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.last_name }}
                    </span>
                  </div>

                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white">នាមត្រកូល</label>
                    <div class="mt-1">
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.first_name
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="text"
                        v-model="formData.first_name"
                        placeholder="នាមត្រកូល"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.first_name"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.first_name }}
                    </span>
                  </div>

                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white"
                      >ឈ្មោះជាភាសាអង់គ្លេស</label
                    >
                    <div class="mt-1">
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.user_name
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="text"
                        v-model="formData.user_name"
                        placeholder="Username"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.user_name"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.user_name }}
                    </span>
                  </div>
                </div>

                <!-- Row 2: id_card / date_of_birth / gender -->
                <div class="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white"
                      >លេខសម្គាល់កាត</label
                    >
                    <div class="mt-1">
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.info?.id_card
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="text"
                        v-model="formData.info.id_card"
                        placeholder="ID Card"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.info.id_card"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.info.id_card }}
                    </span>
                  </div>

                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white"
                      >ថ្ងៃខែឆ្នាំកំណើត</label
                    >
                    <div class="mt-1">
                      <!-- FIX: ប្រើ type="date" ជំនួស text -->
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.info?.date_of_birth
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="date"
                        v-model="formData.info.date_of_birth"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.info.date_of_birth"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.info.date_of_birth }}
                    </span>
                  </div>

                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white">ភេទ</label>
                    <div class="mt-1">
                      <!-- FIX: option values ត្រូវបានបន្ថែម -->

                      <select
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.gender
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        v-model="formData.gender"
                      >
                        <option value="male">ប្រុស</option>
                        <option value="female">ស្រី</option>
                      </select>
                    </div>
                    <span
                      v-if="userStore.isErrors.gender"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.gender }}
                    </span>
                  </div>
                </div>

                <!-- Row 3: phone_number / phone_parent -->
                <div class="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white"
                      >លេខទូរស័ព្ទនិស្សិត</label
                    >
                    <div class="mt-1">
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.phone_number
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="tel"
                        v-model="formData.phone_number"
                        placeholder="0XX XXX XXX"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.phone_number"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.phone_number }}
                    </span>
                  </div>

                  <div>
                    <label class="font-Kantumruy text-slate-500 dark:text-white"
                      >លេខទូរស័ព្ទអាព្យាបាល</label
                    >
                    <div class="mt-1">
                      <input
                        class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                        :class="
                          userStore.isErrors.info?.phone_parent
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                        "
                        type="tel"
                        v-model="formData.info.phone_parent"
                        placeholder="0XX XXX XXX"
                      />
                    </div>
                    <span
                      v-if="userStore.isErrors.info.phone_parent"
                      class="font-Kantumruy text-red-500 text-xs"
                    >
                      {{ userStore.isErrors.info.phone_parent }}
                    </span>
                  </div>
                </div>

                <!-- ── Extra fields (Collapsible) ─────────────────────────────── -->
                <Transition name="slide-fade">
                  <div v-if="isShowMore" class="space-y-3">
                    <!-- Row 4: email / address -->
                    <div class="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white">អ៊ីមែល</label>
                        <div class="mt-1">
                          <input
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.email
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            type="email"
                            v-model="formData.email"
                            placeholder="example@email.com"
                          />
                        </div>
                        <span
                          v-if="userStore.isErrors.email"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.email }}
                        </span>
                      </div>

                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white"
                          >អាស័យដ្ឋាន</label
                        >
                        <div class="mt-1">
                          <input
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.info?.address
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            type="text"
                            v-model="formData.info.address"
                            placeholder="អាស័យដ្ឋាន"
                          />
                        </div>
                        <span
                          v-if="userStore.isErrors.info.address"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.info.address }}
                        </span>
                      </div>
                    </div>

                    <!-- Row 5: major / level -->
                    <div class="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white">ជំនាញ</label>
                        <div class="mt-1">
                          <input
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.info?.major
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            type="text"
                            v-model="formData.info.major"
                            placeholder="ជំនាញ"
                          />
                        </div>
                        <span
                          v-if="userStore.isErrors.info.major"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.info.major }}
                        </span>
                      </div>

                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white"
                          >កម្រិតថ្នាក់</label
                        >
                        <div class="mt-1">
                          <input
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.info?.level
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            type="text"
                            v-model="formData.info.level"
                            placeholder="កម្រិតថ្នាក់"
                          />
                        </div>
                        <span
                          v-if="userStore.isErrors.info.level"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.info.level }}
                        </span>
                      </div>
                    </div>

                    <!-- Row 6: year / role / status -->
                    <div class="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white"
                          >ឆ្នាំសិក្សា</label
                        >
                        <div class="mt-1">
                          <input
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.info?.year
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            type="text"
                            v-model="formData.info.year"
                            placeholder="ឆ្នាំសិក្សា"
                          />
                        </div>
                        <span
                          v-if="userStore.isErrors.info.year"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.info.year }}
                        </span>
                      </div>

                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white">តួនាទី</label>
                        <div class="mt-1">
                          <select
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.role
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            :disabled="authStore.current_use?.role !== 'admin'"
                            v-model="formData.role"
                          >
                            <option value="admin">អ្នកគ្រប់គ្រង</option>
                            <option value="staff">បុគ្គលិក</option>
                            <option value="user">សិស្ស</option>
                          </select>
                        </div>
                        <span
                          v-if="userStore.isErrors.role"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.role }}
                        </span>
                      </div>

                      <div>
                        <label class="font-Kantumruy text-slate-500 dark:text-white"
                          >ស្ថានភាព</label
                        >
                        <div class="mt-1">
                          <select
                            class="w-full px-3 p-2 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border font-Kantumruy"
                            :class="
                              userStore.isErrors.status
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600'
                            "
                            v-model="formData.status"
                          >
                            <option value="pending">រង់ចាំ</option>
                            <option value="active">សកម្ម</option>
                            <option value="block">បិទ</option>
                          </select>
                        </div>
                        <span
                          v-if="userStore.isErrors.status"
                          class="font-Kantumruy text-red-500 text-xs"
                        >
                          {{ userStore.isErrors.status }}
                        </span>
                      </div>
                    </div>

                    <!-- Row 7: bio -->
                    <div>
                      <label class="font-Kantumruy text-slate-500 dark:text-white">ការពណ៍នា</label>
                      <div class="mt-1">
                        <textarea
                          class="w-full px-3 p-2 bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-md border border-slate-300 font-Kantumruy"
                          :class="userStore.isErrors.bio ? 'border-red-500' : ''"
                          v-model="formData.bio"
                          placeholder="ការពណ៍នា"
                          rows="4"
                        ></textarea>
                      </div>
                      <span
                        v-if="userStore.isErrors.bio"
                        class="font-Kantumruy text-red-500 text-xs"
                      >
                        {{ userStore.isErrors.bio }}
                      </span>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end">
                      <button
                        type="submit"
                        title="Save Update"
                        :disabled="!isUpdate || userStore.isLoading"
                        class="px-4 py-2 bg-blue-600 text-white flex items-center gap-2 rounded-md hover:bg-blue-500 font-Kantumruy cursor-pointer transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                      >
                        <template v-if="!userStore.isLoading">
                          <component :is="PrintIcon" />
                          <span class="font-Kantumruy font-medium">Save</span>
                        </template>
                        <template v-else>
                          <div class="w-5 h-5 flex justify-center items-center">
                            <component :is="Loading" />
                          </div>
                          <span class="font-Kantumruy font-medium">Loading...</span>
                        </template>
                      </button>
                    </div>
                  </div>
                </Transition>
                <!-- ── End Extra fields ───────────────────────────────────────── -->
              </form>
            </div>
            <!-- ── End Right: Form ────────────────────────────────────────────── -->
          </div>
        </div>
      </div>

      <!--  -->

      <!-- Block Tap Show component -->

      <!-- Tab Buttons -->
      <div
        class="w-full bg-white dark:bg-slate-800 mt-4 rounded-full space-x-2 border border-slate-300 p-1"
      >
        <button
          v-for="(tap, index) in taps"
          :key="index"
          @click="handleTap(tap.label)"
          class="px-6 py-2 font-Kantumruy rounded-full capitalize ease-in-out duration-300 border cursor-pointer"
          :class="
            isTap === tap.label
              ? 'bg-linear-to-r/srgb from-green-500 to-blue-400 text-white border-blue-600'
              : 'bg-blue-500/10 text-blue-500 border-blue-500/10'
          "
        >
          {{ tap.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="w-full">
        <TableStays v-if="isTap === 'stays'" />
        <TableLeave v-else-if="isTap === 'leave'" />
        <TablePayments v-else-if="isTap === 'payment'" />
      </div>
      <!-- End Block show table -->
    </div>
  </AdminLayouts>
</template>
