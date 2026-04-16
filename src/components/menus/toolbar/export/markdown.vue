<template>
  <menus-button
    ico="markdown"
    :text="t('export.markdown')"
    huge
    @menu-click="saveMarkdownFile"
  />
</template>

<script setup>
import { saveAs } from 'file-saver'

import { htmlToMarkdown } from '@/utils/html-to-markdown'

const editor = inject('editor')
const getVanillaHTML = inject('getVanillaHTML', null)
const options = inject('options')

const saveMarkdownFile = async () => {
  if (!editor.value) {
    return
  }

  const html =
    typeof getVanillaHTML === 'function'
      ? await getVanillaHTML()
      : editor.value.getHTML()
  const markdown = htmlToMarkdown(html)
  const blob = new Blob([markdown], {
    type: 'text/markdown;charset=utf-8',
  })
  const { title } = options.value.document
  const filename =
    title !== '' ? options.value.document?.title : t('document.untitled')

  saveAs(blob, `${filename}.md`)
}
</script>