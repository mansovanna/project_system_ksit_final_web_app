<script setup lang="ts">
import { CallIcon, CloseIcon, EmailIcon } from '@/stores/Icons'
import { useStaffStore } from '@/stores/staffStore'
import InputTextField from '@/widgets/InputTextField.vue'
import Loading from '@/widgets/Loading.vue'
import { EyeIcon, EyeOffIcon, LockKeyholeIcon, NotebookPenIcon, Save, User2Icon } from '@lucide/vue'

const staffStore = useStaffStore()

const submitForm = () => {
  // Reset errors
  staffStore.isMessageError = {
    username: '',
    email: '',
    bio: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  }

  let isValid = true

  /* Username */
  if (!staffStore.formData.username) {
    staffStore.isMessageError.username = 'Username is required'
    isValid = false
  } else if (staffStore.formData.username.length < 3) {
    staffStore.isMessageError.username = 'Username must be at least 3 characters'
    isValid = false
  }

  /* Email */
  if (!staffStore.formData.email) {
    staffStore.isMessageError.email = 'Email is required'
    isValid = false
  } else if (staffStore.formData.email.length < 5) {
    staffStore.isMessageError.email = 'Email must be at least 5 characters'
    isValid = false
  }

  /* Phone */
  if (!staffStore.formData.phone_number) {
    staffStore.isMessageError.phone_number = 'Phone is required'
    isValid = false
  } else if (staffStore.formData.phone_number.length < 8) {
    staffStore.isMessageError.phone_number = 'Phone must be at least 8 characters'
    isValid = false
  }

  /* Password */
  if (!staffStore.formData.password) {
    staffStore.isMessageError.password = 'Password is required'
    isValid = false
  } else if (staffStore.formData.password.length < 6) {
    staffStore.isMessageError.password = 'Password must be at least 6 characters'
    isValid = false
  }

  /* Confirm Password */
  if (!staffStore.formData.confirm_password) {
    staffStore.isMessageError.confirm_password = 'Confirm Password is required'
    isValid = false
  } else if (staffStore.formData.password !== staffStore.formData.confirm_password) {
    staffStore.isMessageError.confirm_password = 'Passwords do not match'
    isValid = false
  }

  if (!isValid) return

  staffStore.store_staff({
    user_name: staffStore.formData.username,
    email: staffStore.formData.email,
    bio: staffStore.formData.bio,
    phone_number: staffStore.formData.phone_number,
    password: staffStore.formData.password,
    password_confirmation: staffStore.formData.confirm_password,
  })
}
</script>

<template>
  <div
    class="top-0 left-0 right-0 bottom-0 fixed bg-black/20 dark:bg-black/50 flex justify-center items-center z-50 p-4"
    @click="staffStore.handleCrate"
  >
    <Transition name="bounce">
      <div
        v-if="staffStore.isShowCreate"
        class="w-1/2 max-md:w-full bg-white dark:bg-gray-800 shadow rounded-lg relative"
        @click.stop
      >
        <!-- isLoading -->

        <div
          v-if="staffStore.isLoadingCreate"
          class="absolute top-0 right-0 bottom-0 left-0 bg-slate-50/70 p-3 dark:bg-slate-900/70 flex flex-col gap-2 font-Kantumruy justify-center items-center z-50"
        >
          <div class="w-10 h-10">
            <Loading />
          </div>
        </div>
        <!-- End isLoading -->
        <!-- Header -->
        <div class="flex justify-between items-center p-4">
          <h1 class="font-Kantumruy text-lg font-medium text-slate-600 dark:text-slate-300">
            Create Staff
          </h1>

          <button
            @click="staffStore.handleCrate"
            class="w-8 h-8 bg-red-400 text-white flex justify-center items-center rounded-full hover:bg-red-500"
          >
            <component :is="CloseIcon" />
          </button>
        </div>

        <hr class="text-slate-300" />

        <!-- Form -->
        <form @submit.prevent="submitForm">
          <div class="px-4 py-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Username -->

              <InputTextField
                v-model="staffStore.formData.username"
                :error="staffStore.isMessageError.username"
                label="User Name"
                placeholder="Enter username"
                :required="true"
              >
                <template #prefix>
                  <component :is="User2Icon" class="w-6 h-6" />
                </template>
              </InputTextField>

              <!-- End Username -->

              <!-- Email -->
              <InputTextField
                v-model="staffStore.formData.email"
                :error="staffStore.isMessageError.email"
                type="email"
                label="Email"
                placeholder="Enter email"
                :required="true"
              >
                <template #prefix>
                  <component :is="EmailIcon" class="w-6 h-6" />
                </template>
              </InputTextField>

              <!-- End Email -->

              <!-- Phone -->

              <InputTextField
                v-model="staffStore.formData.phone_number"
                :error="staffStore.isMessageError.phone_number"
                type="number"
                label="Phone Number"
                placeholder="Enter phone number"
                :required="true"
              >
                <template #prefix>
                  <component :is="CallIcon" class="w-6 h-6" />
                </template>
              </InputTextField>

              <!-- End Phone -->

              <!-- Bio -->

              <InputTextField
                v-model="staffStore.formData.bio"
                :error="staffStore.isMessageError.bio"
                type="text"
                label="Bio"
                placeholder="Enter bio"
              >
                <template #prefix>
                  <component :is="NotebookPenIcon" class="w-6 h-6" />
                </template>
              </InputTextField>

              <!-- End Bio -->

              <!-- Password -->
              <InputTextField
                v-model="staffStore.formData.password"
                :error="staffStore.isMessageError.password"
                :type="staffStore.formData.is_active ? 'text' : 'password'"
                label="Password"
                placeholder="Enter password"
                :required="true"
              >
                <template #prefix>
                  <component :is="LockKeyholeIcon" class="w-6 h-6" />
                </template>

                <template #suffix>
                  <button
                    type="button"
                    @click="staffStore.formData.is_active = !staffStore.formData.is_active"
                    class="p-2"
                  >
                    <component :is="staffStore.formData.is_active ? EyeIcon : EyeOffIcon" />
                  </button>
                </template>
              </InputTextField>

              <!-- End Password -->

              <!-- Confirm Password -->

              <InputTextField
                v-model="staffStore.formData.confirm_password"
                :error="staffStore.isMessageError.confirm_password"
                :type="staffStore.formData.is_active ? 'text' : 'password'"
                label="Confirm Password"
                placeholder="Enter confirm password"
                :required="true"
              >
                <template #prefix>
                  <component :is="LockKeyholeIcon" class="w-6 h-6" />
                </template>

                <template #suffix>
                  <button
                    type="button"
                    @click="staffStore.formData.is_active = !staffStore.formData.is_active"
                    class="p-2"
                  >
                    <component :is="staffStore.formData.is_active ? EyeIcon : EyeOffIcon" />
                  </button>
                </template>
              </InputTextField>
            </div>

            <!-- Submit -->
            <div class="flex justify-end mt-4">
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center gap-2"
              >
                <component :is="Save" />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* .input {
  @apply px-4 py-2 border border-slate-400 rounded mt-2
  focus:outline-none focus:border-blue-400
  focus:ring-4 focus:ring-blue-200;
}

.error {
  @apply text-red-500 text-sm mt-1;
} */

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
