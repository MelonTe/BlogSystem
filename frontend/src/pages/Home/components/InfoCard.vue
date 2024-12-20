<template>
  <Transition name="default" mode="out-in" appear>
    <div class="info-card">

      <RouterLink :to="'/article/' + infos.Title" class="info-card-image">
        <img style="height: 100%;" :src="infos.image" />
      </RouterLink>

      <div class="info-card-content">
        <h2>
          <RouterLink :to="'/article/' + infos.Title" class="link">{{ infos.Title }}</RouterLink>
        </h2>
        <div class="info-card-meta">
          <span>更新时间：{{ infos.UpdatedAt }}</span>
        </div>
        <div class="info-card-meta">
          <span>标签：</span>
          <span v-for="tag in infos.tag" :key="tag" class="tag">&nbsp;-{{ tag }}</span>
        </div>
        <p class="info-card-summary">{{ infos.Content }}</p>

        <!-- 登陆后的操作 -->
        <div class="login-operate">
          <button class="operate-button" style="background-color: green;" @click="ModifyBlog">修改</button>
          <button class="operate-button" style="background-color: red;" @click="deleteBlog">删除</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { deleteItem } from '@/api/requestApi';
import { useRouter } from 'vue-router';

interface InfoImpl {
  ID: Number
  Title: string;      // 标题
  CreatedAt: string;  // 发布日期
  UpdatedAt: string;  // 更新日期
  Content: string;    // 内容
  tag: string[];      // 标签
  image: string;
}

const router = useRouter();
const props = defineProps<{ infos: InfoImpl }>();

//修改
const deleteBlog = () => {
  const confirmed = confirm("确定删除该博客？");
  if (confirmed) {
    deleteItem(props.infos.Title);
    router.go(0);
  }
}
const ModifyBlog = () => {
  router.push({
    name:"modify",
    params:{
      blogname:props.infos.Title
    }
  })
}
</script>

<style src="./InfoCard.css" scoped></style>
