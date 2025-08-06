<script setup lang="ts">
import { useRouter, useData } from 'vitepress';
import { onMounted, watch } from 'vue';

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter, page } = useData()
const router = useRouter();


onMounted(() => {
    // первый url
    console.log('Current route:', router.route.path);
});

// Отслеживаем смену маршрута
watch(
    () => router.route.path,
    (newPath, oldPath) => {
        console.log('Navigated from', oldPath, 'to', newPath);
        // Здесь можно запускать кастомную логику
    }
);



</script>

<template>
  <div v-if="frontmatter.home">
    <h1>{{ site.title }}</h1>
    <p>{{ site.description }}</p>

      <Content />
  </div>
  <div v-else>
    <a href="/">Home</a>
    <Content />
  </div>
</template>
