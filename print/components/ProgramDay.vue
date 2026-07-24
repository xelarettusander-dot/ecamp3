<template>
  <div
    :class="{
      'program-day-section': showDailySummary,
      'program-day-break': breakBeforeDay,
    }"
  >
    <day-summary
      v-if="showDailySummary"
      :day="day"
      :schedule-entries="summaryScheduleEntries"
    />

    <div
      v-if="showActivities"
      :class="{ 'program-activities-after-overview': pageBreakAfterDayOverview }"
    >
      <div
        v-for="(scheduleEntry, entryIndex) in scheduleEntries"
        :key="scheduleEntry.id"
        :class="{
          'schedule-entry-break': shouldBreakBeforeEntry(scheduleEntry, entryIndex),
        }"
      >
        <schedule-entry :schedule-entry="scheduleEntry" :index="index" />
      </div>
    </div>
  </div>
</template>

<script>
import DaySummary from '~/components/DaySummary.vue'
import {
  hasProgramPageBreaks,
  shouldBreakBeforeScheduleEntry,
} from '@/common/helpers/programPageBreak.js'

export default {
  components: { DaySummary },
  props: {
    day: { type: Object, required: true },
    filter: { type: Object, default: () => ({}) },
    showDailySummary: { type: Boolean, required: true },
    pageBreakOptions: {
      type: Object,
      default: () => ({
        pageBreakAfterDayOverview: false,
        pageBreakBetweenScheduleEntries: false,
        pageBreakBeforeCategories: [],
        pageBreakAfterCategories: [],
      }),
    },
    previousScheduleEntry: { type: Object, default: null },
    showActivities: { type: Boolean, required: true },
    index: { type: Number, required: true },
    scheduleEntries: { type: Array, required: true },
    summaryScheduleEntries: { type: Array, default: () => [] },
  },
  computed: {
    pageBreakAfterDayOverview() {
      return this.showDailySummary && !!this.pageBreakOptions.pageBreakAfterDayOverview
    },
    breakBeforeDay() {
      if (!hasProgramPageBreaks(this.pageBreakOptions)) return false
      if (!this.previousScheduleEntry || !this.scheduleEntries.length) return false
      return shouldBreakBeforeScheduleEntry(
        this.scheduleEntries[0],
        this.previousScheduleEntry,
        this.pageBreakOptions
      )
    },
  },
  methods: {
    shouldBreakBeforeEntry(scheduleEntry, entryIndex) {
      if (entryIndex === 0) {
        // Day-level break handles the first entry when needed
        return false
      }
      return shouldBreakBeforeScheduleEntry(
        scheduleEntry,
        this.scheduleEntries[entryIndex - 1],
        this.pageBreakOptions
      )
    },
  },
}
</script>

<style scoped>
.program-day-section + .program-day-section {
  break-before: page;
}

.program-day-break {
  break-before: page;
}

.program-activities-after-overview {
  break-before: page;
}

.schedule-entry-break {
  break-before: page;
}
</style>
