<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
//------------------------------------
</script>
<template>
  <div
    @click.stop
    class="w-64 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg absolute top-16 right-6 overflow-clip"
  >
    <div class="w-full h-18 px-4 py-1.5">
      <div>
        <h1>J-Jonh San</h1>
        <p class="w-full text-slate-400 text-sm">Admin Profile Component</p>
      </div>
    </div>
    <hr class="text-slate-200" />

    <!-- ---------------------- -->

    <div class="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
      <h1>View Profile</h1>
    </div>
    <div class="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
      <h1>Settings</h1>
    </div>
    <hr class="text-slate-200" />
    <div class="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
      <h1>Logout</h1>
    </div>
  </div>
</template>
