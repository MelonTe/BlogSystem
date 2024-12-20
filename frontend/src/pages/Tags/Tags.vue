<template>
    <div>
        <TagItem v-if="tags" class="element" v-for="(tag, index) in tags" :key="index" :tag="tag" />
    </div>
</template>

<script setup lang="ts">
import { getTags } from '@/api/requestApi';
import { onMounted, ref } from 'vue';
import TagItem from './components/TagItem.vue';

const tags = ref();

onMounted(async () => {
    tags.value = await getTags();
})
</script>

<style scoped></style>