<script setup lang="ts">
import { useBuildStore } from '@/stores/build_store'
import { CloseIcon } from '@/stores/Icons'
import InputTextField from '@/widgets/InputTextField.vue'
import Loading from '@/widgets/Loading.vue'
import { Building, DoorOpenIcon, Layers2Icon, SaveIcon } from '@lucide/vue'
const buildStore = useBuildStore()

const validate = () => {
  buildStore.isMessagError.name = ''
  buildStore.isMessagError.gender = ''
  buildStore.isMessagError.floor = ''
  buildStore.isMessagError.room = ''

  if (!buildStore.formData.name) {
    buildStore.isMessagError.name = 'Please required now!'
    return false
  }

  if (!buildStore.formData.floor) {
    buildStore.isMessagError.floor = 'Please required now!'
    return false
  }

  if (!buildStore.formData.gender) {
    buildStore.isMessagError.gender = 'Please required now!'
    return false
  }

  return true
}

const handleCreateBuilding = () => {
  if (!validate()) {
    return
  }

  buildStore.createBuilding(
    buildStore.formData.name,
    buildStore.formData.gender,
    Number(buildStore.formData.floor),
    Number(buildStore.formData.room),
  )
}
</script>

<template>
  <div
    class="top-0 left-0 bottom-0 right-0 p-4 fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-xl w-full max-w-xl shadow-lg relative overflow-clip border dark:border-slate-500 border-slate-300"
      @click.stop
    >
      <div class="w-full flex justify-between items-center p-4">
        <!-- Block -->
        <button
          @click="$emit('close')"
          class="px-4 py-1 rounded-bl-lg border border-t-0 drop-shadow-2xl cursor-pointer border-warning bg-red-500 text-white hover:bg-red-600 absolute right-0 top-0"
        >
          <component :is="CloseIcon" />
        </button>

        <h1 class="font-Kantumruy text-lg font-medium text-slate-600 dark:text-slate-300">
          Create Building
        </h1>
      </div>
      <hr class="text-slate-300 dark:text-slate-500" />
      <!-- Icon -->
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

            <!-- end name -->
            <!-- ------------- -->
            <div class="w-full">
              <label class="font-Kantumruy text-slate-600 dark:text-slate-300">
                Gender<span class="text-red-600">*</span>
              </label>
              <div class="mt-1">
                <select
                  v-model="buildStore.formData.gender"
                  class="w-full p-2 border rounded-md capitalize focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  :class="{
                    'border-red-500 bg-red-500/10': buildStore.isMessagError.gender,
                    'border-slate-200 dark:border-slate-500 bg-slate-50 font-Kantumruy dark:bg-slate-800':
                      !buildStore.isMessagError.gender,
                  }"
                >
                  <option value="" class="w-full capitalize p-2 font-Kantumruy text-slate-400">
                    Please select option
                  </option>
                  <option value="male" class="w-full capitalize p-2">male</option>
                  <option value="female" class="w-full capitalize p-2">female</option>
                </select>
                <span
                  v-if="buildStore.isMessagError.gender"
                  class="text-red-500 text-xs font-Kantumruy"
                  >{{ buildStore.isMessagError.gender }}</span
                >
              </div>
            </div>

            <input-text-field
              v-model="buildStore.formData.floor"
              :error="buildStore.isMessagError.floor"
              type="number"
              label="Floor"
              required
              placeholder="Enter floor"
            >
              <template #prefix>
                <component :is="Layers2Icon" class="text-slate-400" />
              </template>
            </input-text-field>
            <!--  -->
            <input-text-field
              v-model="buildStore.formData.room"
              :error="buildStore.isMessagError.room"
              type="number"
              label="Room"
              placeholder="Enter room"
            >
              <template #prefix>
                <component :is="DoorOpenIcon" class="text-slate-400" />
              </template>
            </input-text-field>
          </div>
          <div class="w-full flex justify-end mt-4">
            <button
              @click="handleCreateBuilding"
              :disabled="buildStore.isLoadingUpdate"
              class="px-4 py-2 disabled:bg-slate-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white font-Kantumruy rounded-md"
            >
              <div v-if="buildStore.isLoadingUpdate" class="flex justify-center items-center gap-1">
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
    </div>
  </div>
</template>
