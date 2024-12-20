<template>
    <div>
        <InfoCard class="element" v-for="(info, index) in infos" :key="info.ID" :infos="info" />
        <Pagination v-model:currentPage="PaginationData.currentPage" v-model:totalPages="PaginationData.totalPages" />
        <Message/>
    </div>
</template>

<script setup lang="ts">
import { postBlogList, getBlogTagNums } from '@/api/requestApi';
import InfoCard from './components/InfoCard.vue';
import Pagination from './components/Pagination.vue';
import Message from './components/Message.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const pageItemNum = 9 | 1; // 设置为奇数，保持美观
const infos = ref();
const PaginationData = ref({
    currentPage: 1,
    totalPages: 1,
})

// 发送 POST 请求
const criteria = computed(() => {
    return {
        blogname: route?.query?.blogname,
        end: pageItemNum-1 + (PaginationData.value.currentPage-1)*pageItemNum,
        start: 0 + (PaginationData.value.currentPage-1)*pageItemNum,
        tag: route?.query?.tags,
    }
})

const getBlogList = async () => {
    // 初始博客列表信息
    const blogList : any = await postBlogList(criteria.value);
    infos.value = blogList.blogs;
    infos.value.forEach((item: any) => {
        const date = new Date(item.UpdatedAt);
        const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        item.UpdatedAt = formatter.format(date);
        item.image = 'https://picsum.photos/260/161'
    });

    let blogcount = blogList.count;
    PaginationData.value.totalPages = blogcount / pageItemNum + ((blogcount % pageItemNum)?1:0);
}

watch(criteria, ()=>{
    getBlogList()
}, {deep : true});

onMounted(async () => {
    await getBlogList();
})

</script>

<style scoped>
.element {
    margin-bottom: 15px;
}
</style>