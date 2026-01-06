import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'btn': 'px-4 py-2 rounded cursor-pointer transition-colors',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
    'input-base': 'w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
  }
})
