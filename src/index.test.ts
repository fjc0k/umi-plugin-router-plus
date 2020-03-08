import {existsSync, readFileSync} from 'fs'
import {join} from 'path'
import {PLUGIN_ID} from './consts'
import {Service} from 'umi'

const fixtures = join(__dirname, '__fixtures__')

test('normal', async () => {
  const cwd = join(fixtures, 'normal')
  const service = new Service({
    cwd: cwd,
    plugins: [require.resolve('./')],
  })
  await service.run({
    name: 'g',
    args: {
      _: ['g', 'tmp'],
    },
  })
  const umiTmp = join(cwd, '.umi-test')
  expect(existsSync(join(umiTmp, PLUGIN_ID, 'exports.ts'))).toBeTruthy()
  expect(existsSync(join(umiTmp, PLUGIN_ID, 'types.ts'))).toBeTruthy()
  expect(readFileSync(join(umiTmp, 'core', 'umiExports.ts'), 'utf8').includes(`export * from '../${PLUGIN_ID}/exports'`)).toBeTruthy()
})
