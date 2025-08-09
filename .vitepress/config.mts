import { defineConfig } from 'vitepress'
import path from 'path'
import fg from 'fast-glob'      // позволяет искать файлы по маске, например, *.md
import slugify from 'slugify'   // превращает имя файла в «красивый URL»

const srcDir = 'notes'
const notesDir = path.resolve(__dirname, '..', srcDir) //абсолютный путь к папке, нужен для корректного доступа к файлам.

const slugMap: Record<string, string> = {}         // карта ИмяФайла → slug  'Техники заточки ножа' → 'tehniki-zatochki-nozha'
const reverseSlugMap: Record<string, string> = {}  // карта slug → ИмяФайла

// Собираем все md-файлы (ищет все .md файлы в папке notes)
const files = fg.sync(['*.md'], { cwd: notesDir })
console.log(`fg.sync ${files.length} files`);

// Собираем из них имя <--> slug
for (const file of files) {
  const name = path.parse(file).name
  const slug = slugify(name, { lower: true, strict: true, locale: 'ru' })

  slugMap[name] = slug
  reverseSlugMap[slug] = file // file = "Простые техники.md"
}

export default defineConfig({
  title: 'Sharpening notes',
  description: 'My evergreen notes about sharpening',
  srcDir,
  cleanUrls: true,
  themeConfig: {
    slugMap // Эту переменную можно достать в шаблоне через site...
  },

  // переопределение урлов
  rewrites(id) {
    let name = id;

    if (name.startsWith('/')) name = name.slice(1)
    if (name.endsWith('.md')) {
      name = id.slice(0, -3)
    }

    let slug = slugMap[name]

    return slug ? slug + ".md" : id
  },

  // Парсинг [[Заметка]] и [[Заметка | в этоих заметках]]
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
