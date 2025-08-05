import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import slugify from 'slugify'

const srcDir = 'notes'
const notesDir = path.resolve(__dirname, '..', srcDir)

const slugMap: Record<string, string> = {}
const reverseSlugMap: Record<string, string> = {}

// Собираем все md-файлы
const files = fg.sync(['*.md'], { cwd: notesDir })

for (const file of files) {
  const name = path.parse(file).name
  const slug = slugify(name, { lower: true, strict: true, locale: 'ru' })

  slugMap[name] = slug
  reverseSlugMap[slug] = file // file = "Простые техники.md"
}

// Плагин для переадресации slug → русский .md
function WikiSlugPlugin(notesDir: string) {
  return {
    name: 'vitepress-wiki-slug-resolver',
    resolveId(id: string) {
      if (id.startsWith('/')) id = id.slice(1)
      if (id.endsWith('.md')) {
        const slug = id.slice(0, -3)
        const file = reverseSlugMap[slug]
        if (file) {
          return path.join(notesDir, file)
        }
      }
      return null
    }
  }
}

export default defineConfig({
  title: 'Sharpening notes',
  description: 'My evergreen notes about sharpening',
  srcDir,
  vite: {
    plugins: [WikiSlugPlugin(notesDir)]
  },
  markdown: {
    config(md) {
      const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

      const defaultText = md.renderer.rules.text ?? ((tokens, idx) => tokens[idx].content)

      md.renderer.rules.text = function (tokens, idx, options, env, self) {
        const raw = defaultText(tokens, idx, options, env, self)

        return raw.replace(pattern, (_, rawName, displayText) => {
          const name = rawName.trim()
          const slug = slugMap[name]
          const label = (displayText || name).trim()

          if (!slug) return `[[${name}${displayText ? ` | ${label}` : ''}]]`

          return `<a href="/${slug}" class="internal-link">${label}</a>`
        })
      }
    }
  }
})
