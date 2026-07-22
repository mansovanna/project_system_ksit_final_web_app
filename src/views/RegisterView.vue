<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import InputField from '@/components/InputField.vue'

import {
  CallIcon,
  DateIcon,
  FolderFillIcon,
  IdCardIcon,
  LocationIcon,
  LockIcon,
  UserFillIcon,
  ViewIcon,
  ViewOutline,
} from '@/stores/Icons'
import { useAuthStore } from '@/stores/auth'
import type { RegisterForm } from '@/models/RegisterModel'
import BlockLogoSchool from '@/widgets/BlockLogoSchool.vue'
import Loading from '@/widgets/Loading.vue'

const auhtStore = useAuthStore()

const formData = reactive<RegisterForm>({
  login: '',
  user_name: '',
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  role: '',
  status: '',
  bio: '',
  profile_photo_path: '',
  profile_photo_url: '',
  id_card: '',
  password: '',
  password_confirme: '',
  password_old: '',
  phone_parent: '',
  date_of_birth: '',
  gender: '',
  major: '',
  level: '',
  year: '',
  address: '',
  file: null as File | null,
})

const clearErrors = () => {
  Object.keys(auhtStore.errors).forEach((key) => {
    auhtStore.errors[key as keyof RegisterForm] = ''
  })
}

const isOpen = ref(false)
const showPassword = () => {
  isOpen.value = !isOpen.value
}

// track file
const trackFile = (event: any) => {
  const target = event.target as any
  if (target.files && target.files.length > 0) {
    formData.file = target.files[0]
  }
}

const validate = () => {
  clearErrors()

  if (!formData.first_name.trim()) {
    auhtStore.errors.first_name = 'First name is required'
    return false
  }

  if (!formData.last_name.trim()) {
    auhtStore.errors.last_name = 'Last name is required'
    return false
  }

  if (!formData.user_name.trim()) {
    auhtStore.errors.user_name = 'Username is required'
    return false
  }

  if (!formData.login.trim()) {
    auhtStore.errors.login = 'ID Card or Email is required'
    return false
  }

  if (!formData.date_of_birth) {
    auhtStore.errors.date_of_birth = 'Date of birth is required'
    return false
  }

  if (!formData.gender) {
    auhtStore.errors.gender = 'Gender is required'
    return false
  }

  if (!formData.address.trim()) {
    auhtStore.errors.address = 'Address is required'
    return false
  }

  if (!formData.level.trim()) {
    auhtStore.errors.level = 'Level is required'
    return false
  }

  if (!formData.year.trim()) {
    auhtStore.errors.year = 'Year is required'
    return false
  }

  if (!formData.major.trim()) {
    auhtStore.errors.major = 'Major is required'
    return false
  }

  if (!formData.phone_number.trim()) {
    auhtStore.errors.phone_number = 'Phone number is required'
    return false
  }

  if (!formData.phone_parent.trim()) {
    auhtStore.errors.phone_parent = 'Parent phone number is required'
    return false
  }

  if (!formData.file) {
    auhtStore.errors.file = 'File is required'
    return false
  }

  if (!formData.password) {
    auhtStore.errors.password = 'Password is required'
    return false
  }

  if (formData.password.length < 6) {
    auhtStore.errors.password = 'Password must be at least 6 characters'
    return false
  }

  if (!formData.password_confirme) {
    auhtStore.errors.password_confirme = 'Confirm password is required'
    return false
  }

  if (formData.password !== formData.password_confirme) {
    auhtStore.errors.password_confirme = 'Passwords do not match'
    return false
  }

  return true
}

const submit = () => {
  if (!validate()) return

  // console.log(formData)

  const data = new FormData()
  data.append('first_name', formData.first_name)
  data.append('last_name', formData.last_name)
  data.append('user_name', formData.user_name)
  data.append('id_card', formData.login)
  data.append('phone_number', formData.phone_number)
  data.append('phone_parent', formData.phone_parent)
  data.append('date_of_birth', formData.date_of_birth)
  data.append('gender', formData.gender)
  data.append('address', formData.address)
  data.append('level', formData.level)
  data.append('year', formData.year)
  data.append('major', formData.major)
  data.append('password', formData.password)
  data.append('password_confirmation', formData.password_confirme)
  data.append('file', formData.file ?? '')

  auhtStore.registerForm(data)
}

