<template>
    <div ref='login' class="login">
        <div class="form">
            <div class="title">管理后台登录</div>
            <div class="subtitle">登录你的账户</div>
            <div class="inputf">
                <input type="text" placeholder="用户名" />
                <span class="label">用户名</span>
            </div>
            <div class="inputf">
                <input type="password" placeholder="密码" />
                <span class="label">密码</span>
            </div>
            <div class="inputf">
                <button @click="test">登录</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let login = ref<HTMLElement | null>(null)

function test(){
    if(login.value){
        login.value.classList.add("login-loading")
    }
}
function test2(){
    if(login.value){
        login.value.classList.remove("login-loading")
    }
}
</script>

<style scoped>
.login {
    position: relative;
    width: 10vw;
    height: 70vh;
    margin: 5vh 0 5vh 0;
    padding: 1em;

    box-sizing: border-box;
    border-radius: 2em;
    box-shadow: 0 5px 25px #d28636;

    transition: 0.5s;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    caret-color: transparent;

    .form {
        width: 60%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        z-index: 1;
        caret-color: transparent;

        .title {
            text-shadow: 0px 0px 4px rgba(0, 0, 0, 1);
            color: aliceblue;
            font-size: 40px;
        }

        .subtitle {
            text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
            color: rgb(255, 153, 0);
            margin-bottom: 8%;
            font-size: 17px;
            letter-spacing: 2px;
        }

        .inputf {
            width: 100%;
            position: relative;
            margin-bottom: 6%;

            input {
                width: 100%;
                height: 35px;
                border: none;
                outline: 1.5px solid #ffb973;
                border-radius: 1em;
                font-size: 1em;
                padding: 0 1em 0 1em;
                caret-color: black;
            }
            input:focus {
                outline: 1.5px solid #ff8000;
            }
            input::placeholder {
                opacity: 0;
            }
            input:focus+.label,
            input:not(:placeholder-shown) +.label {
                opacity: 1;
                top: -24px;
                color: black;
                font-weight: bold;
            }

            .label {
                position: absolute;
                top: 0.3em;
                left: 1em;
                font-size: 1em;
                transition: 0.25s ease-out;
                opacity: 1;
                color: #757575;
            }

            button{
                position: absolute;
                width: 100%;
                height: 35px;
                color: #ffffff;
                background-color: #1dcc66;
                outline: none;
                border-radius: 0.5em;
                left: 1.25em;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
}

.login::after {
    content: '';
    position: absolute;
    inset: 1em;
    background-color: #fdf7f1;
    border-color: black;
    border-radius: 2em;
    transition: 0.5s;
}

.login-loading::before {
    content: '';
    position: absolute;
    background-color: #ffb973;
    width: 100px;
    height: 400%;
    transition: 1s;
    box-shadow: 0 5px 30px #d28636,0 5px 50px #ffb973;
    animation:loadstart 0.5s linear forwards,loading 2s linear infinite;
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes loadstart {
    0% {
        opacity: 0;
        width: 0px;
    }

    100% {
        opacity: 1;
        width: 100px;
    }
}
</style>