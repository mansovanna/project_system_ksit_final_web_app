<script setup lang="ts">
import { CloseIcon } from '@/stores/Icons'
import { ref } from 'vue'

/* ================== Emit ================== */
const emit = defineEmits(['close'])

/* ================== Form ================== */
const form = ref({
  idCard: '',
  firstName: '',
  lastName: '',
  username: '',
  dob: '',
  phone: '',
  parentPhone: '',
  address: '',
  major: '',
  year: '',
  password: '',
  passwordConfirm: '',
  photo: null as File | null,
})

/* ================== Errors ================== */
const errors = ref<Record<string, string>>({})

/* ================== File ================== */
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.photo = target.files[0]
  }
}

/* ================== Validation ================== */
const validateForm = () => {
  errors.value = {}

  if (!form.value.idCard) {
    errors.value.idCard = 'ID Card is required'
  }

  if (!form.value.firstName) {
    errors.value.firstName = 'First name is required'
  }

  if (!form.value.lastName) {
    errors.value.lastName = 'Last name is required'
  }

  if (!form.value.phone) {
    errors.value.phone = 'Phone is required'
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  if (!form.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Password confirmation is required'
  } else if (form.value.password !== form.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

/* ================== Submit ================== */
const submitForm = () => {
  if (!validateForm()) return

  console.log('SUBMIT 👉', form.value)
  // TODO: call API
}

/* ================== Input Class ================== */
const inputClass = (error?: string) => {
  return [
    'input',
    error
      ? 'border-red-500 focus:ring-red-200'
      : 'border-slate-300 dark:border-slate-400 focus:border-blue-500 focus:ring-blue-200',
  ]
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
      <div class="p-4 overflow-y-auto max-h-[calc(90vh-64px)]">
        <!-- ID Card -->
        <div class="mb-4">
          <label class="label"> ID Card <span class="text-red-500">*</span> </label>
          <input
            v-model="form.idCard"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="Enter ID Card number..."
            :class="inputClass(errors.idCard)"
          />
          <p v-if="errors.idCard" class="error-text">{{ errors.idCard }}</p>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <!-- First Name -->
          <div>
            <label class="label"> First Name <span class="text-red-500">*</span> </label>
            <input v-model="form.firstName" type="text" :class="inputClass(errors.firstName)" />
            <p v-if="errors.firstName" class="error-text">{{ errors.firstName }}</p>
          </div>

          <!-- Last Name -->
          <div>
            <label class="label"> Last Name <span class="text-red-500">*</span> </label>
            <input v-model="form.lastName" type="text" :class="inputClass(errors.lastName)" />
            <p v-if="errors.lastName" class="error-text">{{ errors.lastName }}</p>
          </div>

          <!-- Username -->
          <div>
            <label class="label">User Name</label>
            <input v-model="form.username" type="text" class="input border-slate-400" />
          </div>

          <!-- DOB -->
          <div>
            <label class="label">Date of Birth</label>
            <input v-model="form.dob" type="date" class="input border-slate-400" />
          </div>

          <!-- Phone -->
          <div>
            <label class="label"> Phone <span class="text-red-500">*</span> </label>
            <input v-model="form.phone" type="text" :class="inputClass(errors.phone)" />
            <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
          </div>

          <!-- Parent Phone -->
          <div>
            <label class="label">Phone Parent</label>
            <input v-model="form.parentPhone" type="text" class="input border-slate-400" />
          </div>

          <!-- Address -->
          <div>
            <label class="label">Address</label>
            <input v-model="form.address" type="text" class="input border-slate-400" />
          </div>

          <!-- Major -->
          <div>
            <label class="label">Major</label>
            <select v-model="form.major" class="input border-slate-400">
              <option value="">Select major</option>
              <option value="computer">Computer</option>
              <option value="accounting">Accounting</option>
            </select>
          </div>

          <!-- Year -->
          <div>
            <label class="label">Year</label>
            <input v-model="form.year" type="text" class="input border-slate-400" />
          </div>

          <!-- Photo -->
          <div>
            <label class="label">Photo</label>
            <input
              type="file"
              @change="handleFileChange"
              class="w-full px-3 py-2 border border-blue-300 rounded-md font-Kantumruy text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="label"> Password <span class="text-red-500">*</span> </label>
            <input v-model="form.password" type="password" :class="inputClass(errors.password)" />
            <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
          </div>

          <!-- Password Confirm -->
          <div>
            <label class="label"> Password Confirm <span class="text-red-500">*</span> </label>
            <input
              v-model="form.passwordConfirm"
              type="password"
              :class="inputClass(errors.passwordConfirm)"
            />
            <p v-if="errors.passwordConfirm" class="error-text">
              {{ errors.passwordConfirm }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end mt-6">
          <button
            @click="submitForm"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-Kantumruy"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
