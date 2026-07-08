<!--
  Calliope Campus deployment entry.

  This replaces the upstream Umo Editor demo (recoverable from git history) with
  the thin wrapper the campus embeds as an iframe. It speaks the campus
  postMessage protocol and mounts <umo-editor> from THIS repo's source (the
  plugin is registered in src/main.js via ./components), so the campus editor
  ships with this fork's translations and needs no separate package.

  Built for hosting via `pnpm build:campus` (→ dist/, base '/') on Cloudflare
  Pages, and served locally on :4174 via `pnpm dev:campus`.

  Protocol (campus ⇄ iframe), scoped by the `?instance=` query param:
    campus → iframe (source 'calliope-campus'):    umo:init | umo:update-content | umo:update-props
    iframe → campus (source 'calliope-campus-umo'): umo:ready | umo:changed | umo:saved
  content is { html, json, text, version }.
-->
<template>
  <div class="umo-shell">
    <umo-editor
      v-if="hasReceivedInit"
      ref="editorRef"
      :key="editorRenderKey"
      v-bind="options"
      @created="handleCreated"
      @changed="handleChanged"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const editorRef = ref(null)
const instanceId = new URLSearchParams(window.location.search).get('instance') || 'default'
const hasReceivedInit = ref(false)

const options = ref(createDefaultOptions())
const editorRenderKey = computed(() => {
  const disabled = Array.isArray(options.value.disableExtensions)
    ? [...options.value.disableExtensions].sort().join(',')
    : ''

  return [
    options.value.editorKey || 'calliope-campus-umo',
    options.value.locale || 'en-US',
    disabled,
  ].join('::')
})

function createDefaultOptions() {
  return {
    editorKey: 'calliope-campus-umo',
    locale: 'en-US',
    height: '100%',
    fullscreenZIndex: 30,
    toolbar: {
      showSaveLabel: false,
    },
    disableExtensions: [],
    page: {
      layouts: ['page', 'web'],
      showBreakMarks: false,
      showToc: false,
    },
    document: {
      title: 'Untitled',
      content: '<p></p>',
      readOnly: false,
      autofocus: false,
      enableMarkdown: true,
      enableBubbleMenu: true,
      enableBlockMenu: true,
      autoSave: {
        enabled: false,
      },
    },
    // editor-external assets (fonts, templates, page backgrounds). Pinned to the
    // @umoteam/editor-external version this fork depends on (see package.json).
    cdnUrl: 'https://unpkg.com/@umoteam/editor-external@10.1.0',
    shareUrl: window.location.origin,
    user: {
      id: 'calliope-campus',
      label: 'Calliope Campus',
    },
    async onSave() {
      postToParent('umo:saved', { content: serializeContent() })
      return true
    },
    async onFileUpload(file) {
      if (!file) {
        throw new Error('No file found to upload')
      }

      return {
        id: crypto.randomUUID(),
        url: file.url || URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size,
      }
    },
    onFileDelete(id, url) {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
      console.debug('Deleted file from Umo editor', id, url)
    },
  }
}

function postToParent(type, payload = {}) {
  window.parent.postMessage(
    {
      source: 'calliope-campus-umo',
      type,
      instanceId,
      payload,
    },
    '*',
  )
}

function isTiptapDocument(value) {
  return !!value && typeof value === 'object' && value.type === 'doc'
}

function normalizeIncomingContent(value) {
  if (!value || typeof value !== 'object') {
    return '<p></p>'
  }

  if (isTiptapDocument(value.json)) {
    return value.json
  }

  if (typeof value.html === 'string' && value.html.trim()) {
    return value.html
  }

  if (typeof value.text === 'string' && value.text.trim()) {
    return `<p>${value.text}</p>`
  }

  return '<p></p>'
}

function serializeContent() {
  const content = {
    html: editorRef.value?.getHTML?.() || '',
    json: editorRef.value?.getJSON?.() || null,
    text: editorRef.value?.getText?.() || '',
    version: 1,
  }

  return JSON.parse(JSON.stringify(content))
}

function toPlainObject(value) {
  if (value == null) {
    return value
  }

  return JSON.parse(JSON.stringify(value))
}

function getSafeDocumentTitle(value, fallback) {
  const title = String(value || '').trim()
  return title || fallback
}

function serializeFrameContent(value) {
  return {
    key: options.value.editorKey,
    content: toPlainObject(value),
  }
}

function syncStoredLocale(locale) {
  if (typeof locale !== 'string' || !locale.trim()) {
    return
  }

  window.localStorage.setItem('umo-editor:locale', locale)
}

function applyFrameState(payload, { syncContent = false } = {}) {
  const title = getSafeDocumentTitle(payload.title, options.value.document.title)
  const disableExtensions = Array.isArray(payload.disableExtensions)
    ? Array.from(
        new Set(
          payload.disableExtensions
            .filter((value) => typeof value === 'string')
            .map((value) => value.trim())
            .filter(Boolean),
        ),
      )
    : Array.isArray(options.value.disableExtensions)
      ? options.value.disableExtensions
      : []
  const nextOptions = {
    ...options.value,
    editorKey: payload.key || options.value.editorKey,
    locale: payload.locale || options.value.locale,
    disableExtensions,
    document: {
      ...options.value.document,
      title,
      readOnly: Boolean(payload.readonly),
      content: syncContent ? normalizeIncomingContent(payload.content) : options.value.document.content,
    },
  }

  syncStoredLocale(nextOptions.locale)
  options.value = nextOptions

  if (!hasReceivedInit.value) {
    hasReceivedInit.value = true
    return
  }

  if (!editorRef.value) {
    return
  }

  editorRef.value.setReadOnly?.(nextOptions.document.readOnly)
  editorRef.value.setDocument?.({
    title,
    markdown: true,
    spellcheck: true,
    bubbleMenu: true,
    blockMenu: true,
  })

  if (syncContent) {
    editorRef.value.setContent?.(normalizeIncomingContent(payload.content), {
      emitUpdate: false,
      focusPosition: false,
    })
  }
}

function handleMessage(event) {
  const data = event.data
  if (!data || data.source !== 'calliope-campus' || data.instanceId !== instanceId) {
    return
  }

  if (data.type === 'umo:init') {
    applyFrameState(data.payload || {}, { syncContent: true })
    return
  }

  if (data.type === 'umo:update-content') {
    applyFrameState(data.payload || {}, { syncContent: true })
    return
  }

  if (data.type === 'umo:update-props') {
    applyFrameState(data.payload || {}, { syncContent: false })
  }
}

function handleCreated() {
  postToParent('umo:ready')
}

function handleChanged() {
  postToParent('umo:changed', serializeFrameContent(serializeContent()))
}

function handleSaved() {
  postToParent('umo:saved', serializeFrameContent(serializeContent()))
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  postToParent('umo:ready')
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style>
html,
body,
#app {
  margin: 0;
  height: 100%;
}

body {
  overflow: hidden;
  background: #fff;
}

.umo-shell {
  height: 100%;
}
</style>
