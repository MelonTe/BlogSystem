<template>
  <Header class="header" :items headerName="个人博客"/>

  <div id="titleContainer" ref="titleContainer" class="title-container">

    <RouterView name="title" v-slot="{ Component }" :key="$route.path">
      <KeepAlive>
        <transition name="default" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </KeepAlive>
    </RouterView>
  </div>

  <div ref="contentContainer" class="content-container">
    <RouterView name="default" class="main" v-slot="{ Component }" :key="$route.path">
      <transition name="default" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </RouterView>

    <RouterView name="rightsidebar" class="sidebar" v-slot="{ Component }">
      <transition name="default" mode="out-in" appear>
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>

  <Music/>

  <Footer/>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUpdated, provide, ref } from 'vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Music from './components/MusicPlayer.vue';
import dynamicHeight from '@/hooks/useDynamicHeight';

const contentContainer = ref<HTMLElement | null>(null);
const titleContainer = ref<HTMLElement | null>(null);

const adjustHeight = dynamicHeight(100, titleContainer);

onUpdated(() => {
  nextTick(adjustHeight);
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
});

const items: { icon: string, label: string, route: string }[] = [
  { icon: 'icon-shequ', label: '首页', route: '/home' },
  { icon: 'icon-shequ', label: '标签', route: '/tags' },
  { icon: 'icon-shequ', label: '关于', route: '/about' },
  { icon: 'icon-shequ', label: '管理员登录', route: '/login' },
];

</script>

<style scoped>
.header {
  z-index: 3;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  padding: 30px;
  background-color: rgba(255, 251, 247, 0.95);
  overflow: visible;

  .main {
    width: 48%;
  }

  .sidebar {
    width: 15vw;
  }
}

/* Transition组件切换动效 */
.default-enter-active {
  transition: opacity 1s, transform 1s;
}

.default-enter-from {
  height: 0;
  opacity: 0;
  transform: translateY(30px);
}

.default-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
</style>
