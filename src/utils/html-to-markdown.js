const BLOCK_TAGS = new Set([
  'article',
  'aside',
  'blockquote',
  'details',
  'div',
  'dl',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'tbody',
  'thead',
  'tfoot',
  'tr',
  'td',
  'th',
  'ul',
])

const escapeInline = (text) => {
  return text.replace(/\\/g, '\\\\').replace(/([*_`~\[\]])/g, '\\$1')
}

const collapseWhitespace = (text) => {
  return text.replace(/\s+/g, ' ')
}

const cleanLines = (text) => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim()
}

const getText = (node, options = {}) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = options.preformatted
      ? node.textContent || ''
      : collapseWhitespace(node.textContent || '')

    return options.preformatted ? value : escapeInline(value)
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const element = /** @type {HTMLElement} */ (node)
  const tag = element.tagName.toLowerCase()
  const preformatted = options.preformatted || tag === 'pre' || tag === 'code'

  return Array.from(element.childNodes)
    .map((child) => serializeNode(child, { ...options, preformatted }))
    .join('')
}

const serializeList = (element, depth = 0) => {
  const ordered = element.tagName.toLowerCase() === 'ol'

  return Array.from(element.children)
    .filter((child) => child.tagName?.toLowerCase() === 'li')
    .map((item, index) => serializeListItem(item, ordered, index, depth))
    .join('')
}

const serializeListItem = (element, ordered, index, depth) => {
  const indent = '  '.repeat(depth)
  const marker = ordered ? `${index + 1}. ` : '- '
  const parts = []
  const nested = []

  Array.from(element.childNodes).forEach((child) => {
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      ['ul', 'ol'].includes(child.tagName.toLowerCase())
    ) {
      nested.push(serializeList(child, depth + 1))
      return
    }

    parts.push(serializeNode(child, { listDepth: depth }))
  })

  const line = `${indent}${marker}${cleanLines(parts.join(''))}`.trimEnd()
  const nestedText = nested.filter(Boolean).join('')

  return `${line}\n${nestedText}`
}

const serializeTable = (element) => {
  const rows = Array.from(element.querySelectorAll('tr')).map((row) =>
    Array.from(row.children).map((cell) => cleanLines(getText(cell))),
  )

  if (!rows.length) {
    return ''
  }

  const [header, ...body] = rows
  const divider = header.map(() => '---')
  const lines = [header, divider, ...body].map(
    (cells) => `| ${cells.join(' | ')} |`,
  )

  return `${lines.join('\n')}\n\n`
}

function serializeNode(node, options = {}) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = options.preformatted
      ? node.textContent || ''
      : collapseWhitespace(node.textContent || '')

    return options.preformatted ? text : escapeInline(text)
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const element = /** @type {HTMLElement} */ (node)
  const tag = element.tagName.toLowerCase()
  const inline = () => getText(element, options).trim()

  if (tag === 'br') {
    return '  \n'
  }

  if (tag === 'hr') {
    return '\n---\n\n'
  }

  if (tag === 'pre') {
    const code = element.textContent?.replace(/\n+$/, '') || ''
    return `\n\`\`\`\n${code}\n\`\`\`\n\n`
  }

  if (tag === 'code') {
    if (element.parentElement?.tagName.toLowerCase() === 'pre') {
      return element.textContent || ''
    }
    return `\`${(element.textContent || '').replace(/`/g, '\\`')}\``
  }

  if (tag === 'strong' || tag === 'b') {
    return `**${inline()}**`
  }

  if (tag === 'em' || tag === 'i') {
    return `*${inline()}*`
  }

  if (tag === 's' || tag === 'del') {
    return `~~${inline()}~~`
  }

  if (tag === 'a') {
    const href = element.getAttribute('href') || ''
    const text = inline() || href
    return href ? `[${text}](${href})` : text
  }

  if (tag === 'img') {
    const alt = escapeInline(element.getAttribute('alt') || '')
    const src = element.getAttribute('src') || ''
    return src ? `![${alt}](${src})` : ''
  }

  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1])
    return `${'#'.repeat(level)} ${inline()}\n\n`
  }

  if (tag === 'blockquote') {
    const content = cleanLines(getText(element, options))
    return `${content
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n')}\n\n`
  }

  if (tag === 'ul' || tag === 'ol') {
    return `${serializeList(element, options.listDepth || 0)}\n`
  }

  if (tag === 'table') {
    return serializeTable(element)
  }

  if (tag === 'p') {
    const content = inline()
    return content ? `${content}\n\n` : ''
  }

  if (tag === 'details') {
    const summary = element.querySelector('summary')
    const body = Array.from(element.childNodes)
      .filter((child) => child !== summary)
      .map((child) => serializeNode(child, options))
      .join('')
    const summaryText = summary ? cleanLines(getText(summary, options)) : ''

    return `${summaryText ? `**${summaryText}**\n\n` : ''}${body}`
  }

  const content = Array.from(element.childNodes)
    .map((child) => serializeNode(child, options))
    .join('')

  if (BLOCK_TAGS.has(tag)) {
    return `${content.trim() ? `${content.trim()}\n\n` : ''}`
  }

  return content
}

export const htmlToMarkdown = (html = '') => {
  if (!html || typeof html !== 'string') {
    return ''
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const markdown = Array.from(doc.body.childNodes)
    .map((node) => serializeNode(node))
    .join('')

  return cleanLines(markdown)
}