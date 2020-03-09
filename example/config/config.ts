import {defineConfig} from 'umi'
import {defineConfig as defineRouterPlusConfig} from '../../lib'
import {join} from 'path'

export default defineConfig({
  plugins: [join(__dirname, '../../lib/index.js')],
  ...defineRouterPlusConfig({
    transformDollarSignToColonOnRoutePaths: true,
  }),
})
