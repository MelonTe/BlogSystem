

<script setup lang="ts">
import { ref, computed } from 'vue';

// 双向绑定
const currentPage = defineModel<number>("currentPage", { required: true, default: 1 }); // 当前所在页
const totalPages = defineModel<number>("totalPages", { required: true, default: 1 }); // 总页数

// 最多显示的页数(保证为奇数，便于将当前页按钮置于中间)
const maxVisiblePages = 10 | 1;

// 计算分页按钮显示的页码范围
const pageNumbers = computed<number[]>(() => {
  let halfVisiblePages = (maxVisiblePages - 1) / 2
  // 确保总页数不越界
  let startPage = Math.max(currentPage.value - halfVisiblePages, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value);
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  // 生成页码数组
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 跳转到指定页
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 跳转到用户输入的页数
const inputPage = ref<number>(1);
const goToInputPage = () => {
  goToPage(inputPage.value);
};
</script>

<style src="./Pagination.css" scoped />

<template>
  <div class="paginator">
    <div class="pages">
      <button v-for="page in pageNumbers" :key="page" :class="{ 'active': page === currentPage }"
        @click="goToPage(page)" class="page-btn">
        {{ page }}
      </button>
    </div>

    <input type="number" v-model="inputPage" @keyup.enter="goToInputPage" class="page-input" />
    <button @click="goToInputPage" class="page-input-button">跳转</button>
  </div>
</template>