import {defineConfig} from 'vitepress'
import path from 'path'
import fg from 'fast-glob' // позволяет искать файлы по маске, например, *.md
import slugify from 'slugify' // превращает имя файла в «красивый URL»

import { wikiLinksPlugin } from './plugins/wiki-links'

const srcDir = 'notes'
const notesDir = path.resolve(__dirname, '..', srcDir) //абсолютный путь к папке, нужен для корректного доступа к файлам.

let slugMap: Record<string, string> = {}         // карта ИмяФайла → slug  'Техники заточки ножа' → 'tehniki-zatochki-nozha'

function getSlugMagFromFiles(files: string[]) {
  let slugMap: Record<string, string> = {}
  for (const file of files) {
    const name = path.parse(file).name
    slugMap[name] = slugify(name, {lower: true, strict: true, locale: 'ru'})
  }
  return slugMap
}
function getSlutFromName(fileName: string, slugMap: Record<string, string>) {
  let name = fileName;

  if (name.startsWith('/')) name = name.slice(1)
  if (name.endsWith('.md')) {
    name = name.slice(0, -3)
  }

  let slug = slugMap[name]

  return slug ? slug + ".md" : fileName
}

// Собираем все md-файлы (ищет все .md файлы в папке notes)
const files = fg.sync(['*.md'], { cwd: notesDir })
slugMap = getSlugMagFromFiles(files)

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
    return getSlutFromName(id, slugMap)
  },

  // Парсинг [[Заметка]] и [[Заметка | в этоих заметках]]
  markdown: {
    config(md) {
      md.use(wikiLinksPlugin, {
        slugMap, // твой объект { "Заметка": "slug" }
        onLinkFound: (noteName, slug) => {
          // Можно собирать обратные ссылки здесь
          console.log('Найдена ссылка:', noteName, 'slug:', slug)
        },
        brokenLinkClass: 'wikilink-broken' // опционально
      })
    }
  }
})
