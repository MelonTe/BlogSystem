<template>
    <div class="titleContainer">
        <div class="title">
            <h1 class="titleText"><strong>SZTU student's Blog</strong></h1>
            <div class="typing">
                <h4 class="typing">{{ typingWords }}</h4>
                <h4 class="animation">|</h4>
            </div>
        </div>
        <div class="hint">
            <div ref="arror" class="arror">↓</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { load } from 'jinrishici';
import { useTypingEffect, setTypingWords } from '@/hooks/useTyping'; // 引用打字机效果

// 使用打字机效果
const { typingWords, startTyping } = useTypingEffect(fetchData);

// 随机古诗词Api
async function fetchData() {
    await load(result => {
        const content: string = result?.data?.content || "";
        const author: string = result?.data?.origin?.author || "";
        setTypingWords(content + "  ——" + author); // 设置打字机内容
        startTyping(); // 开始打字机效果
    }, errData => {
        console.log(errData);
    });
}

// 挂载组件后立即启动
onMounted(() => {
    nextTick(() => {
        fetchData();
        window.addEventListener('scroll', handleScroll);
    })
});

// 下拉提示
const arror = ref<HTMLElement | null>(null)
const handleScroll = () => {
    if (arror.value) {
        if (window.scrollY > 0) {
            arror.value.style.opacity = "0";
        } else {
            arror.value.style.opacity = "1";
        }
    }
};
</script>

<style scoped>
.title {
    display: flex;
    height: 95vh;
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
    font-size: 45px;
}

.typing {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0;
    text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    color: aliceblue;
    white-space: pre;
}

.animation {
    animation: blink 0.4s infinite alternate;
}

@keyframes blink {
    0% {
        color: #eee;
    }

    20% {
        color: #d1d1d1;
    }

    100% {
        color: transparent;
    }
}

.hint {
    display: flex;
    height: 5vh;
    margin: 0;
    justify-content: center;
    align-items: center;
    caret-color: transparent;
}

.arror {
    display: inline-block;
    text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8);
    color: aliceblue;
    margin: 0;
    text-align: center;
    font-size: 25px;
    animation: arrow 1s infinite;
    transition: opacity 0.5s ease;
}

@keyframes arrow {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0);
    }
}
</style>
