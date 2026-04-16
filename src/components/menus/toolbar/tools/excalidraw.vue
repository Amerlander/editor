<template>
  <menus-button
    ico="hand-drawn"
    :text="isEditing ? t('tools.excalidraw.edit') : t('tools.excalidraw.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      :confirm-btn="isEditing ? t('tools.excalidraw.update') : t('tools.excalidraw.insert')"
      :cancel-btn="t('dialog.cancel')"
      destroy-on-close
      class="umo-excalidraw-dialog"
      mode="full-screen"
      @confirm="setExcalidraw"
      @close="dialogVisible = false"
    >
      <template #header>
        <icon name="hand-drawn" />
        {{ t('tools.excalidraw.title') }}
      </template>

      <div class="umo-excalidraw-toolbar">
        <menus-button
          ico="node-delete"
          :text="t('tools.excalidraw.clear')"
          @menu-click="clearScene"
        />
      </div>

      <div class="umo-excalidraw-container">
        <div v-if="isLoading" class="umo-excalidraw-state">
          <t-loading :text="t('tools.excalidraw.loading')" size="small" />
        </div>
        <div v-else-if="mountError" class="umo-excalidraw-state is-error">
          {{ mountError }}
        </div>
        <div ref="editorMountRef" class="umo-excalidraw-mount"></div>
      </div>

      <t-checkbox v-if="isEditing" class="umo-excalidraw-keep-size" v-model="keepSize">
        {{ t('tools.excalidraw.keepSize') }}
      </t-checkbox>
    </modal>
  </menus-button>
</template>

<script setup>
import { getSelectionNode } from '@/utils/selection'
import { shortId } from '@/utils/short-id'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const editor = inject('editor')
const container = inject('container')

const EXCALIDRAW_BACKGROUND = '#ffffff'
const MAX_EMBED_WIDTH = 600

let dialogVisible = $ref(false)
let isLoading = $ref(false)
let mountError = $ref('')
let keepSize = $ref(false)
let excalidrawApi = $ref(null)
let currentScene = $ref(createEmptyScene())

const isEditing = computed(() => Boolean(props.content))
const editorMountRef = $ref(null)

let reactRoot = null
let excalidrawRuntimePromise

function createEmptyScene() {
  return {
    elements: [],
    appState: {
      viewBackgroundColor: EXCALIDRAW_BACKGROUND,
    },
    files: {},
  }
}

function cloneScene(scene = {}) {
  return JSON.parse(
    JSON.stringify({
      elements: Array.isArray(scene.elements) ? scene.elements : [],
      appState: scene.appState || {},
      files: scene.files || {},
    }),
  )
}

function normalizeScene(scene = {}) {
  const nextScene = cloneScene(scene)
  if (!nextScene.appState?.viewBackgroundColor) {
    nextScene.appState = {
      ...nextScene.appState,
      viewBackgroundColor: EXCALIDRAW_BACKGROUND,
    }
  }
  return nextScene
}

function parseScene(content) {
  if (!content) {
    return createEmptyScene()
  }

  try {
    const parsed = JSON.parse(content)
    return normalizeScene({
      elements: parsed?.elements,
      appState: parsed?.appState,
      files: parsed?.files,
    })
  } catch {
    return createEmptyScene()
  }
}

function serializeScene(scene) {
  return JSON.stringify({
    type: 'excalidraw',
    version: 1,
    elements: scene.elements,
    appState: scene.appState,
    files: scene.files,
  })
}

function hasDrawableElements(scene) {
  return scene.elements?.some((element) => !element.isDeleted)
}

function cleanupReactRoot() {
  excalidrawApi = null
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
  }
}

function loadExcalidrawRuntime() {
  if (!excalidrawRuntimePromise) {
    excalidrawRuntimePromise = Promise.all([
      import('react'),
      import('react-dom/client'),
      import('@excalidraw/excalidraw'),
      import('@excalidraw/excalidraw/index.css'),
    ]).then(([reactModule, reactDomModule, excalidrawModule]) => ({
      React: reactModule.default || reactModule,
      createRoot: reactDomModule.createRoot,
      Excalidraw: excalidrawModule.Excalidraw,
      exportToBlob: excalidrawModule.exportToBlob,
    }))
  }
  return excalidrawRuntimePromise
}

