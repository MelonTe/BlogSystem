<template>
  <Transition name="default" mode="out-in" appear>
    <RouterLink :to="{name:'home' , query : {tags:[tag.tagname]}}" class="tagItem">
      <span style="margin-right: auto ;">{{ tag.tagname }}</span>
      <span>{{ tag.count }}</span>
    </RouterLink>
  </Transition>
</template>

<script setup lang="ts">

interface TagImpl {
  count: number;
  tagname: string;
}

const props = defineProps<{ tag: TagImpl }>();
</script>

<style scoped>
*{
    padding: 0;
    margin: 0;
}

.tagItem{
  width: 70%;

  background-color: #f7ebd9;
  
  box-shadow: inset 0 0 3px #bebebedc,0 0 3px #aaaaaab7;
  border-radius: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-around;

  margin-bottom: 0.75rem;
  padding: 1em;
  text-decoration: none;
  color: #000000;
}

</style>
