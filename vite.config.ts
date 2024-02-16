import { glob } from 'glob'
import { relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import strip from '@rollup/plugin-strip'

export default defineConfig({
  plugins: [react(), dts({ entryRoot: 'src' })],
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: Object.fromEntries(
        glob.sync('src/**/*.{ts,css}').map(file => [
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          relative(
            'src',
            file.slice(0, file.length - extname(file).length)
          ),
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      name: require("./package.json").name,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [/prosemirror-\S+/, 'react', 'react-dom', 'eventemitter3', 'jsdom'],
      plugins: [strip({
        include: ['**/*.ts'],
        labels: ['debug', 'test'],
      })]
    },
  },
})