async function mountExcalidraw(scene) {
  if (!editorMountRef) {
    return
  }

  cleanupReactRoot()
  isLoading = true
  mountError = ''

  try {
    const { React, createRoot, Excalidraw } = await loadExcalidrawRuntime()
    const initialScene = normalizeScene(scene)

    currentScene = initialScene
    reactRoot = createRoot(editorMountRef)
    reactRoot.render(
      React.createElement(
        'div',
        { className: 'umo-excalidraw-host' },
        React.createElement(Excalidraw, {
          initialData: initialScene,
          excalidrawAPI: (api) => {
            excalidrawApi = api
            if (api) {
              isLoading = false
              mountError = ''
            }
          },
          onChange: (elements, appState, files) => {
            currentScene = normalizeScene({
              elements,
              appState,
              files,
            })
          },
        }),
      ),
    )
  } catch (error) {
    mountError = error?.message || t('tools.excalidraw.loadError')
    isLoading = false
  }
}

function getSceneSnapshot() {
  if (!excalidrawApi) {
    return normalizeScene(currentScene)
  }

  return normalizeScene({
    elements: excalidrawApi.getSceneElements?.() || [],
    appState: excalidrawApi.getAppState?.() || {},
    files: excalidrawApi.getFiles?.() || {},
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function getImageSize(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () =>
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
      })
    image.onerror = reject
    image.src = src
  })
}

function constrainImageSize(width, height, maxWidth = MAX_EMBED_WIDTH) {
  const safeWidth = Number(width) || 0
  const safeHeight = Number(height) || 0

  if (!safeWidth || !safeHeight) {
    return {
      width: safeWidth,
      height: safeHeight,
    }
  }

  if (safeWidth <= maxWidth) {
    return {
      width: safeWidth,
      height: safeHeight,
    }
  }

  const scale = maxWidth / safeWidth

  return {
    width: Math.round(safeWidth * scale),
    height: Math.round(safeHeight * scale),
  }
}

async function exportScene(scene) {
  const { exportToBlob } = await loadExcalidrawRuntime()
  const blob = await exportToBlob({
    elements: scene.elements,
    appState: {
      ...scene.appState,
      exportBackground: scene.appState?.exportBackground ?? true,
      exportWithDarkMode: scene.appState?.exportWithDarkMode ?? false,
      viewBackgroundColor:
        scene.appState?.viewBackgroundColor || EXCALIDRAW_BACKGROUND,
    },
    files: scene.files,
    mimeType: 'image/png',
  })
  const src = await blobToDataUrl(blob)
  const { width, height } = await getImageSize(src)
  return { src, width, height }
}

async function clearScene() {
  const emptyScene = createEmptyScene()
  currentScene = emptyScene
  await nextTick()
  await mountExcalidraw(emptyScene)
}

async function setExcalidraw() {
  const scene = getSceneSnapshot()

  if (!hasDrawableElements(scene)) {
    useMessage('error', {
      attach: container,
      content: t('tools.excalidraw.notEmpty'),
    })
    return
  }

  isLoading = true

  try {
    const image = await exportScene(scene)
    const { attrs } = getSelectionNode(editor.value) || {}
    const constrainedSize = constrainImageSize(image.width, image.height)
    const width = keepSize ? attrs?.width || constrainedSize.width : constrainedSize.width
    const height = keepSize ? attrs?.height || constrainedSize.height : constrainedSize.height

    editor.value
      ?.chain()
      .focus()
      .setImage(
        {
          id: shortId(10),
          type: 'excalidraw',
          src: image.src,
          content: serializeScene(scene),
          width,
          height,
          equalProportion: true,
        },
        isEditing.value,
      )
      .run()

    dialogVisible = false
  } catch (error) {
    useMessage('error', {
      attach: container,
      content: error?.message || t('tools.excalidraw.exportError'),
    })
  } finally {
    isLoading = false
  }
}

watch(
  () => dialogVisible,
  async (visible) => {
    if (!visible) {
      isLoading = false
      mountError = ''
      cleanupReactRoot()
      return
    }

    keepSize = false
    currentScene = parseScene(props.content)
    await nextTick()
    await mountExcalidraw(currentScene)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cleanupReactRoot()
})
</script>

<style lang="less">
.umo-excalidraw-dialog {
  .t-dialog {
    padding: 0 !important;

    &__header {
      background: var(--umo-color-white);
      height: var(--td-comp-size-xxxl);
    }

    &__body {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: calc(100vh - var(--td-comp-size-xxxl));
    }
  }
}

.umo-excalidraw-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--td-border-level-1-color);
  background: var(--umo-color-white);
}

.umo-excalidraw-container {
  position: relative;
  flex: 1;
  min-height: 0;
  background: var(--umo-color-white);
}

.umo-excalidraw-mount,
.umo-excalidraw-host {
  width: 100%;
  height: 100%;
}

.umo-excalidraw-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: rgba(255, 255, 255, 0.92);
  color: var(--umo-text-color-light);

  &.is-error {
    color: var(--td-error-color);
    padding: 16px;
    text-align: center;
  }
}

.umo-excalidraw-keep-size {
  padding: 12px 16px 16px;
  background: var(--umo-color-white);
}
</style>