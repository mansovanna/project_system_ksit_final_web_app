<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import CardBox from '@/components/admin_component/CardBox.vue'

import { DocumentIcon, UsersIcon, WalletIcon } from '@/stores/Icons'
import { onMounted } from 'vue'
import { useIndexStore } from '@/stores'
import Loading from '@/widgets/Loading.vue'
const indexStore = useIndexStore()

onMounted(() => {
  indexStore.getIndex()
})
</script>
<template>
  <AdminLayouts>
    <div class="p-4 space-y-4">
      <h1 class="font-Kantumruy font-semibold text-slate-400 text-xl mb-4">Dashboard</h1>

      <!-- -------------------- -->
      <div class="w-full flex items-center justify-center" v-if="indexStore.isLoading">
        <div class="w-10 h-10">
          <loading />
        </div>
      </div>
      <div
        v-if="!indexStore.isLoading"
        class="w-full grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3"
      >
        <CardBox
          title="Student Register"
          :value="String(indexStore.data?.data.user_news ?? 0)"
          color="bg-blue-600"
          iconColor="text-blue-600"
        />

        <CardBox
          title="All Student"
          :value="String(indexStore.data?.data.user_olds ?? 0)"
          color="bg-green-600"
          iconColor="text-green-600"
          :icon="UsersIcon"
        />
        <CardBox
          title="All Staff"
          :value="String(indexStore.data?.data.staffs ?? 0)"
          color="bg-blue-600"
          iconColor="text-blue-600"
          :icon="UsersIcon"
        />
        <CardBox
          title="Request Leaves"
          :value="String(indexStore.data?.data.leaves ?? 0)"
          color="bg-warning"
          iconColor="text-warning"
          :icon="DocumentIcon"
        />
        <CardBox
          title="Payments"
          :value="String(indexStore.data?.data.payments ?? 0)"
          color="bg-red-500"
          iconColor="text-red-600"
          :icon="WalletIcon"
        />
      </div>

      <!-- <h1 class="font-Kantumruy font-semibold text-slate-400 text-xl my-2 mt-4">General Data</h1> -->
      <!--  -->

      <!-- Add your admin home content here -->
      <!-- <div class="w-full bg-white shadow rounded-xl overflow-auto">
        <LeaveTable />
      </div> -->

      <!-- <h1 class="font-Kantumruy font-semibold text-slate-400 text-xl my-2 mt-4">
        Students New Register
      </h1> -->
      <!-- Add your admin home content here -->
      <!-- <div class="w-full bg-white shadow rounded-xl overflow-auto">
        <StudentTable />
      </div> -->
    </div>
  </AdminLayouts>
</template>
