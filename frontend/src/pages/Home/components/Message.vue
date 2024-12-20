<template>
    <div class="message">
        <div class="main">
            <div class="title">留言板</div>

            <div class="infos">
                <div v-if="messData" class="msgDetail" v-for="(msg,index) in messData.Msgs">
                    <div class="leftSpace msgContent">{{ msg.message }}</div>
                    <div class="rightSpace msgTime">{{ msg.createdtime.slice(0, 10) }}</div>
                    <button v-if="token" @click="deleteMsg(index)">❌</button>
                </div>

                <div class="msgDetail">
                    <button class="buttonPage leftSpace" @click="pagePrev">←</button>
                    <button class="buttonPage rightSpace" @click="pageNext">→</button>
                </div>
            </div>

            <div class="sendMsg">
                <textarea class="sendInput" v-model="inputMsg"></textarea>
                <button class="buttonPage sendButton" @click="sendMsg">发送</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { deleteMessage, getMessage, sendMessage } from '@/api/requestApi';
import { getToken } from '@/stores/tokenUtils';
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';

let pageNum = 1;
let token: any = null;
const messNums = 4;
const messData = ref();
const range = computed(() => {
    return {
        start: messNums * (pageNum - 1),
        end: messNums * pageNum,
    }
})

// 换页
async function pagePrev() {
    if (pageNum - 1 < 1) {
        ElMessage.error("留言板第一页")
    }
    else {
        pageNum -= 1;
        messData.value = await getMessage(range.value);
    }
}
async function pageNext() {
    let maxPage = messData.value.Count / messNums + ((messData.value.Count % messNums) ? 1 : 0);
    if (pageNum + 1 > maxPage) {
        ElMessage.error("留言板最后一页")
    }
    else {
        pageNum += 1;
        console.log(messData.value.Count);
        console.log(maxPage);
        console.log(range.value);
        messData.value = await getMessage(range.value);
    }
}

// 删除
async function deleteMsg(index:number) {
    if(confirm("确认删除该留言？")){
        let message = messData.value.Msgs[index].message
        let createdtime = messData.value.Msgs[index].createdtime
        await deleteMessage(message, createdtime);

        messData.value = await getMessage(range.value);
    }
}

// 发送留言
const inputMsg = ref("");
async function sendMsg() {
    console.log(inputMsg.value);
    await sendMessage({ message: inputMsg.value });
    messData.value = await getMessage(range.value);
    inputMsg.value = "";
}

onMounted(async () => {
    messData.value = await getMessage(range.value);
    token = getToken()
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.message {
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 350px;
    width: 100%;
    margin-top: 50px;

    padding: 1em;
    border-radius: 2em;

    box-shadow: inset -5px -5px 6px #75757565, -5px -5px 6px #ffffff;
}

.main {
    height: 82%;
    width: 95%;
    display: flex;
    flex-direction: column;
    padding: 1.5em 2em;

    border-radius: 2em;

    background-color: #f1f1f1;

    box-shadow: inset 0px 0px 8px #0000007c, 0px 0px 8px #ffffff86;
}

.title {
    font-size: 28px;
    color: orange;
    text-shadow: 0px 0px 1px #0000007c;
    font-weight: bold;
}

.infos {
    width: 97%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
    min-height: 200px;

    padding: 0.5em;
    margin: 10px 0;
}

.msgDetail {
    padding: 0.5em;
    display: flex;
    width: 100%;
}

.msgContent {
    flex: 4;
}

.msgTime {
    flex: 1;
}

.leftSpace {
    margin-right: auto;
}

.rightSpace {
    margin-left: 10px;
}

.buttonPage {
    outline: none;
    border: 1px solid #8b8b8b79;
    background-color: orange;
    padding: 0.3em 1em;
    border-radius: 5px;
    box-shadow: inset 0 0 4px #8b8b8b79;
}

.sendMsg {
    width: 97.5%;
    position: relative;
}

.sendInput {
    width: 100%;
    padding: 0.5em 0.6em 0.5em 0.5em;
    resize: none;
    min-height: 50px;
}

.sendButton {
    position: relative;
    left: 92.5%;
}
</style>