<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import CardBox from '@/components/admin_component/CardBox.vue'

// import LeaveTable from './LeaveTable.vue'
// import StudentTable from './StudentTable.vue'
import { DocumentIcon, UsersIcon, WalletIcon } from '@/stores/Icons'
</script>
<template>
  <AdminLayouts title="Dashboard">
    <div class="p-4 space-y-4">
      <h1 class="font-Kantumruy font-semibold text-slate-400 text-xl mb-4">Dashboard</h1>
      <div
        class="w-full grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3"
      >
        <CardBox title="Student Register" value="0" color="bg-blue-600" iconColor="text-blue-600" />

        <CardBox
          title="All Student"
          value="15"
          color="bg-green-600"
          iconColor="text-green-600"
          :icon="UsersIcon"
        />
        <CardBox
          title="All Staff"
          value="15"
          color="bg-blue-600"
          iconColor="text-blue-600"
          :icon="UsersIcon"
        />
        <CardBox
          title="Request Leaves"
          value="120"
          color="bg-warning"
          iconColor="text-warning"
          :icon="DocumentIcon"
        />
        <CardBox
          title="Payments"
          value="120"
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
