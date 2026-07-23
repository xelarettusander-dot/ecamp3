<template>
  <div class="px-md-4 flex-grow-1 d-flex flex-column justify-content-between">
    <e-select
      v-model="options.pageCount"
      :items="pageCountItems"
      path="pageCount"
      :label="$t('components.print.config.notesPagesConfig.pageCount')"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
    <e-select
      v-model="options.style"
      :items="styleItems"
      path="style"
      :label="$t('components.print.config.notesPagesConfig.style')"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
  </div>
</template>

<script>
const MIN_PAGE_COUNT = 1
const MAX_PAGE_COUNT = 20
const STYLES = ['lined', 'blank']

export default {
  name: 'NotesPagesConfig',
  props: {
    modelValue: { type: Object, required: true },
  },
  emits: ['update:modelValue'],
  computed: {
    options: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit('update:modelValue', v)
      },
    },
    pageCountItems() {
      return Array.from({ length: MAX_PAGE_COUNT - MIN_PAGE_COUNT + 1 }, (_, i) => {
        const value = i + MIN_PAGE_COUNT
        return { value, text: String(value) }
      })
    },
    styleItems() {
      return STYLES.map((style) => ({
        value: style,
        text: this.$t(`components.print.config.notesPagesConfig.styles.${style}`),
      }))
    },
  },
  defaultOptions() {
    return {
      pageCount: 1,
      style: 'lined',
    }
  },
  design: {
    multiple: true,
  },
  repairConfig(config) {
    if (!config.options) config.options = {}
    const pageCount = Number.parseInt(config.options.pageCount, 10)
    if (
      !Number.isInteger(pageCount) ||
      pageCount < MIN_PAGE_COUNT ||
      pageCount > MAX_PAGE_COUNT
    ) {
      config.options.pageCount = 1
    } else {
      config.options.pageCount = pageCount
    }
    if (!STYLES.includes(config.options.style)) {
      config.options.style = 'lined'
    }
    return config
  },
}
</script>
