<script setup lang="ts">
    import {useData, Content} from 'vitepress';
    const { site, frontmatter } = useData()
</script>

<template>

  <div v-if="frontmatter.home">
    <h1>{{ site.title }}</h1>
    <p>{{ site.description }}</p>
    <p>{{ site.themeConfig.slugMap }}</p>

    <Content />
  </div>

  <div v-else>
    <a href="/">Home</a>
    <Content />
  </div>

</template>
