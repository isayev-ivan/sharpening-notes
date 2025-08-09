<script setup lang="ts">
import {useRouter, useData, Content} from 'vitepress';
import { onMounted, watch, ref, markRaw, shallowRef } from 'vue';
import {onBeforeUnmount} from "@vue/runtime-core";

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter, page } = useData()

// Импортируем все Markdown через Vite для динамического импорта
// const allMdFiles = import.meta.glob('../../notes/**/*.md')

// const router = useRouter();
// const currentPath = ref(router.route.path);
// const DynamicContent = shallowRef(null);
// const slugToFilePathMap = site.value.themeConfig.slugToFilePathMap;

// console.log('allMdFiles keys:', Object.keys(allMdFiles))
// console.log('slugToFilePathMap:', { ...slugToFilePathMap })


// async function loadContent(path:string) {
//     console.log(`loadContent`);
//     path = path.replace(/^\//, '');
//
//     // По slug получаем путь к md внутри import.meta.glob
//     const filePath = slugToFilePathMap[path]
//
//     if (filePath && allMdFiles[filePath]) {
//         const compModule = await allMdFiles[filePath]()
//         DynamicContent.value = markRaw(compModule.default)
//     } else {
//         console.info(`File path ${filePath} not found in import.meta.glob keys`)
//         DynamicContent.value = null
//     }
// }


// function onClickHandler(e: MouseEvent) {
//     // Проверяем, что клик по <a.internal-link> с внутренним href
//     const target = e.target as HTMLElement
//     if (target.tagName === 'A' && target.classList.contains('internal-link')) {
//         const href = (target as HTMLAnchorElement).getAttribute('href')
//         if (href && href.startsWith('/')) {
//             e.preventDefault() // Останавливаем дефолтный переход
//             // router.push(href)   // SPA-переход через Vue Router
//         }
//     }
// }

// onMounted(() => {
//     document.body.addEventListener('click', onClickHandler)
// })

// onBeforeUnmount(() => {
//     document.body.removeEventListener('click', onClickHandler)
// })

// Инициализируем и следим за изменением маршрута
// watch(() => router.route.path, async (newPath) => {
//     console.log(`watch`);
//     currentPath.value = newPath;
//     await loadContent(newPath);
// }, { immediate: true });


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

<!--    <div>-->
<!--        <component v-if="DynamicContent" :is="DynamicContent" />-->
<!--        <Content v-else />-->
<!--    </div>-->

</template>
