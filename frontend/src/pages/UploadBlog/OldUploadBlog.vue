<template>
    <div class="modify">
        <div class="form">

            <div class="inputf">
                <textarea class="textarea" v-model="blogData.blogname" type="text" placeholder="" maxlength="20" />
                <span class="label">标题</span>
            </div>

            <div class="inputf tagsContent" v-for="(tag, index) in blogData.tag">
                <textarea class="textarea tagsText" v-model="blogData.tag[index]" type="text" placeholder=""
                    maxlength="10" />
                <span class="label">标签 {{ index + 1 }}</span>
                <button class="button tagsDelete tags" @click="deleteTag(index)">-</button>
            </div>

            <div class="inputf" style="display: block;">
                <button class="button tags tagsAdd" @click="AddTag">标签+</button>
            </div>

            <div class="inputf" style="flex-direction: column;">
                <strong>选择MD文件(.md后缀)与对应图片所在的文件夹</strong>
                <span style="color: #6f6f6f; font-size: 13px; margin-bottom: 10px;">
                    注意：图片与md放在同一文件夹, 文件夹内只能存在一个md文件。
                </span>
                <strong style="color: #6f6f6f; font-size: 13px; margin-bottom: 5px;">
                    选中文件夹 : [ {{ dirName }} ]
                </strong>
                <button class="button tags tagsAdd" @click="getDirData">选择文件夹</button>
            </div>

            <div class="inputf">
                <button class="button" @click="confirmUpload">上传</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { uploadBlog } from '@/api/requestApi';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const blogData = ref({
    blogname: "",
    tag: [""],
});

// 获取需要提交的文件
const dirName = ref("");
let mdFile: any = null;
let formData: any;
const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'];
const getDirData = async () => {
    try {
        mdFile = null;
        dirName.value = "";
        formData = new FormData();
        // 读取文件夹
        const handle = await (window as any).showDirectoryPicker();
        // 寻找图片与markdown文件
        await processHandle(handle);
        // 判断该文件夹是否有效
        if (mdFile !== null) {
            dirName.value = handle.name;
        } else {
            ElMessage.error("没有检测到markdown");
        }
    }
    catch {
        ElMessage.error("读取文件夹失败");
    }
}
async function processHandle(handle: any) {
    if (handle.kind === "directory") {
        for await (const item of handle.entries()) {
            await processHandle(item[1]);
        }
    }
    else {
        const fileType = handle.name.split('.').pop();
        if (fileType === 'md' && mdFile === null) {
            mdFile = await handle.getFile();
            ElMessage.success("成功获取：" + mdFile.name);
        }
        else if (imageFormats.includes(fileType.toLowerCase())) {
            formData.append("images", await handle.getFile())
        }
    }
}

// 监视数据
watch(blogData, (newValue, oldValue) => {
    // 禁止换行和空格
    for (let i = 0; i < newValue.tag.length; i++)
        blogData.value.tag[i] = newValue.tag[i].replace("\n", "").replace(" ", "")
    blogData.value.blogname = newValue.blogname.replace("\n", "").replace(" ", "")
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
async function confirmUpload() {
    const confirmed = confirm("确认提交博文？")
    if (confirmed) {
        // 清除空标签
        for (let i = 0; i < blogData.value.tag.length; i++)
            if (!blogData.value.tag[i]) {
                ElMessage.error("存在空标签：第" + (i + 1) + "项")
                return;
            }
        //上传
        formData.append('markdown', new File([mdFile], blogData.value.blogname + ".md", { type: mdFile.type }));

        formData.append('tags', blogData.value.tag);
        
        formData.forEach((item: any) => {
            console.log(item)
        })

        await uploadBlog(formData);
        router.push({ name: "home" });
    }
}
</script>

<style src="./UploadBlog.css" scoped />
