<template>
    <div ref='loginHTML' class="login">
        <div class="form">
            <div class="title">管理后台登录</div>
            <div class="subtitle">登录你的账户</div>
            <div class="inputf">
                <input v-model="loginData.username" type="text" placeholder="用户名" />
                <span class="label">用户名</span>
            </div>
            <div class="inputf">
                <input v-model="loginData.password" type="password" placeholder="密码" />
                <span class="label">密码</span>
            </div>
            <div class="inputf">
                <button @click="loginUser">登录</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '@/api/requestApi';
import { setToken } from '@/stores/tokenUtils';
import { useRouter } from 'vue-router';
import emitter from '@/utils/mittUtils';

const router = useRouter();
const loginHTML = ref<HTMLElement | null>(null);
const loginData = ref({
    password: "",
    username: ""
});

async function loginUser() {
    if (loginHTML.value) {
        loginHTML.value.classList.add("login-loading")
    }

    const token: string = await login(loginData.value);
    console.log(token);

    if (token) {
        setToken(token);
        setTimeout(() => {
            emitter.emit("loginSuccess");
            router.push({ name: 'home' });
        }, 1000)
    } else {
        setTimeout(() => {
            if (loginHTML.value)
                loginHTML.value.classList.remove("login-loading")
        }, 1000)
    }
}
</script>

<style src="./Login.css" scoped />
