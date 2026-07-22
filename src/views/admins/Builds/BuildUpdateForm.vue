<script setup lang="ts">
import { useBuildStore } from '@/stores/build_store'
import { CloseIcon } from '@/stores/Icons'
import InputTextField from '@/widgets/InputTextField.vue'
import Loading from '@/widgets/Loading.vue'
import { Building, SaveIcon } from '@lucide/vue'
import { onMounted } from 'vue'

const buildStore = useBuildStore()

const submit = (id: string, name: string, gender: string) => {
  buildStore.isMessagError.name = ''
  buildStore.isMessagError.gender = ''
  if (!name) {
    buildStore.isMessagError.name = 'Please required name!'
  }
  if (!gender) {
    buildStore.isMessagError.gender = 'Please required gender!'
  }
  if (!id) {
    alert('id not found!')
  } else {
    buildStore.buildingUpdate(id, name, gender)
  }
}

onMounted(() => {
  buildStore.isMessagError.name = ''
  buildStore.isMessagError.gender = ''
})
</script>

<template>
  <div
    class="top-0 left-0 bottom-0 right-0 p-4 fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click="buildStore.toggleUpdateClear"
  >
    <div
      class="bg-white dark:bg-slate-700 rounded-xl w-full max-w-xl shadow-lg relative overflow-clip"
      @click.stop
    >
      <div class="w-full flex justify-between items-center p-4">
        <!-- Block -->
        <button
          @click="buildStore.toggleUpdateClear"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>

        <h1 class="font-Kantumruy text-lg font-medium text-slate-600 dark:text-slate-300">
          Update Building
        </h1>
      </div>
      <hr class="text-slate-300 dark:text-slate-500" />
      <!-- Icon -->
      <form
        @submit.prevent="
          submit(
            String(buildStore.formData.id),
            buildStore.formData.name,
            buildStore.formData.gender,
          )
        "
      >
        <div>
          <div class="flex flex-col justify-start items-start gap-3 p-4 w-full">
            <!-- ----------- -->
            <div class="w-full grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <input-text-field
                v-model="buildStore.formData.name"
                :error="buildStore.isMessagError.name"
                label="Name"
                required
                placeholder="Enter name building"
              >
                <template #prefix>
                  <component :is="Building" class="text-slate-400" />
                </template>
              </input-text-field>
              <!-- ------------- -->
              <div class="w-full">
                <span class="font-Kantumruy text-slate-600 dark:text-slate-300">Name</span>
                <div class="mt-1">
                  <select
                    v-model="buildStore.formData.gender"
                    class="w-full capitalize dark:text-slate-300 font-Kantumruy p-2.5 border border-slate-200 dark:border-slate-400 rounded focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  >
                    <option
                      disabled
                      :value="buildStore.formData.gender"
                      class="w-full capitalize p-2"
                    >
                      {{ buildStore.formData.gender }}
                    </option>
                    <option value="male" class="w-full capitalize p-2">male</option>
                    <option value="female" class="w-full capitalize p-2">female</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="w-full flex justify-end mt-4">
              <button
                :disabled="buildStore.isLoadingUpdate"
                class="px-4 py-2 disabled:bg-slate-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white font-Kantumruy rounded-md"
              >
                <div
                  v-if="buildStore.isLoadingUpdate"
                  class="flex justify-center items-center gap-1"
                >
                  <div class="w-5 h-5 flex justify-center items-center gap-1">
                    <component :is="Loading" />
                  </div>
                  <span>Loading...</span>
                </div>
                <div v-else class="flex justify-center items-center gap-1">
                  <component :is="SaveIcon" />
                  <span>Save</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
