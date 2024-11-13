import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home/Home.vue";
import Test1 from "@/pages/Tags.vue";
import Test2 from "@/pages/About.vue";
import HomeTitle from "@/pages/Home/HomeTitle.vue";
import RightSidebar from "@/pages/RightBar/RightSidebar.vue";
import PagesTitle from "@/components/PagesTitle.vue";
import Login from "@/pages/Login.vue";
import Article from "@/pages/Article/Article.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      components: {
        default: Home,
        title: HomeTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      path: "/home",
      redirect: "/",
    },
    {
      name: "tags",
      path: "/tags",
      components: {
        default: Test1,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "about",
      path: "/about",
      components: {
        default: Test2,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "login",
      path: "/login",
      components: {
        default: Login,
        title: PagesTitle,
      },
    },
    {
      name: "article",
      path: "/article/:title",
      components: {
        default: Article,
        title: PagesTitle,
        rightsidebar: RightSidebar,
      },
    }
  ],
});

export default router;
