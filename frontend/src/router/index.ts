import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home/Home.vue";
import Test2 from "@/pages/About/About.vue";
import HomeTitle from "@/pages/Home/HomeTitle.vue";
import RightSidebar from "@/pages/RightBar/RightSidebar.vue";
import PagesTitle from "@/components/PagesTitle.vue";
import Login from "@/pages/Login/Login.vue";
import Article from "@/pages/Article/Article.vue";
import Tags from "@/pages/Tags/Tags.vue";
import ArticleTitle from "@/pages/Article/ArticleTitle.vue";
import { getToken } from "@/stores/tokenUtils";
import { ElMessage } from "element-plus";
import ModifyBlog from "@/pages/ModifyBlog/ModifyBlog.vue";
import UploadBlog from "@/pages/UploadBlog/UploadBlog.vue";

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
        default: Tags,
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
        title: ArticleTitle,
        rightsidebar: RightSidebar,
      },
    },
    {
      name: "modify",
      path: "/modify/:blogname",
      components: {
        default: ModifyBlog,
        title: PagesTitle,
      },
    },
    {
      name: "upload",
      path: "/upload",
      components: {
        default: UploadBlog,
        title: PagesTitle,
      },
    },
  ],
});

//全局前置路由守卫
router.beforeEach((to, from, next) => {
  if (to.name === "login") {
    const token = getToken();

    if (token) {
      ElMessage.error("已经登录");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
