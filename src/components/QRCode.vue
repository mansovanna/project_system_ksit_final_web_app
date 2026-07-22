<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { LogoBakong } from '@/stores/Icons' // your logo URL or import

const qrCanvas = ref<HTMLCanvasElement | null>(null)
const error = ref<string | null>(null)

// Function to generate QR code with logo
const generateQRCode = async (text: string) => {
  try {
    error.value = null
    if (!qrCanvas.value) return

    const canvas = qrCanvas.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1️⃣ Draw QR code
    await QrcodeVue.toCanvas(canvas, text, {
      width: 250,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })

    // 2️⃣ Draw the logo in the center
    const logo = new Image()
    logo.src = LogoBakong // make sure LogoBakong is a URL or base64 string
    logo.onload = () => {
      const logoSize = canvas.width * 0.2 // 20% of QR code width
      const x = (canvas.width - logoSize) / 2
      const y = (canvas.height - logoSize) / 2
      ctx.drawImage(logo, x, y, logoSize, logoSize)
    }
    logo.onerror = () => {
      console.error('Failed to load logo image')
    }
  } catch (err: any) {
    error.value = err.message
    console.error(err)
  }
}

// Props
const props = defineProps<{
  qrString: any
  userName: string
  amount: number
  is_currency: string
}>()

// Generate QR on mount
// onMounted(() => {
//   generateQRCode(props.qrString)
// })

// Regenerate QR if prop changes
// watch(
//   () => props.qrString,
//   (newVal: string) => {
//     generateQRCode(newVal)
//   },
// )
</script>

<template>
  <div class="flex flex-col justify-start items-center">
    <div
      class="flex flex-col items-start gap-4 border rounded-xl dark:border-slate-500 border-slate-200 overflow-clip"
    >
      <div
        class="w-full bg-red-500 text-white text-center py-2 font-Kantumruy text-lg rounded-tl-xl"
      >
        <p class="font-bold">BAKONG QR</p>
      </div>
      <!--  -->
      <div class="w-full px-4 leading-none">
        <p class="font-Kantumruy text-left text-base">{{ props.userName }}</p>
        <p class="font-Kantumruy font-bold text-left text-xl uppercase">
          {{ props.amount }} {{ is_currency }}
        </p>
      </div>
      <!--  -->
      <div class="p-4 border-t border-slate-200 w-full">
        <!-- <canvas ref="qrCanvas"></canvas> -->
        <QrcodeVue
          :value="props.qrString"
          :size="220"
          level="H"
          render-as="svg"
          :image-settings="{
            src: LogoBakong,
            width: 36,
            height: 36,
            // boxId: 'aba-logo',
            excavate: true,
          }"
        />
      </div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<style>
canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
