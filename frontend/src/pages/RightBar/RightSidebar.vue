<template>
    <div ref="rightbar" class="rightsidebar sticky">
        <UserProfile class="baritem" />
        <Announce class="baritem" />
        <ArticleOutline class="baritem" v-if="$route.path.startsWith('/article')" :headLevel=4 />
    </div>
</template>

<script setup lang="ts">
import Announce from '@/pages/RightBar/components/Announce.vue';
import UserProfile from '@/pages/RightBar/components/UserProfile.vue';
import ArticleOutline from './components/ArticleOutline.vue';
</script>

<style scoped>
.rightsidebar {
    overflow-x: hidden;
}

.baritem {
    overflow: hidden;
    margin-bottom: 1vh;
}

.sticky {
    position: -webkit-sticky;
    position: sticky;
    top: -400px;
    z-index: 1;
}
</style>
