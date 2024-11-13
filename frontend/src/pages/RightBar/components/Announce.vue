<template>
    <div class="announce">
        <h3 style="display: flex; align-items: center;">
            <i class="icon-css iconfont icon-guanzhu"></i>
            公告
        </h3>
        <p>公告内容...</p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.announce {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: center;
}

.icon-css {
    color: red;
    font-size: 24px;
    animation: shake 1s linear infinite;
}
@keyframes shake {
    0% {
        transform: rotate(0deg);
    }
    1% {
        transform: rotate(10deg);
    }
    10% {
        transform: rotate(-20deg);
    }
    15% {
        transform: rotate(30deg);
    }
    20% {
        transform: rotate(-40deg);
    }
    25% {
        transform: rotate(30deg);
    }
    30% {
        transform: rotate(-20deg);
    }
    35%{
        transform: rotate(10deg);
    }
    36%{
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
</style>