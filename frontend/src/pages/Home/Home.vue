<template>
    <div>
        <InfoCard class="element" v-for="(info, index) in infos" :key="index" :info="info" />
        <Pagination />
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import InfoCard from './components/InfoCard.vue';
import Pagination from './components/Pagination.vue';


// 发送 POST 请求
// const criteria = {
//     blogname: "",
//     end: 10,
//     start: 0,
//     tag: []
// };
// axios.post('http://localhost:8080/bloglist', criteria, {
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
// .then(response => {
//     console.log('请求成功:', response.data);
// })
// .catch(error => {
//     console.error('请求失败:', error);
// });

let infos = [
    {
        date: '2024-07-14',
        tags: ['mac', 'alfred'],
        categories: 'Technology',
        title: 'Alfred 精确计算器',
        content: '前100个字...',
        image: 'https://picsum.photos/260/160',
        link: '/article'
    },
    {
        date: '2018-11-10',
        tags: ['java', 'spring', 'cross region'],
        categories: 'Java',
        title: 'Spring 中的跨域问题',
        content: '前100个字...',
        image: 'https://picsum.photos/261/160',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    },
    {
        date: '2018-10-27',
        tags: ['java', 'maven'],
        categories: 'Technology',
        title: 'Maven 中的 Scope',
        content: '前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字..前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字前100个字.',
        image: 'https://picsum.photos/260/161',
        link: '/article'
    }
]
</script>

<style scoped>
.element {
    margin-bottom: 15px;
}
</style>