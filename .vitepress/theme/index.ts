import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import './style.css'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // При переходе на url '/odin-nozh' перенаправлять на '/один-нож'
    // router.onBeforeRouteChange("");
  }
} satisfies Theme
