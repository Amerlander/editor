<template>
  <modal
    :visible="visible"
    width="300px"
    :footer="false"
    @close="emits('close')"
  >
    <template #header>
      <icon name="copyright" />
      {{ t('about.title') }}
    </template>
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 2;
        padding: 30px 0 0;
      "
    >
      <img src="@/assets/images/logo.svg" width="160" style="display: flex" />
      <p>
        {{ t('about.version') }}: v{{ version }} ({{ t('about.openSource') }})
      </p>
      <p
        style="font-size: 12px; text-align: center"
        v-html="t('about.forkNotice')"
      ></p>
      <t-divider>{{ t('about.thanks') }}</t-divider>
      <p style="text-align: center; font-size: 12px; padding: 0 10px">
        <a href="https://github.com/Cassielxd" target="_blank">Cassielxd</a>
        ·
        <a href="https://github.com/china-wangxu" target="_blank">china-wangxu</a>
        ·
        <a href="https://github.com/Goldziher" target="_blank">Na'aman Hirschfeld</a>
        ·
        <a href="https://github.com/SevenDreamYang" target="_blank">SevenDreamYang</a>
        ·
        <a href="https://github.com/ChenErik" target="_blank">ChenErik</a>
        ·
        <a href="https://github.com/SerRashin" target="_blank">SerRashin</a>
        ·
        <a href="https://github.com/SunnyWisozk" target="_blank">Sunny Wisozk</a>
        ·
        <a href="https://github.com/xuzhenjun130k" target="_blank">Sherman Xu</a>
        ·
        <a href="https://github.com/vace" target="_blank">vace</a>
        ·
        <a href="https://github.com/Mikasa33" target="_blank">Mikasa33</a>
      </p>
      <t-divider></t-divider>
    </div>
  </modal>
</template>

<script setup>
import { version } from '@/utils/copyright'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['close'])
</script>

<style lang="less" scoped>
img {
  margin-bottom: 30px;
}
p {
  margin: 3px 0 !important;
  line-height: 1.5;
  a,
  :deep(a) {
    color: var(--umo-primary-color);
    font-weight: 500;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
:deep(.umo-divider) {
  margin: 30px 0 15px;
  font-size: 12px;
}
</style>
