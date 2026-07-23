<template>
  <div
    :class="{
      'program-day-section': showDailySummary,
      'program-day-with-entry-breaks': pageBreakBetweenScheduleEntries,
    }"
  >
    <day-summary
      v-if="showDailySummary"
      :day="day"
      :schedule-entries="summaryScheduleEntries"
    />

    <div v-if="showActivities">
      <div
        v-for="scheduleEntry in scheduleEntries"
        :key="scheduleEntry.id"
        :class="{ 'schedule-entry-page': pageBreakBetweenScheduleEntries }"
      >
        <schedule-entry :schedule-entry="scheduleEntry" :index="index" />
      </div>
    </div>
  </div>
</template>

<script>
import DaySummary from '~/components/DaySummary.vue'

export default {
  components: { DaySummary },
  props: {
    day: { type: Object, required: true },
    filter: { type: Object, default: () => ({}) },
    showDailySummary: { type: Boolean, required: true },
    pageBreakBetweenScheduleEntries: { type: Boolean, default: false },
    showActivities: { type: Boolean, required: true },
    index: { type: Number, required: true },
    scheduleEntries: { type: Array, required: true },
    summaryScheduleEntries: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.program-day-section + .program-day-section {
  break-before: page;
}

.program-day-with-entry-breaks + .program-day-with-entry-breaks {
  break-before: page;
}

.schedule-entry-page + .schedule-entry-page {
  break-before: page;
}
</style>
