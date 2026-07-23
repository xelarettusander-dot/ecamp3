<template>
  <div
    v-for="pageIndex in pageCount"
    :key="pageIndex"
    class="tw-break-after-page notes-pages"
    :class="[pageSize, { 'notes-pages--lined': style === 'lined' }]"
  >
    <h1
      v-if="pageIndex === 1"
      :id="`content_${index}_notesPages`"
      class="notes-pages__title"
    >
      {{ $t('print.notesPages.title') }}
    </h1>
    <div v-if="style === 'lined'" class="notes-pages__lines" aria-hidden="true">
      <div v-for="line in lineCount" :key="line" class="notes-pages__line" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfigNotesPages',
  props: {
    options: { type: Object, required: false, default: null },
    camp: { type: Object, required: true },
    config: { type: Object, required: true },
    index: { type: Number, required: true },
    pageSize: { type: String, default: 'a4' },
  },
  computed: {
    pageCount() {
      return this.options?.pageCount || 1
    },
    style() {
      return this.options?.style || 'lined'
    },
    lineCount() {
      return 28
    },
  },
}
</script>

<style scoped>
.notes-pages {
  min-height: 250mm;
}

.notes-pages__title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.notes-pages__lines {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 250mm;
}

.notes-pages__line {
  border-bottom: 1px solid #bbbbbb;
  height: 9mm;
  flex-shrink: 0;
}
</style>
