// wikiLinksPlugin.ts
import type MarkdownIt from 'markdown-it'

export interface WikiLinksPluginOptions {
    slugMap: Record<string, string> // { "Заметка": "slug-zametka" }
    onLinkFound?: (noteName: string, slug: string | undefined) => void
    brokenLinkClass?: string
}

export function wikiLinksPlugin(md: MarkdownIt, options: WikiLinksPluginOptions) {
    const { slugMap, onLinkFound, brokenLinkClass = 'broken' } = options

    const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
    const defaultText = md.renderer.rules.text ?? ((tokens, idx) => tokens[idx].content)

    md.renderer.rules.text = function (tokens, idx, opts, env, self) {
        const raw = defaultText(tokens, idx, opts, env, self)

        return raw.replace(pattern, (_, rawName: string, displayText?: string) => {
            const name = rawName.trim()
            const slug = slugMap[name]
            const label = (displayText || name).trim()

            // Коллбэк для сбора обратных ссылок
            onLinkFound?.(name, slug)

            // Если slug нет — возвращаем как битую ссылку
            if (!slug) {
                return `<span class="internal-link ${brokenLinkClass}">[[${label}]]</span>`
            }

            return `<a href="/${slug}" class="internal-link">${label}</a>`
        })
    }
}
