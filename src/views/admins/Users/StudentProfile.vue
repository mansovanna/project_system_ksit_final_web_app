<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import TableLeave from './TableLeave.vue'
import TableStays from './TableStays.vue'
import TablePayments from './TablePayments.vue'

import { useStaffStore } from '@/stores/staffStore'
import { ArrowSmallUpIcon, ArrowBackIcon, CloseIcon, CameraIcon, LockIcon } from '@/stores/Icons'
import { ref } from 'vue'

const staffStore = useStaffStore()

const isShowResetPassword = ref()

const resetPassword = () => {
  isShowResetPassword.value = !isShowResetPassword.value
}
</script>
<template>
  <!-- Block Reset password for staff by admin -->
  <div
    class="fixed w-full h-screen flex justify-center items-center bg-black/30 z-50"
    @click="resetPassword"
    v-if="isShowResetPassword"
  >
    <div class="w-full max-w-1/3 bg-white p-6 rounded-md shadow-2xl relative" @click.stop>
      <div class="absolute right-2 top-2">
        <button
          class="p-1 bg-red-500 text-white rounded-full hover:bg-red-400 cursor-pointer"
          @click="resetPassword"
        >
          <component :is="CloseIcon" />
        </button>
      </div>
      <p class="font-Kantumruy text-red-500">Reset Password</p>
      <div class="mt-2 flex relative">
        <input
          type="text"
          class="w-full p-2 bg-slate-100 rounded focus:outline-0 focus:ring-blue-400 focus:ring-2 font-Kantumruy"
          placeholder="Create New Password"
        />
        <button
          class="font-Kantumruy px-4 bg-blue-600 text-white rounded-r absolute top-0 bottom-0 right-0 hover:bg-blue-500 cursor-pointer focus:ring-2 focus:ring-blue-400"
        >
          Save
        </button>
      </div>
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
        <div class="w-full flex justify-between gap-2 mt-4">
          <!--  -->
          <div class="w-1/2 flex flex-col justify-start items-start">
            <div class="relative">
              <img
                class="w-40 h-40 border-3 border-slate-400 rounded-full object-center object-cover"
                src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt=""
              />
              <button
                class="bg-blue-600 text-white rounded-full w-9 h-9 flex justify-center items-center absolute bottom-0 right-5 border-3 border-white hover:bg-blue-500 cursor-pointer"
              >
                <component :is="CameraIcon" />
              </button>
            </div>
            <div class="mt-4">
              <p class="font-Kantumruy font-medium">Sovanna Dara</p>
              <p class="font-Kantumruy text-slate-400 text-xs">sovannadara@gmail.com</p>
              <!-- Block status -->
              <div class="mt-6 flex flex-col justify-start items-start gap-2">
                <button
                  @click="resetPassword"
                  class="flex justify-start items-center gap-1.5 cursor-pointer text-red-600 text-base hover:underline"
                >
                  <component :is="LockIcon" />
                  <span class="font-Kantumruy">Reset Password</span>
                </button>
                <!-- <button
                  class="flex justify-start items-center gap-1.5 cursor-pointer text-red-600 text-base hover:underline"
                >
                  <component :is="UserFillIcon" />
                  <span class="font-Kantumruy">Block</span>
                </button> -->
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
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    value="Sovann"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">Last Name</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    value="Dara"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">User Name</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    value="Sovanna Dara"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">Date of Birth</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    value="30-06-2025"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">Phone</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    value="+855 969009524"
                  />
                </div>
              </div>
              <div>
                <span class="text-xs font-Kantumruy text-slate-400">Phone Parent</span>
                <div class="mt-0.5">
                  <input
                    type="text"
                    class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                    value="+855 969009524"
                  />
                </div>
              </div>

              <div class="mt-2">
                <span class="text-xs font-Kantumruy text-slate-400">Level</span>
                <div class="mt-0.5">
                  <select
                    name="level"
                    id=""
                    class="w-full bg-slate-100 p-2 rounded font-Kantumruy font-medium text-slate-500"
                  >
                    <option value="staff">បរិញ្ញាប័ត្រ</option>
                    <option value="staff">បរិញ្ញាប័ត្ររង</option>
                  </select>
                </div>
              </div>

              <div class="mt-2">
                <span class="text-xs font-Kantumruy text-slate-400">Level</span>
                <div class="mt-0.5">
                  <select
                    name="level"
                    id=""
                    class="w-full bg-slate-100 p-2 rounded font-Kantumruy font-medium text-slate-500"
                  >
                    <option value="staff">Computer</option>
                    <option value="staff">Food</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <span class="text-xs font-Kantumruy text-slate-400">Address</span>
              <div class="mt-0.5">
                <input
                  type="text"
                  class="bg-slate-300/20 p-2 font-Kantumruy font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded w-full"
                  value="kampong Chnange, Kampong Leng"
                />
              </div>
            </div>

            <div class="w-full flex justify-end itens-center py-2 mt-6">
              <button
                class="px-6 py-2 text-white rounded-md font-Kantumruy bg-blue-700 hover:bg-blue-600 cursor-pointer"
              >
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--  -->

      <TableLeave />
      <TableStays />
      <TablePayments />
    </div>
  </AdminLayouts>
</template>
