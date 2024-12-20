<template>
    <div ref="titleContainer" class="title">
        <br><br>
        <h1 class="titleText"><strong>{{ title }}</strong></h1>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, onUpdated } from 'vue';

const title = ref('');
const titleContainer = ref<HTMLElement | null>(null);

const titles = [
    { path: '/tags', name: 'Tags-标签' },
    { path: '/about', name: 'About-关于' },
    { path: '/login', name: '管理员登录' },
    { path: '/modify', name: '修改博客内容' },
    { path: '/upload', name: '上传博客' },
];

const titleChange = () => {
    for (let t of titles)
        if (useRoute().path === t.path)
            title.value = t.name;
};

onMounted(titleChange);
onUpdated(titleChange);

</script>

<style scoped>
.title {
    display: flex;
    height: 30vh;
    margin: 0;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    caret-color: transparent;
}

.titleText {
    text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.6);
    color: aliceblue;
    margin: 0;
    text-align: center;
    font-size: 40px;
}
</style>