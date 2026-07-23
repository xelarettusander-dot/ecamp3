<template>
  <Page
    v-for="pageIndex in pageCount"
    :id="pageIndex === 1 ? id : undefined"
    :key="pageIndex"
    :size="config.options.pageSize || 'A4'"
    :bookmark="pageIndex === 1 ? $tc('print.notesPages.title') : undefined"
    class="page notes-pages-page"
  >
    <slot />
    <TocSectionStartMarker v-if="pageIndex === 1" :id="id" />
    <View v-if="style === 'lined'" class="notes-pages-lines">
      <View v-for="line in lineCount" :key="line" class="notes-pages-line" />
    </View>
  </Page>
</template>
<script>
import PdfComponent from '@/pdf/PdfComponent.js'
import TocSectionStartMarker from '../TocSectionStartMarker.vue'

export default {
  name: 'NotesPages',
  components: { TocSectionStartMarker },
  extends: PdfComponent,
  props: {
    content: { type: Object, required: true },
    config: { type: Object, required: true },
  },
  computed: {
    pageCount() {
      return this.content.options?.pageCount || 1
    },
    style() {
      return this.content.options?.style || 'lined'
    },
    lineCount() {
      return 28
    },
  },
}
</script>
<style lang="react-pdf">
.notes-pages-lines {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.notes-pages-line {
  border-bottom: 0.5pt solid #bbbbbb;
  height: 18pt;
  width: 100%;
}
</style>
