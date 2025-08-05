import { defineConfig } from 'vitepress'
import fg from 'fast-glob'
import path from 'path'
import slugify from 'slugify'

const srcDir = 'notes'
const NOTES_DIR = path.resolve(__dirname, '..', srcDir)

function generateWikiMap(): Record<string, string> {
  const entries = fg.sync(['*.md'], { cwd: NOTES_DIR })
  const map: Record<string, string> = {}

  for (const filename of entries) {
    const rawName = path.parse(filename).name
    const slug = slugify(rawName, {
      lower: true,
      strict: true,
      locale: 'ru'
    })
    map[rawName] = slug
  }

  return map
}

const wikiMap = generateWikiMap()

export default defineConfig({
  title: 'Sharpening notes',
  description: 'My evergreen notes about sharpening',
  srcDir,
  markdown: {
    config(md) {
      const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

      const renderText = md.renderer.rules.text || function (tokens, idx) {
        return tokens[idx].content
      }

      md.renderer.rules.text = function (tokens, idx, options, env, self) {
        const raw = renderText(tokens, idx, options, env, self)

        return raw.replace(pattern, (_, rawName, displayText) => {
          const trimmedName = rawName.trim()
          const target = wikiMap[trimmedName]
          const text = (displayText || trimmedName).trim()

          if (!target) return `[[${trimmedName}${displayText ? ` | ${text}` : ''}]]`

          return `<a href="/${target}" class="internal-link">${text}</a>`
        })
      }
    }
  }
})
