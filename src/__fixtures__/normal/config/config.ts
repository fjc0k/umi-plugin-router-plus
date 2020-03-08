import {defineConfig} from 'umi'
import {defineConfig as defineRouterPlusConfig} from '../../../'

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
    {path: '/user/:id', component: './index'},
    {path: '/post/:id__n', component: './index'},
    {path: '/search/:type__user_post/:all__b/:page__n', component: './index'},
    {
      path: '/setting',
      component: './index',
      routes: [
        {path: 'index', component: './index'},
        {path: '$id.$page.html', component: './index'},
      ],
    },
  ],
  ...defineRouterPlusConfig({
    transformDollarSignToColonOnRoutePaths: true,
  }),
})
