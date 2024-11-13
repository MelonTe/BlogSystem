<template>
    <div class="profile-container">
        <img class="profile-image" src="https://picsum.photos/100" alt="Profile Picture" />
        <h3>博主名称</h3>
        <p>博主的个人简介...</p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.profile-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.profile-image {
    width: 80px;
    height: 80px;
    margin: 20px;
    box-shadow: 0px 0px 20px #000000a1;
    border-radius: 50%;
    transition: transform 0.5s;
}

.profile-image:hover {
    transform: rotate(360deg)
}
</style>