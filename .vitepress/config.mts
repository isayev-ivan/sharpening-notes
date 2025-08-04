import { defineConfig } from 'vitepress'
import slugify from 'slugify'

export default defineConfig({
  title: 'Sharpening notes',
  description: 'My evergreen notes about sharpening',
  srcDir: 'notes',

  markdown: {
    config(md) {
      console.log('config loaded')

      md.use(() => {
        const pattern = /\[\[([\p{L}\p{N}\p{Zs}\-_.]+)\]\]/gu


        const renderText = md.renderer.rules.text || function (tokens, idx) {
          return tokens[idx].content;
        }

        md.renderer.rules.text = function (tokens, idx, options, env, self) {
          const raw = renderText(tokens, idx, options, env, self);

          return raw.replace(pattern, (_, rawName) => {
            const slug = slugify(rawName.trim(), {
              lower: true,
              strict: true,
              locale: 'ru'
            })
            return `<router-link to="/${slug}" class="internal-link">${rawName}</router-link>`;
          })
        }
      })
    }
  }
})
