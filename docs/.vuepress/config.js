import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { path } from '@vuepress/utils'

export default defineUserConfig({
    bundler: viteBundler(),
    theme: path.resolve(__dirname, './theme'),
})
