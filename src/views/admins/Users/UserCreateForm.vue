<script setup lang="ts">
import { CallIcon, CloseIcon, DateIcon, IdCardIcon, LocationIcon, LockIcon } from '@/stores/Icons'
import { useUsersStore } from '@/stores/user_store'
import InputTextField from '@/widgets/InputTextField.vue'
import { EyeIcon, EyeOffIcon, User2Icon } from '@lucide/vue'
import { ref } from 'vue'

const userStore = useUsersStore()

/* ================== Emit ================== */
const emit = defineEmits(['close'])

/* ================== Form ================== */
const form = ref({
  id_card: '',
  first_name: '',
  last_name: '',
  user_name: '',
  date_of_birth: '',
  phone_number: '',
  phone_parent: '',
  address: '',
  major: '',
  year: '',
  gender: '',
  password: '',
  password_confirmation: '',
  profile_photo_path: null as File | null,
})

/* ================== File ================== */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.profile_photo_path = target.files[0]
  }
}

/* ================== Validation ================== */
const validateForm = () => {
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

  if (!form.value.first_name) {
    userStore.isErrors.first_name = 'First name is required'
    return false
  }

  if (!form.value.last_name) {
    userStore.isErrors.last_name = 'Last name is required'
    return false
  }

  if (!form.value.user_name) {
    userStore.isErrors.user_name = 'User name is required'
    return false
  }

  if (!form.value.id_card) {
    userStore.isErrors.info.id_card = 'ID Card is required'
    return false
  }

  if (!form.value.phone_number) {
    userStore.isErrors.phone_number = 'Phone is required'
    return false
  }

  if (!form.value.password) {
    userStore.isErrors.password = 'Password is required'
    return false
  } else if (form.value.password.length < 6) {
    userStore.isErrors.password = 'Password must be at least 6 characters'
    return false
  }

  if (!form.value.password_confirmation) {
    userStore.isErrors.password_confirmation = 'Password confirmation is required'
    return false
  } else if (form.value.password !== form.value.password_confirmation) {
    userStore.isErrors.password_confirmation = 'Passwords do not match'
    return false
  }

  return true
}

/* ================== Submit ================== */
const submitForm = () => {
  if (!validateForm()) return

  // TODO: call API
  userStore.addUsers(form.value)
}

/* ================== Input Class ================== */
const isShowPassword = ref(false)

