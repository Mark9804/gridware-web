import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/GridWareHome.vue'),
  },
  {
    path: '/convert',
    name: 'Convert',
    children: [
      {
        path: 'to-gridware',
        name: 'ConvertToGridwareFormat',
        component: () =>
          import('../components/convert/ConvertToGridwareFormat.vue'),
      },
      {
        path: 'from-gridware',
        name: 'ConvertFromGridwareFormat',
        component: () =>
          import('../components/convert/ConvertFromGridwareFormat.vue'),
      },
    ],
  },
  {
    path: '/analyze',
    name: 'Analyze',
    component: () => import('../components/analyze/AnalyzeHome.vue'),
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
