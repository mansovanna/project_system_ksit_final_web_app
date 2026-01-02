<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayouts from '@/layouts/AdminLayouts.vue'

/* ================= PROFILE ================= */
const profile = ref({
  name: 'Admin User',
  username: 'admin',
  email: 'admin@example.com',
  avatar: null as File | null,
  currentPassword: '',
  password: '',
  confirmPassword: '',
})

const avatarPreview = ref<string | null>(null)
const showPassword = ref(false)

const onAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  avatarPreview.value = URL.createObjectURL(file)
  profile.value.avatar = file
}

/* ================= PASSWORD STRENGTH ================= */
const passwordStrength = computed(() => {
  const p = profile.value.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

/* ================= SYSTEM SETTINGS ================= */
const settings = ref({
  appName: 'Admin System',
  appVersion: '1.0.0',
  timezone: 'Asia/Phnom_Penh',
  language: 'English',
  darkMode: false,
  emailNotify: true,
  smsNotify: false,
  autoBackup: true,
  backupFrequency: 'daily',
})

/* ================= SAVE ACTIONS ================= */
const saveProfile = () => console.log('Profile saved', profile.value)
const savePassword = () => console.log('Password changed', profile.value.password)
</script>

<template>
  <AdminLayouts title="Settings">
    <div class="max-w-full mx-auto px-6 py-10 space-y-10">
      <!-- ================= PROFILE IMAGE (TOP) ================= -->

      <!-- ================= PROFILE INFO ================= -->
      <section class="section flex gap-6">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-blue-500 shadow-lg overflow-hidden relative group cursor-pointer"
          >
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-semibold text-lg"
            >
              Avatar
            </div>
            <div
              class="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity rounded-full"
            >
              Change
            </div>
          </div>
          <label class="text-sm text-blue-600 cursor-pointer">
            Select image
            <input type="file" hidden accept="image/*" @change="onAvatarChange" />
          </label>
        </div>
        <div class="w-full">
          <!-- ----------------------------------------------------- -->
          <h2 class="section-title">Profile Info</h2>
          <div class="grid md:grid-cols-2 gap-4 mt-2">
            <input class="input" placeholder="Full Name" v-model="profile.name" />
            <input class="input" placeholder="Username" v-model="profile.username" />
            <input class="input md:col-span-2" placeholder="Email" v-model="profile.email" />
          </div>
          <div class="flex justify-end mt-4">
            <button class="btn-primary" @click="saveProfile">Save Profile</button>
          </div>
        </div>
      </section>

      <!-- ================= CHANGE PASSWORD ================= -->
      <section class="section border border-red-200">
        <h2 class="section-title text-red-600">Change Password</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <input
            class="input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Current Password"
            v-model="profile.currentPassword"
          />
          <input
            class="input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="New Password"
            v-model="profile.password"
          />
          <input
            class="input md:col-span-2"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirm Password"
            v-model="profile.confirmPassword"
          />
        </div>
        <label class="flex items-center gap-2 mt-3 text-sm">
          <input type="checkbox" v-model="showPassword" /> Show password
        </label>

        <div class="mt-4">
          <div class="h-2 bg-slate-200 rounded">
            <div
              class="h-2 rounded transition-all"
              :class="[
                passwordStrength <= 1 && 'bg-red-500 w-1/4',
                passwordStrength === 2 && 'bg-yellow-500 w-2/4',
                passwordStrength === 3 && 'bg-blue-500 w-3/4',
                passwordStrength >= 4 && 'bg-green-600 w-full',
              ]"
            />
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Use 8+ chars with numbers, symbols, uppercase letters
          </p>
        </div>

        <div class="flex justify-end mt-4">
          <button class="btn-danger" @click="savePassword">Change Password</button>
        </div>
      </section>

      <!-- ================= APP VERSION (BOTTOM) ================= -->
      <div class="pt-8 text-center text-xs text-slate-400 border-t">
        Application version {{ settings.appVersion }}
      </div>
    </div>
  </AdminLayouts>
</template>
