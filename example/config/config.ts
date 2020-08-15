import { defineConfig } from 'umi'
import { join } from 'path'

export default defineConfig({
  history: {
    type: 'hash',
  },
  devServer: {
    port: 4589,
  },
  plugins: [join(__dirname, '../../lib/index.js')],
  // exportStatic: {
  //   htmlSuffix: true,
  //   dynamicRoot: true,
  // },
})
