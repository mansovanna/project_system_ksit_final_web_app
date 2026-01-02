<template>
  <div class="w-full h-screen overflow-auto bg-slate-200 dark:bg-dark relative">
    <header class="w-full bg-dark p-4">
      <!-- <title>KSIT-Dormatery</title> -->
    </header>
    <!-- Block headers -->
    <nav class="w-full sticky top-0 z-10 shadow-md">
      <div class="w-full bg-white flex justify-between items-center p-4">
        <div class="flex justify-start items-center gap-2">
          <img
            class="w-12 h-12 rounded-full object-center object-cover border border-gray-300 dark:border-dark"
            src="https://png.pngtree.com/png-vector/20230828/ourmid/pngtree-school-school-houses-flat-flat-icon-vector-illustration-diagram-png-image_6996436.png"
            alt=""
          />
          <!--  -->
          <div>
            <h1 class="font-Kantumruy font-bold text-slate-700">KSIT-Dormatery</h1>
            <p class="text-xs font-Kantumruy text-slate-500">
              System Management for KSIT-Dormatery
            </p>
          </div>
        </div>
        <div class="flex justify-end items-center gap-6">
          <!--  -->
          <ul class="font-Kantumruy flex justify-center items-center gap-6 text-slate-600">
            <li>Home</li>
            <li>Policy</li>
            <li>Staff</li>
            <li>Leaves</li>
            <li>Staff</li>
            <li>About</li>
            <li>Contact</li>
          </ul>

          <!--  -->
          <div>
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-Kantumruy"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>
