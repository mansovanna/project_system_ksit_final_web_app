import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
    isDarkMode: localStorage.getItem('theme-mode') || 'light',
    isMenuApp: false,
  }),

  actions: {
    // analytics menu student
    toggleApp() {
      this.isMenuApp = !this.isMenuApp
    },
    // analytics dark mode
    initializer() {
      if (
        localStorage.getItem('theme-mode') === 'dark' ||
        (!('theme-mode' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme-mode', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme-mode', 'light')
      }
    },

    themDarkMode() {
      this.isDarkMode = this.isDarkMode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme-mode', this.isDarkMode)
      this.initializer()
    },
  },
})
