<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Loading from '@/widgets/Loading.vue'

const authStore = useAuthStore()

const student = reactive({
  last_name: '',
  first_name: '',
  user_name: '',
  email: '',
  date_of_birth: '',
  gender: '',
  address: '',
  phone_number: '',
  phone_parent: '',
  major: '',
  level: '',
  year: '',
  id_card: '',
  bio: '',
  profile_photo_path: null as File | null,
})

watch(
  () => authStore.current_use,
  (newFile) => {
    if (newFile) {
      student.last_name = newFile.last_name || ''
      student.first_name = newFile.first_name || ''
      student.user_name = newFile.user_name || ''
      student.email = newFile.email || ''
      student.date_of_birth = newFile.info?.date_of_birth || ''
      student.gender = newFile.gender || ''
      student.address = newFile.info?.address || ''
      student.phone_number = newFile.phone_number || ''
      student.phone_parent = newFile.info?.phone_parent || ''
      student.major = newFile.info?.major || ''
      student.level = newFile.info?.level || ''
      student.year = newFile.info?.year || ''
      student.id_card = newFile.info?.id_card || ''
      student.bio = newFile.bio || ''
    }
  },
)

// check data for update
const hasChanges = computed(() => {
  const u = authStore.current_use
  return (
    student.last_name !== u?.last_name ||
    student.first_name !== u?.first_name ||
    student.user_name !== u?.user_name ||
    student.email !== u?.email ||
    student.date_of_birth !== u?.info?.date_of_birth ||
    student.gender !== u?.gender ||
    student.address !== u?.info?.address ||
    student.phone_number !== u?.phone_number ||
    student.phone_parent !== u?.info?.phone_parent ||
    student.major !== u?.info?.major ||
    student.level !== u?.info?.level ||
    student.year !== u?.info?.year ||
    student.id_card !== u?.info?.id_card ||
    student.bio !== u?.bio ||
    student.profile_photo_path !== null
  )
})

const previewImage = ref<string | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    student.profile_photo_path = target.files[0]
    previewImage.value = URL.createObjectURL(target.files[0])
  }
}

function updateProfile() {
  // console.log('Updated student info:', student)
  // alert('ព័ត៌មានបានរក្សាទុក!')
  // -------------
  authStore.changeInfoUser(student)
}

function resetForm() {
  Object.keys(student).forEach((key) => {
    ;(student[key as keyof typeof student] as any) = ''
  })
  student.profile_photo_path = null
  previewImage.value = null
}

