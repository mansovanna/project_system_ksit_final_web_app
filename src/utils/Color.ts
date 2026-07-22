import { reactive } from 'vue'

export const colorOptions = reactive([
  { value: 'blue', bg: 'bg-blue-600', ring: 'ring-blue-700' },
  { value: 'green', bg: 'bg-green-600', ring: 'ring-green-600' },
  { value: 'violet', bg: 'bg-violet-700', ring: 'ring-violet-700' },
  { value: 'rose', bg: 'bg-rose-700', ring: 'ring-rose-700' },
  { value: 'yellow', bg: 'bg-yellow-500', ring: 'ring-yellow-500' },
])

export const colorMap: Record<string, string> = {
  blue: ' bg-gradient-to-r from-blue-800 to-blue-700',
  green: ' bg-gradient-to-r from-green-700 to-green-500',
  violet: ' bg-gradient-to-r from-violet-700 to-violet-500',
  rose: ' bg-gradient-to-r from-rose-700 to-rose-500',
  yellow: ' bg-gradient-to-r from-yellow-600 to-yellow-500',
}

export const themeColor = (color?: string) => {
  return colorMap[color || 'blue'] || 'bg-blue-600'
}
export const themeColorOne = (color?: string) => {
  return colorOptions.find((item) => item.value === color)?.bg || 'bg-blue-600'
}
