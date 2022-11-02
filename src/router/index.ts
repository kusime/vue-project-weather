import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import CityPage from "@/views/CityPage.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainPage,
    },

    {
      path: "/weather/:city/:country",
      name: "cityPage",
      component: CityPage,
    },
  ],
});

export default router;
