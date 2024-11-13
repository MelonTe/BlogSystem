<template>
    <div class="outline">
        <div class="header">
            <h1 class="icon">≡</h1>
            <h3>目录</h3>
        </div>

        <ul ref="outlinediv">
            <li v-for="item in outline" :key="item.id" :style="{ marginLeft: `${(item.level - 1) * 1}vw` }"
                @click="scrollTo(item.id)" :data-id="item.id">
                <Transition name="fade">
                    <div class="li-text" :class="{ active: activeId === item.id }"
                        v-show="item.level === 1 || activeHeaders.slice(0, item.level).includes(item.parentHeader)">
                        <span class="icon">{{ item.pre }}</span>
                        <p class="text">{{ item.text }}</p>
                    </div>
                </Transition>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const { headLevel } = defineProps<{ headLevel: number }>();

onMounted(() => {
    getArticleOutline();
    window.addEventListener('scroll', onScroll);
});

const activeHeaders = ref<string[]>(Array(headLevel + 1).fill(''));
const activeId = ref<string>('');
const outlinediv = ref<HTMLElement | null>(null);
let headers: HTMLElement[] = [];

// 获取文章大纲目录
interface OutlineItem {
    level: number;
    text: string;
    id: string;
    parentHeader: string;
    pre: string;
}
const outline = ref<OutlineItem[]>([]);
function getArticleOutline() {
    const selectors = ['h1.markdown', 'h2.markdown', 'h3.markdown', 'h4.markdown', 'h5.markdown', 'h6.markdown',];
    const checkHeaders = selectors.slice(0, headLevel + 1).join(', ');
    const outlineItems: OutlineItem[] = [];
    const parentHeaders = Array(7).fill('');
    const levelCount = Array(7).fill(0);
    let minHeaderLevel = 6;
    let differ = 0;

    headers = Array.from(document.querySelectorAll(checkHeaders)) as HTMLElement[];

    // 获取h标签基本信息
    headers.forEach(header => {
        const level = parseInt(header.tagName.substring(1));
        const text = header.textContent || '';
        const id = header.id = ++differ + header.id;
        const parentHeader = parentHeaders[level];
        parentHeaders[level + 1] = id;
        outlineItems.push({ level, text, id, parentHeader, pre: "" });
        minHeaderLevel = Math.min(level, minHeaderLevel);
    });

    // 将最大的h改为h1，并写入文本前缀
    const adjustedMinHeaderLevel = minHeaderLevel - 1;
    outlineItems.forEach(obj => {
        obj.level -= adjustedMinHeaderLevel;
        levelCount[obj.level] += 1;
        let levelDetail = "";
        for (let i = 1; i < levelCount.length; i++)
            if (i > obj.level) levelCount[i] = 0;
            else levelDetail += levelCount[i] + '.'
        obj.pre = levelDetail
    });

    outline.value = outlineItems;
}

// 跳转到指定元素
function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView();
    }
}

// 监听页面滚动，设置 activeId
function onScroll() {
    const topHeader = headers.find(header => {
        const rect = header.getBoundingClientRect();
        return rect.top <= 20 && rect.bottom >= 0;
    });

    if (!topHeader || !outline.value) return;

    const activeItem = outline.value.find(item => item.id === topHeader.id);
    if (!activeItem) return;

    let level = activeItem.level
    if (level > headLevel) return;

    activeId.value = topHeader.id;
    activeHeaders.value[level] = topHeader.id;
    for (let i = level+1; i < activeHeaders.value.length; i++)
        activeHeaders.value[i] = '';

    recursion(level, activeItem);
}

// 递归获取父母标题
function recursion(level: number, activeItem: OutlineItem) {
    activeHeaders.value[level - 1] = activeItem?.parentHeader as string;
    if (level > 1)
        recursion(level - 1, outline.value.find(item => item.id === activeItem.parentHeader) as OutlineItem)
}

// 在 activeId 改变时滚动到对应的 li
watch(activeId, (newValue) => {
    if (outlinediv.value) {
        const activeItem = outlinediv.value.querySelector(`li[data-id="${newValue}"]`);
        if (activeItem instanceof HTMLElement) {
            outlinediv.value.scrollTo({
                top: activeItem.offsetTop - outlinediv.value.offsetTop - 40,
                behavior: 'smooth'
            });
        }
    }
});
</script>

<style src="./ArticleOutline.css" scoped></style>