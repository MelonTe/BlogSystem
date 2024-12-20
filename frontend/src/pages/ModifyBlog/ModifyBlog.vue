<template>
    <div class="modify">
        <div class="form">
            <div class="inputf">
                <textarea class="textarea" v-model="blogData.blogname" type="text" placeholder="" disabled />
                <span class="label">标题</span>
            </div>
            <div class="inputf">
                <textarea class="textarea resize" v-model="blogData.content" type="text" placeholder="" />
                <span class="label">内容</span>
            </div>

            <div class="inputf tagsContent" v-for="(tag, index) in blogData.tag">
                <textarea class="textarea tagsText" v-model="blogData.tag[index]" type="text" placeholder="" />
                <span class="label">标签 {{ index + 1 }}</span>
                <button class="button tagsDelete" @click="deleteTag(index)">-</button>
            </div>

            <div class="inputf" style="display: block;">
                <button class="button tagsDelete" @click="AddTag">标签+</button>
            </div>

            <div class="inputf">
                <button class="button" @click="confirmModify">修改</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { modifyBlog, postBlogDetail } from '@/api/requestApi';
import { ElMessage } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const blogData = ref({
    blogname: "",
    content: "",
    tag: [""],
});

// 监视数据
watch(blogData, (newValue, oldValue) => {
    // 禁止换行和空格
    for (let i = 0; i < newValue.tag.length; i++)
        blogData.value.tag[i] = newValue.tag[i].replace("\n", "").replace(" ", "")
}, { deep: true })

// 标签
const deleteTag = (index: number) => {
    if (index !== 0) {
        blogData.value.tag.splice(index, 1); // 从索引位置2开始，删除1个元素
    }
    else {
        ElMessage.error("至少保留一个标签！");
    }
}
const AddTag = () => {
    if (blogData.value.tag.length < 5) {
        blogData.value.tag.push("");
    } else {
        ElMessage.error("最多五个标签！")
    }

}

// 确认修改
async function confirmModify() {
    const confirmed = confirm("确认提交修改？")
    if (confirmed) {
        // 清除空标签
        for (let i = 0; i < blogData.value.tag.length; i++)
            if (!blogData.value.tag[i]) {
                ElMessage.error("存在空标签：第" + (i+1) + "项")
                return;
            }
        //上传

        await modifyBlog(blogData.value);
        router.push({ name: "home" });
    }

}

onMounted(async () => {
    const blogDetail: any = await postBlogDetail(route.params.blogname as string);
    blogData.value.blogname = blogDetail.Title;
    blogData.value.content = blogDetail.Content;
    blogData.value.tag = blogDetail.tag;
})
</script>

<style src="./ModifyBlog.css" scoped />