onMounted(() => {
  student.last_name = authStore.current_use?.last_name || ''
  student.first_name = authStore.current_use?.first_name || ''
  student.user_name = authStore.current_use?.user_name || ''
  student.email = authStore.current_use?.email || ''
  student.date_of_birth = authStore.current_use?.info?.date_of_birth || ''
  student.gender = authStore.current_use?.gender || ''
  student.address = authStore.current_use?.info?.address || ''
  student.phone_number = authStore.current_use?.phone_number || ''
  student.phone_parent = authStore.current_use?.info?.phone_parent || ''
  student.major = authStore.current_use?.info?.major || ''
  student.level = authStore.current_use?.info?.level || ''
  student.year = authStore.current_use?.info?.year || ''
  student.id_card = authStore.current_use?.info?.id_card || ''
  student.bio = authStore.current_use?.bio || ''
  authStore.successMessage = ''
})
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg w-full font-hanuman"
  >
    <h1 class="font-Kantumruy text-xl font-medium p-4">ប្រវត្តិរូបរបស់ខ្ញុំ</h1>
    <hr class="w-full text-slate-300 dark:text-slate-500" />

    <div class="p-4">
      <p
        v-if="authStore.successMessage"
        class="px-3 py-2 font-medium bg-green-700/20 text-green-600 rounded-md font-Kantumruy"
      >
        {{ authStore.successMessage }}
      </p>
    </div>
    <form class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="updateProfile">
      <!-- ================= Profile Picture 4x6 ================= -->
      <div class="md:col-span-2 flex gap-6 items-start">
        <!-- Preview -->
        <div
          class="w-[120px] h-[180px] border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-md overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-700"
        >
          <img
            v-if="previewImage"
            :src="previewImage"
            alt="Profile"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-xs text-slate-400 text-center"> 4 x 6<br />Photo </span>
        </div>

        <!-- Upload -->
        <div class="flex-1">
          <label class="block mb-1 font-medium font-hanuman"> រូបថតសិស្ស (4x6) </label>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="w-full p-2.5 border rounded font-Kantumruy border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p class="text-xs text-slate-500 mt-1">* សូមបញ្ចូលរូបថតទំហំ 4x6 (ផ្ទៃមុខច្បាស់)</p>
        </div>
      </div>

      <!-- Last Name -->
      <div>
        <label class="block mb-1 font-medium">នាមត្រកូល</label>
        <input v-model="student.last_name" type="text" class="input py-2.5" />
      </div>

      <!-- First Name -->
      <div>
        <label class="block mb-1 font-medium">នាមខ្លួន</label>
        <input v-model="student.first_name" type="text" class="input py-2.5" />
      </div>

      <!-- Username -->
      <div>
        <label class="block mb-1 font-medium">ឈ្មោះអ្នកប្រើប្រាស់</label>
        <input v-model="student.user_name" type="text" class="input py-2.5" />
      </div>

      <!-- Email -->
      <div>
        <label class="block mb-1 font-medium">អ៊ីមែល</label>
        <input v-model="student.email" type="email" class="input py-2.5" />
      </div>

      <!-- DOB -->
      <div>
        <label class="block mb-1 font-medium">ថ្ងៃខែឆ្នាំកំណើត</label>
        <input v-model="student.date_of_birth" type="date" class="input py-2.5" />
      </div>

      <!-- Gender -->
      <div>
        <label class="block mb-1 font-medium">ភេទ</label>
        <select
          v-model="student.gender"
          class="border w-full p-2 rounded dark:border-slate-600 dark:bg-slate-700 border-slate-300 bg-slate-50 font-hanuman"
        >
          <option :value="student.gender ?? ''">{{ student.gender ?? 'ជ្រើសរើសភេទ' }}</option>
          <option value="male">ប្រុស</option>
          <option value="female">ស្រី</option>
        </select>
      </div>

      <!-- Address -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">អាសយដ្ឋាន</label>
        <input v-model="student.address" type="text" class="input py-2.5" />
      </div>

      <!-- Phone -->
      <div>
        <label class="block mb-1 font-medium">លេខទូរស័ព្ទ</label>
        <input v-model="student.phone_number" type="tel" class="input py-2.5" />
      </div>

      <!-- Parent Phone -->
      <div>
        <label class="block mb-1 font-medium">លេខទូរស័ព្ទមាតាបិតា</label>
        <input v-model="student.phone_parent" type="tel" class="input py-2.5" />
      </div>

      <!-- Major -->
      <div>
        <label class="block mb-1 font-medium">ជំនាញ</label>
        <input v-model="student.major" type="text" class="input py-2.5" />
      </div>

      <!-- Level -->
      <div>
        <label class="block mb-1 font-medium">ថ្នាក់</label>
        <input v-model="student.level" type="text" class="input py-2.5" />
      </div>

      <!-- Year -->
      <div>
        <label class="block mb-1 font-medium">ឆ្នាំសិក្សា</label>
        <input v-model="student.year" type="number" class="input py-2.5" />
      </div>

      <!-- Student ID -->
      <div>
        <label class="block mb-1 font-medium">លេខសម្គាល់សិស្ស</label>
        <input v-model="student.id_card" type="text" class="input py-2.5" />
      </div>

      <!-- Notes -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">សម្គាល់ / កំណត់សំគាល់</label>
        <textarea v-model="student.bio" rows="3" class="input py-2.5"></textarea>
      </div>

      <!-- Buttons -->
      <div class="md:col-span-2 flex justify-end gap-4 mt-4">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 hidden max-lg:block"
        >
          ចាក់សោ
        </button>
        <button
          :disabled="authStore.isLoading || !hasChanges"
          type="submit"
          class="px-4 py-2 disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed rounded bg-green-600 text-white hover:bg-green-700"
        >
          <span
            v-if="authStore.isLoading"
            class="flex justify-center items-center gap-2 font-poppins"
            ><div class="w-5 h-5"><loading /></div>
            Loading...</span
          >

          <span v-else class="font-Kantumruy">រក្សាទុក</span>
        </button>
      </div>
    </form>
  </div>
</template>
