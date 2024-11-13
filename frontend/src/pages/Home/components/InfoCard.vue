<template>
  <Transition name="default" mode="out-in" appear>
    <div class="info-card">
      <RouterLink :to="info.link + '/' + info.title" class="info-card-image">
        <img style="height: 100%;" :src="info.image" />
      </RouterLink>
      <div class="info-card-content">
        <h2>
          <RouterLink :to="info.link + '/' + info.title" class="link">{{ info.title }}</RouterLink>
        </h2>
        <div class="info-card-meta">
          <span>{{ info.date }} | </span>
          <span>{{ info.categories }} | </span>
          <span v-for="tag in info.tags" :key="tag" class="tag">&nbsp;-{{ tag }}</span>
        </div>
        <p class="info-card-summary">{{ info.content }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface InfoImpl {
  date: string;        // 发布日期
  tags: string[];       // 标签
  categories: string;   // 分类
  title: string;        // 标题
  content: string;      // 内容
  image: string;        // 图片链接
  link: string;         // 链接
}
defineProps<{ info: InfoImpl }>();
</script>

<style src="./InfoCard.css" scoped></style>
