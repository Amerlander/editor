<template>
  <component
    :is="
      h(
        Dialog,
        { ...dialogProps, ref: changeRef },
        $slots,
      )
    "
  />
</template>

<script setup>
import { Dialog } from 'tdesign-vue-next'
import { computed, h, useAttrs } from 'vue'

import { t } from '@/composables/i18n'

const container = inject('container', 'body')
const attrs = useAttrs()
const vm = getCurrentInstance()
const changeRef = (expose) => (vm.expose = expose)

const dialogProps = computed(() => {
  const confirmBtn = attrs.confirmBtn ?? attrs['confirm-btn'] ?? t('dialog.confirm')
  const cancelBtn = attrs.cancelBtn ?? attrs['cancel-btn'] ?? t('dialog.cancel')

  return {
    placement: 'center',
    attach: container,
    ...attrs,
    confirmBtn,
    cancelBtn,
  }
})
</script>
