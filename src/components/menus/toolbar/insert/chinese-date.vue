<template>
  <menus-button
    ico="date"
    :text="t('insert.date')"
    menu-type="dropdown"
    huge
    :select-options="options"
    @click="insertDate"
  />
</template>

<script setup>
// 月份
const formDate = (format) => useDateFormat(useNow(), format).value
const { locale } = useI18n()

const localDateFormats = computed(() => {
  if (locale.value === 'de-DE') {
    return {
      primaryDate: 'DD.MM.YYYY',
      primaryDateTime: 'DD.MM.YYYY HH:mm:ss',
      primaryMonth: 'MM.YYYY',
    }
  }

  if (locale.value === 'zh-CN') {
    return {
      primaryDate: 'YYYY年M月D日',
      primaryDateTime: 'YYYY年M月D日 HH:mm:ss',
      primaryMonth: 'YYYY年M月',
    }
  }

  return {
    primaryDate: 'YYYY-MM-DD',
    primaryDateTime: 'YYYY-MM-DD HH:mm:ss',
    primaryMonth: 'YYYY-MM',
  }
})

const isChineseLocale = computed(() => locale.value === 'zh-CN')

const formatDateToChinese = (dateStr) => {
  const replaceDigits = (num) => {
    const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    return num
      .toString()
      .split('')
      .map((n) => digits[Number(n)])
      .join('')
  }

  return dateStr.replace(/\d+/g, (match) => {
    if (match.length === 4) {
      // 年份
      return replaceDigits(match)
    }
    if (match.length === 1) {
      // 月份或日期
      return replaceDigits(match)
    }
    if (match.length === 2) {
      const num1 = match.charAt(0)
      const num2 = match.charAt(1)
      if (num1 === '0') {
        return `${replaceDigits(num1)}十`
      }
      if (num1 === '1') {
        return `十${replaceDigits(num2)}`
      }
      if (num2 === '0') {
        return `${replaceDigits(num1)}十`
      }
      return `${replaceDigits(num1)}十${replaceDigits(num2)}`
    }
    return match // 其他情况不处理
  })
}

const options = computed(() => {
  const { primaryDate, primaryDateTime, primaryMonth } = localDateFormats.value
  const baseOptions = [
    {
      content: t('insert.dateOptions.customDate'),
      format: primaryDate,
      capitalize: false,
      custom: true,
    },
    {
      content: t('insert.dateOptions.customDateTime'),
      value: 'withTime',
      format: primaryDateTime,
      capitalize: false,
      custom: true,
      divider: true,
    },
    {
      content: formDate(primaryDate),
      format: primaryDate,
      capitalize: false,
    },
    { content: formDate('YYYY-MM-DD'), format: 'YYYY-MM-DD', capitalize: false },
    { content: formDate('YYYY/MM/DD'), format: 'YYYY/MM/DD', capitalize: false },
    { content: formDate('YYYY.MM.DD'), format: 'YYYY.MM.DD', capitalize: false },
    { content: formDate(primaryMonth), format: primaryMonth, capitalize: false },
    {
      content: formDate(primaryDateTime),
      value: 'withTime',
      format: primaryDateTime,
      capitalize: false,
      divider: isChineseLocale.value,
    },
  ]

  if (isChineseLocale.value) {
    baseOptions.push(
      {
        content: formatDateToChinese(formDate('YYYY年M月D日')),
        format: 'YYYY年M月D日',
        capitalize: true,
      },
      {
        content: formatDateToChinese(formDate('YYYY年M月')),
        format: 'YYYY年M月',
        capitalize: true,
      },
    )
  }

  return baseOptions
})

const editor = inject('editor')

const insertDate = ({ content, format, capitalize, custom, value }) => {
  if (!content) {
    return
  }
  editor.value
    ?.chain()
    .insertDatetime({
      text: custom ? `[${content}]` : content,
      date: formDate(format), // formDate('YYYY-MM-DD HH:mm:ss'),
      withTime: value === 'withTime',
      format,
      capitalize,
    })
    .focus()
    .run()
}
</script>