const handlePassword = () => {
  isShowPassword.value = !isShowPassword.value
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click="emit('close')"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-4xl bg-white dark:bg-slate-600 rounded-lg shadow-lg max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-3">
        <h1 class="font-Kantumruy text-lg font-medium text-slate-600 dark:text-slate-300">
          Create User or Student
        </h1>

        <button
          @click="emit('close')"
          class="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full"
        >
          <component :is="CloseIcon" />
        </button>
      </div>

      <hr class="border-slate-200 dark:border-slate-500" />

      <!-- Body -->
      <div class="p-4 overflow-y-auto max-h-[calc(90vh-64px)] space-y-2">
        <!-- Grid -->
        <div class="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          <!-- First Name -->

          <InputTextField
            v-model="form.first_name"
            :error="userStore.isErrors.first_name"
            type="text"
            label="First Name"
            placeholder="Enter first name"
            :required="true"
          >
            <template #prefix>
              <component :is="User2Icon" class="w-6 h-6 text-slate-500" />
            </template>
          </InputTextField>
          <!-- End First Name -->

          <!-- Last Name -->

          <InputTextField
            v-model="form.last_name"
            :error="userStore.isErrors.last_name"
            type="text"
            label="Last Name"
            placeholder="Enter last name"
            :required="true"
          >
            <template #prefix>
              <component :is="User2Icon" class="w-6 h-6 text-slate-500" />
            </template>
          </InputTextField>

          <!-- End Block Last Name -->

          <!-- Username -->
          <InputTextField
            v-model="form.user_name"
            :error="userStore.isErrors.user_name"
            type="text"
            label="User Name"
            placeholder="Enter user name"
            :required="true"
          >
            <template #prefix>
              <component :is="User2Icon" class="w-6 h-6 text-slate-500" />
            </template>
          </InputTextField>
          <!-- end User name -->

          <!-- ID Card -->
          <InputTextField
            v-model="form.id_card"
            :error="userStore.isErrors.info.id_card"
            type="text"
            label="ID Card"
            placeholder="Enter ID Card"
            :required="true"
          >
            <template #prefix>
              <component :is="IdCardIcon" class="w-7 h-7 text-slate-500" />
            </template>
          </InputTextField>
          <!-- End id card -->

          <!-- DOB -->
          <InputTextField
            v-model="form.date_of_birth"
            :error="userStore.isErrors.info.date_of_birth"
            type="date"
            label="Date of Birth"
            placeholder="Enter Date of Birth"
          >
            <template #prefix>
              <component :is="DateIcon" class="w-7 h-7 text-slate-500" />
            </template>
          </InputTextField>

          <!-- End DOB -->
          <!-- Gender -->
          <div>
            <label class="label">Gender</label>
            <select
              v-model="form.gender"
              class="p-2 border font-Kantumruy rounded-md dark:bg-slate-500 dark:text-slate-300 w-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              :class="
                userStore.isErrors.gender
                  ? 'border-red-500 bg-red-600/10 text-red-500 placeholder:text-red-500'
                  : 'border-slate-300 bg-slate-50 placeholder:text-slate-400'
              "
            >
              <option value="" :disabled="true">-- Select gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <p v-if="userStore.isErrors.gender" class="error-text">
              {{ userStore.isErrors.gender }}
            </p>
          </div>

          <!-- End Gender -->
        </div>

        <!--  -->
        <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <!-- Phone -->
          <InputTextField
            v-model="form.phone_number"
            :error="userStore.isErrors.phone_number"
            type="number"
            label="Phone Number"
            placeholder="Enter Phone Number"
            :required="true"
          >
            <template #prefix>
              <component :is="CallIcon" class="w-6 h-6 text-slate-500" />
            </template>
          </InputTextField>

          <!-- Parent Phone -->
          <InputTextField
            v-model="form.phone_parent"
            :error="userStore.isErrors.info.phone_parent"
            type="number"
            label="Phone Parent"
            placeholder="Enter Phone Parent"
            :required="true"
          >
            <template #prefix>
              <component :is="CallIcon" class="w-6 h-6 text-slate-500" />
            </template>
          </InputTextField>
        </div>

        <!--  -->
        <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <!-- Address -->
          <InputTextField
            v-model="form.address"
            :error="userStore.isErrors.info.address"
            type="text"
            label="Address"
            placeholder="Enter Address"
          >
            <template #prefix>
              <component :is="LocationIcon" class="w-6 h-6 text-slate-500" />
            </template>
          </InputTextField>
          <!-- Address -->

          <!-- Photo -->
          <div>
            <label class="label">Photo</label>
            <input
              type="file"
              @change="handleFileChange"
              enctype="multipart/form-data"
              class="w-full px-3 py-2 border border-blue-300 rounded-md font-Kantumruy text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <!-- Block Password -->
        <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <!-- Password -->

          <InputTextField
            v-model="form.password"
            :error="userStore.isErrors.password"
            type="text"
            label="Password"
            placeholder="********"
            :required="true"
          >
            <template #prefix>
              <component :is="LockIcon" class="w-6 h-6 text-slate-500" />
            </template>

            <template #suffix>
              <button type="button" title="Show Password" @click="handlePassword" class="p-1">
                <component :is="isShowPassword ? EyeIcon : EyeOffIcon" />
              </button>
            </template>
          </InputTextField>

          <!-- End Password -->

          <!-- Password Confirm -->
          <InputTextField
            v-model="form.password_confirmation"
            :error="userStore.isErrors.password_confirmation"
            type="text"
            label="Password Confirm"
            placeholder="********"
            :required="true"
          >
            <template #prefix>
              <component :is="LockIcon" class="w-6 h-6 text-slate-500" />
            </template>

            <template #suffix>
              <button type="button" title="Show Password" @click="handlePassword" class="p-1">
                <component :is="isShowPassword ? EyeIcon : EyeOffIcon" />
              </button>
            </template>
          </InputTextField>
        </div>
        <!-- Footer -->
        <div class="flex justify-end mt-6">
          <button
            @click="submitForm"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-Kantumruy"
          >
            <span v-if="userStore.isLoading" class="font-Kantumruy">Loading...</span>
            <span v-else class="font-Kantumruy">Save</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
