import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../components/GridWareHome.vue"),
  },
  {
    path: "/convert",
    name: "Convert",
    description: "",
    children: [
      {
        path: "to-gridware",
        name: "ConvertToGridwareFormat",
      },
      {
        path: "from-gridware",
        name: "ConvertFromGridwareFormat",
      },
    ],
  },
  {
    path: "/analyze",
    name: "Analyze",
    component: () => import("../components/AnalyzeHome.vue"),
  },
];

const routerConvert = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export { routerConvert, routes };
