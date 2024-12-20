<template>
    <div class="message">
        <div class="main">
            <div class="title">留言板</div>

            <div class="infos">
                <div class="msgContent">
                    <div v-if="messData" class="msgDetail" v-for="(msg, index) in messData.Msgs">
                        <div class="leftSpace msgText">{{ msg.message }}</div>
                        <div class="rightSpace msgTime">{{ msg.createdtime.slice(0, 10) }}</div>
                        <button v-if="token" @click="deleteMsg(index)">❌</button>
                    </div>
                </div>

                <div class="pageButtonContent">
                    <button class="buttonPage leftSpace" @click="pagePrev">←</button>
                    <button class="buttonPage rightSpace" @click="pageNext">→</button>
                </div>
            </div>

            <div class="sendMsg">
                <textarea class="sendInput" v-model="inputMsg" maxlength="100" placeholder="限制100字"></textarea>
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
async function deleteMsg(index: number) {
    if (confirm("确认删除该留言？")) {
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

<style src="./Message.css" scoped />