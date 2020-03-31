import {defineConfig} from 'umi'

export default defineConfig({
  history: {
    type: 'memory',
    options: {
      initialEntries: ['/'],
    },
  },
  mountElementId: '',
  routes: [
    {path: '/', component: './index'},
    {
      path: '/user',
      component: './index',
      routes: [
        {path: 'detail', component: './index'},
      ],
    },
  ],
})
