<template>
    <Transition name="fade">
        <div class="header" v-show="!isHidden" @mouseover="isOver = true" @mouseleave="isOver = false">
            <div class="text"><strong>{{headerName}}</strong></div>
            <div class="nav" ref="nav" @mouseleave="handleMouseLeave" @mouseenter="handleMouseIn">
                <div class="slide" ref="slide"></div>
                <RouterLink v-for="(item, index) in items" :key="index" :to="item.route" class="nav-item"
                    @mouseover="handleMouseOver(index)">
                    <i :class="['nav-tab-item_icon', 'iconfont', item.icon]"></i>
                    <span class="nav-item-label">{{ item.label }}</span>
                </RouterLink>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
const { items , headerName} = defineProps<{
    items:{ icon: string, label: string, route: string }[],
    headerName:string,
}>();

// 导航栏滑块动效
const nav = ref<HTMLElement | null>(null);
const slide = ref<HTMLElement | null>(null);

const setPosition = (index: number, element: HTMLElement | null) => {
    if (!element || !nav.value) return;
    const li = nav.value.children[index + 1] as HTMLElement; // Skip the first two slides
    const position = li.getBoundingClientRect();
    const width = li.offsetWidth;

    element.style.left = `${position.left}px`;
    element.style.width = `${width}px`;
};

function handleMouseOver(index: number) {
    if (slide.value) {
        setPosition(index, slide.value);
    }
};

function handleMouseLeave() {
    if (slide.value) {
        slide.value.style.opacity = '0';
        slide.value.classList.remove('squeeze');
    }
};

function handleMouseIn() {
    if (slide.value) {
        slide.value.style.opacity = '1';
        slide.value.classList.add('squeeze');
    }
};

// 导航栏根据鼠标滚动显示
let timerID = 0;
const isOver = ref(false);
const isHidden = ref(true);
let lastScrollY = window.scrollY;

function checkOver() {
    timerID = setTimeout(() => {
        if (!isOver.value && window.scrollY!=0)
            isHidden.value = true;
        else
            checkOver()
    }, 3000)
}
const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
        isHidden.value = true;
        clearTimeout(timerID);
    } else if (window.scrollY < lastScrollY) {
        isHidden.value = false;
        clearTimeout(timerID);
        checkOver();
    }

    lastScrollY = window.scrollY;
};

// 挂载后操作
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    nextTick(() => {
        isHidden.value = false;
    })
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

</script>

<style scoped>
* {
    padding: 0;
    margin: 0;
}

.header {
    display: flex;
    background: rgba(50, 50, 50, 0.6);
    position: fixed;
    width: 100vw;
    caret-color: transparent;
    align-items: center;
    padding: 5px, 0, 5px, 0;
    box-shadow: 0px 10px 40px #0000006c;
}

.text {
    padding: 10px;
    margin-right: auto;
    color: #ffffff;
    font-size: 18px;
}

.nav {
    display: flex;
    border-radius: 0.3em;
}

.nav-item {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 15px 0 15px;

    height: 100%;

    text-decoration: none;
    color: #d28636;

    z-index: 3;
}

.nav-tab-item_icon {
    font-size: 20px;
}

.nav-item-label {
    font: 18px;
}

.slide {
    top: 2.5%;
    position: absolute;
    display: inline-block;
    height: 95%;
    border-radius: 10em;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1.05);

    opacity: 0;
    background-color: #bbb073ce;
    z-index: 1;
    box-shadow: 0 0 20px #ffffffaa inset;
}

.squeeze {
    transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
    transition: transform 0.7s ease;
}

.fade-enter-from {
    transform: translateY(-200%);
}

.fade-leave-to {
    transform: translateY(-200%);
}

.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body {
    left: -66px !important;
    /* 默认情况下缩进左侧66px，只留一点箭头部分 */
}

.aplayer.aplayer-fixed.aplayer-narrow .aplayer-body:hover {
    left: 0 !important;
    /* 鼠标悬停是左侧缩进归零，完全显示按钮 */
}
</style>
