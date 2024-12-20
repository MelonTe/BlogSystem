<template>
  <div class="article">
    <div class="markdown-body" v-html="renderedText"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { postBlogDetail } from '@/api/requestApi';
import { useRoute } from 'vue-router';
import { MdRender } from '@/utils/mditUtils';
import emitter from '@/utils/mittUtils';
import 'highlight.js/styles/atom-one-dark.css'
import '@/assets/markdown.css'  // markdown样式设置

const route = useRoute();
const renderedText = ref();

onMounted(async () => {
  // markdown文本渲染成html
  let blogDetail: any = await postBlogDetail(route.params.title as string);
  renderedText.value = MdRender(blogDetail.Content, "markdown");

  delete blogDetail.Content;
  console.log(blogDetail);

  nextTick(() => {
    emitter.emit('ArticleLoaded'); // 通知ArticleOutline
    emitter.emit('TitleLoaded', blogDetail); // 通知ArticleTitle
  })
})
</script>

<style scoped>
.article {
  background-color: #ffffff;
  padding: 10px;
  margin: 0;
  border: 1px solid #0c00002a;
  border-radius: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>