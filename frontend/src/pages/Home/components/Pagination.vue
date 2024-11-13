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

<script setup lang="ts">
import { ref, computed } from 'vue';

// 当前页数
const currentPage = ref<number>(1);
// 总页数
const totalPages = 25;
// 最多显示的页数(保证为奇数，便于将当前页按钮置于中间)
const maxVisiblePages = 10 | 1;

// 计算分页按钮显示的页码范围
const pageNumbers = computed<number[]>(() => {
  let halfVisiblePages = (maxVisiblePages - 1) / 2
  // 确保总页数不越界
  let startPage = Math.max(currentPage.value - halfVisiblePages, 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  // 生成页码数组
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 跳转到指定页
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages) return;
  currentPage.value = page;
};

// 跳转到用户输入的页数
const inputPage = ref<number>(1);
const goToInputPage = () => {
  goToPage(inputPage.value);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.paginator {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.pages {
  display: flex;
  gap: 5px;
}

.page-btn,
.page-input,
.page-input-button {
  height: 2.5em;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #353535;
  color: #bbbbbb;
  box-shadow: inset 0 0px 10px rgba(0, 0, 0, 0.719), 0 2px 5px rgba(0, 0, 0, 0.747);
  transition: all 500ms;
}

.page-btn {
  width: 2.5em;
}

.page-input {
  width: 5em;
}

.page-input-button {
  width: 3em;
}

.page-btn.active,
.page-input-button:active {
  color: #fff;
  text-shadow: 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27), 0 0 20px rgb(255, 224, 27);
}

.page-btn:not(.active):hover,
.input-page button:hover {
  color: #000000;
  line-height: 40px;
  background-color: #f0f0f0;
}
</style>