onMounted(() => {
  auhtStore.errors.login = ''
  auhtStore.errors.user_name = ''
  auhtStore.errors.first_name = ''
  auhtStore.errors.last_name = ''
  auhtStore.errors.email = ''
  auhtStore.errors.phone_number = ''
  auhtStore.errors.role = ''
  auhtStore.errors.status = ''
  auhtStore.errors.bio = ''
  auhtStore.errors.profile_photo_path = ''
  auhtStore.errors.profile_photo_url = ''
  auhtStore.errors.id_card = ''
  auhtStore.errors.password = ''
  auhtStore.errors.password_confirme = ''
  auhtStore.errors.password_old = ''
  auhtStore.errors.phone_parent = ''
  auhtStore.errors.date_of_birth = ''
  auhtStore.errors.gender = ''
  auhtStore.errors.major = ''
  auhtStore.errors.level = ''
  auhtStore.errors.year = ''
  auhtStore.errors.address = ''
  auhtStore.isMessageError.login = ''
  auhtStore.isMessageError.password = ''
})
</script>

<template>
  <div class="w-full h-screen overflow-auto">
    <div
      class="w-full min-h-screen bg-slate-200 dark:bg-slate-900 flex flex-col lg:flex-row relative"
    >
      <!-- Left Panel -->
      <div class="w-1/2 max-lg:w-full h-screen max-lg:h-auto sticky top-0 max-lg:relative bottom-0">
        <div
          class="w-full h-screen flex justify-center items-center max-lg:h-auto bg-green-800 p-5 relative overflow-clip"
        >
          <div class="w-96 h-96 bg-yellow-100/10 rounded-full absolute -right-32 -top-20"></div>
          <div class="w-24 h-24 bg-yellow-600/10 rounded-full absolute top-10 left-10"></div>
          <!-- logo -->

          <BlockLogoSchool />
        </div>
      </div>

      <!-- Right Panel -->
      <div
        class="w-full lg:w-1/2 max-lg:w-full flex flex-col justify-center items-center p-5 sticky top-0 max-lg:relative bottom-0"
      >
        <!-- spacer -->
        <!-- <div class="w-full p-2 max-lg:hidden"></div> -->
        <!-- Ene spacer -->
        <form @submit.prevent="submit()" class="w-full">
          <div
            class="bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 p-4 sm:p-5"
          >
            <h1 class="font-Kantumruy text-xl sm:text-4xl text-green-700 font-bold">Register</h1>
            <p class="font-Kantumruy mt-1 text-slate-400">Please fill in the information below</p>
            <div v-if="auhtStore.isMessageError.login" class="mt-2">
              <p class="text-red-500 text-sm">{{ auhtStore.isMessageError.login }}</p>
            </div>

            <div class="w-full mt-4 space-y-4">
              <!-- Block 1 -->
              <div class="grid lg:grid-cols-2 gap-4">
                <!-- First name -->
                <InputField
                  required
                  label="First Name"
                  v-model="formData.first_name"
                  placeholder="Enter your first name"
                  :error="auhtStore.errors.first_name"
                >
                  <component :is="UserFillIcon" />
                </InputField>

                <!-- End First name -->

                <!-- Last name -->
                <InputField
                  required
                  label="Last Name"
                  v-model="formData.last_name"
                  placeholder="Enter your last name"
                  :error="auhtStore.errors.last_name"
                >
                  <component :is="UserFillIcon" />
                </InputField>
                <!-- End Last name -->

                <!-- Block user name -->
                <InputField
                  required
                  label="Name is English"
                  v-model="formData.user_name"
                  placeholder="Enter your user name"
                  :error="auhtStore.errors.user_name"
                >
                  <component :is="UserFillIcon" />
                </InputField>

                <!-- End Block user name -->

                <!-- id card -->
                <!-- Login -->

                <InputField
                  required
                  label="ID Card"
                  v-model="formData.login"
                  placeholder="Enter your ID Card"
                  :error="auhtStore.errors.login"
                >
                  <component :is="IdCardIcon" />
                </InputField>
                <!-- End Login -->
                <!-- End id card -->

                <!-- DOB -->
                <InputField
                  required
                  label="Date of Birth"
                  v-model="formData.date_of_birth"
                  type="date"
                  :error="auhtStore.errors.date_of_birth"
                >
                  <component :is="DateIcon" />
                </InputField>
                <!-- End DOB -->

                <!-- Gender -->
                <div>
                  <label for="file" class="font-Kantumruy text-sm text-slate-500"
                    >Gender <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <select
                      v-model="formData.gender"
                      class="w-full pl-10 px-3 py-2 font-Kantumruy rounded-md bg-slate-50 dark:bg-slate-800 focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
                      :class="[
                        auhtStore.errors.gender
                          ? 'border-red-500 ring-2 ring-red-500/40'
                          : 'border border-slate-200 dark:border-slate-700',
                      ]"
                    >
                      <option value="" disabled>-- Select Gender --</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div
                      class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700 font-Kantumruy"
                    >
                      <component :is="UserFillIcon" />
                    </div>
                  </div>
                  <p
                    v-if="auhtStore.errors.gender"
                    class="text-xs text-red-500 mt-1 font-Kantumruy"
                  >
                    {{ auhtStore.errors.gender }}
                  </p>
                </div>
                <!-- End Gender -->
              </div>
              <!-- Address -->
              <InputField
                required
                label="Address"
                v-model="formData.address"
                placeholder="Enter your address"
                :error="auhtStore.errors.address"
              >
                <component :is="LocationIcon" />
              </InputField>
              <!-- End Address -->

              <div class="grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-0">
                <!-- Level -->
                <InputField
                  required
                  label="Level"
                  v-model="formData.level"
                  placeholder="Enter your level"
                  :error="auhtStore.errors.level"
                />

                <!-- Year -->
                <InputField
                  required
                  label="Year"
                  v-model="formData.year"
                  placeholder="Enter your year"
                  :error="auhtStore.errors.year"
                />

                <!-- Major -->
                <InputField
                  required
                  label="Major"
                  v-model="formData.major"
                  placeholder="Enter your major"
                  :error="auhtStore.errors.major"
                />
              </div>

              <!-- Block 2 -->
              <div class="grid lg:grid-cols-2 gap-4">
                <!-- Phone -->
                <InputField
                  required
                  label="Phone Number"
                  v-model="formData.phone_number"
                  placeholder="000 - 000 - 000"
                  :error="auhtStore.errors.phone_number"
                >
                  <component :is="CallIcon" />
                </InputField>

                <!-- End Phone -->

                <!-- Parent Phone -->
                <InputField
                  required
                  label="Parent Phone Number"
                  v-model="formData.phone_parent"
                  placeholder="000 - 000 - 000"
                  :error="auhtStore.errors.phone_parent"
                >
                  <component :is="CallIcon" />
                </InputField>
                <!-- End Parent Phone -->
              </div>
              <!-- End Block 2 -->

              <!-- Block file -->
              <!-- file -->
              <div>
                <label for="file" class="font-Kantumruy text-sm text-slate-500"
                  >Photo Profile (PNG, Max 2MB) <span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <input
                    type="file"
                    id="file"
                    @change="trackFile($event)"
                    accept=".png"
                    class="w-full pl-10 px-3 py-2 font-Kantumruy rounded-md bg-slate-50 dark:bg-slate-800 focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
                    :class="[
                      auhtStore.errors.file
                        ? 'border-red-500 ring-2 ring-red-500/40'
                        : 'border border-slate-200 dark:border-slate-700',
                    ]"
                  />
                  <div
                    class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700 font-Kantumruy"
                  >
                    <component :is="FolderFillIcon" />
                  </div>
                </div>
                <p v-if="auhtStore.errors.file" class="text-xs text-red-500 mt-1 font-Kantumruy">
                  {{ auhtStore.errors.file }}
                </p>
              </div>
              <!-- End file -->
              <!-- End Block file -->

              <!-- block pass -->
              <div class="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
                <!-- pass -->
                <div>
                  <p class="font-Kantumruy text-sm text-slate-500">
                    Create Password <span class="text-red-500">*</span>
                  </p>

                  <div class="relative">
                    <input
                      v-model="formData.password"
                      :type="isOpen ? 'text' : 'password'"
                      placeholder="*******"
                      class="w-full px-3 py-2 pl-10 font-Kantumruy rounded-md bg-slate-50 dark:bg-slate-800 focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
                      :class="[
                        auhtStore.errors.password
                          ? 'border-red-500 ring-2 ring-red-500/40'
                          : 'border border-slate-200 dark:border-slate-700',
                      ]"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700">
                      <component :is="LockIcon" />
                    </div>
                    <div class="absolute inset-y-0 -right-2 flex items-center px-2">
                      <button
                        type="button"
                        @click="showPassword()"
                        class="w-9 h-9 rounded-full flex cursor-pointer justify-center items-center hover:bg-green-700 text-green-700 hover:text-white"
                      >
                        <component :is="isOpen ? ViewOutline : ViewIcon" />
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-red-500 mt-1">{{ auhtStore.errors.password }}</p>
                </div>
                <!-- End pass -->

                <!-- pass comfirm -->
                <div>
                  <p class="font-Kantumruy text-sm text-slate-500">
                    Confirm Password <span class="text-red-500">*</span>
                  </p>

                  <div class="relative">
                    <input
                      v-model="formData.password_confirme"
                      :type="isOpen ? 'text' : 'password'"
                      placeholder="*******"
                      class="w-full px-3 py-2 pl-10 font-Kantumruy rounded-md bg-slate-50 dark:bg-slate-800 focus:border-emerald-600 focus:outline focus:outline-white focus:ring-3 focus:ring-emerald-800"
                      :class="[
                        auhtStore.errors.password_confirme
                          ? 'border-red-500 ring-2 ring-red-500/40'
                          : 'border border-slate-200 dark:border-slate-700',
                      ]"
                    />
                    <div class="absolute inset-y-0 left-0 flex items-center px-3 text-green-700">
                      <component :is="LockIcon" />
                    </div>
                    <div class="absolute inset-y-0 -right-2 flex items-center px-2">
                      <button
                        type="button"
                        @click="showPassword"
                        class="w-9 h-9 rounded-full flex cursor-pointer justify-center items-center hover:bg-green-700 text-green-700 hover:text-white"
                      >
                        <component :is="isOpen ? ViewOutline : ViewIcon" />
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-red-500 mt-1">{{ auhtStore.errors.password_confirme }}</p>
                </div>
                <!-- End pass confirm -->
              </div>

              <!-- End block pass -->
            </div>
            <!-- Submit -->
            <button
              type="submit"
              :disabled="auhtStore.isLoading"
              class="mt-6 w-full font-Kantumruy disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-900 hover:bg-green-800 text-white p-3 rounded-md"
            >
              <span v-if="auhtStore.isLoading" class="flex justify-center items-center gap-2">
                <div class="flex justify-center items-center w-5 h-5">
                  <Loading />
                </div>
                <span>Loding...</span>
              </span>
              <span v-else>Submit</span>
            </button>

            <!-- Divider -->
            <div class="w-full mt-6 flex items-center gap-2">
              <hr class="w-full border-slate-300" />
              <div>
                <div class="w-4 h-4 bg-green-700 rotate-45"></div>
              </div>
              <hr class="w-full border-slate-300" />
            </div>

            <!-- Register -->
            <div class="mt-4 text-center text-sm sm:text-base">
              <span class="text-slate-400 font-Kantumruy">Already have an account?</span>
              <RouterLink
                :to="{ name: 'login' }"
                class="ml-1 text-blue-600 hover:underline font-Kantumruy cursor-pointer"
              >
                Login
              </RouterLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
