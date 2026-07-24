<template>
  <div class="px-md-4 flex-grow-1 d-flex flex-column justify-content-between">
    <e-select
      v-model="options.periods"
      :items="periods"
      path="periods"
      :label="$t('print.config.periods')"
      multiple
      :variant="periods.length === 1 ? 'plain' : 'underlined'"
      :readonly="periods.length === 1"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
    <e-checkbox
      v-model="options.dayOverview"
      path="dayOverview"
      :label="$t('components.print.config.programConfig.dayOverview')"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
    <e-checkbox
      v-if="options.dayOverview"
      v-model="options.pageBreakAfterDayOverview"
      path="pageBreakAfterDayOverview"
      :label="$t('components.print.config.programConfig.pageBreakAfterDayOverview')"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
    <e-checkbox
      v-model="options.pageBreakBetweenScheduleEntries"
      path="pageBreakBetweenScheduleEntries"
      :label="$t('components.print.config.programConfig.pageBreakBetweenScheduleEntries')"
      @update:model-value="$emit('update:modelValue', modelValue)"
    />
    <template v-if="!options.pageBreakBetweenScheduleEntries">
      <e-select
        v-model="options.pageBreakBeforeCategories"
        :items="categoryUris"
        path="pageBreakBeforeCategories"
        multiple
        :label="$t('components.print.config.programConfig.pageBreakBeforeCategories')"
        @update:model-value="$emit('update:modelValue', modelValue)"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #title>
              <CategoryChip :category="categoriesByUri[item.value]" dense class="mr-1" />
              {{ categoriesByUri[item.value]?.name }}
            </template>
          </v-list-item>
        </template>
        <template #selection="{ item }">
          <div class="v-select__selection">
            <CategoryChip :category="categoriesByUri[item.value]" dense class="mr-1" />
            {{ categoriesByUri[item.value]?.name }}
          </div>
        </template>
      </e-select>
      <e-select
        v-model="options.pageBreakAfterCategories"
        :items="categoryUris"
        path="pageBreakAfterCategories"
        multiple
        :label="$t('components.print.config.programConfig.pageBreakAfterCategories')"
        @update:model-value="$emit('update:modelValue', modelValue)"
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            <template #title>
              <CategoryChip :category="categoriesByUri[item.value]" dense class="mr-1" />
              {{ categoriesByUri[item.value]?.name }}
            </template>
          </v-list-item>
        </template>
        <template #selection="{ item }">
          <div class="v-select__selection">
            <CategoryChip :category="categoriesByUri[item.value]" dense class="mr-1" />
            {{ categoriesByUri[item.value]?.name }}
          </div>
        </template>
      </e-select>
    </template>
    <div class="flex-grow-1"></div>
    <DialogScheduleEntryFilter
      :camp="camp"
      :filter-fn="filterFn()"
      :model-value="options.filter"
      hide-period-filter
      @update:model-value="updateFilter"
    />
  </div>
</template>

<script>
import { filterMatchScheduleEntry } from '@/common/helpers/filterMatchScheduleEntry.js'
import { repairCategoryUriList } from '@/common/helpers/programPageBreak.js'
import DialogScheduleEntryFilter from './DialogScheduleEntryFilter.vue'
import CategoryChip from '@/components/generic/CategoryChip.vue'
import repairFilterConfig from '../../program/repairFilterConfig.js'

export default {
  name: 'ProgramConfig',
  components: { DialogScheduleEntryFilter, CategoryChip },
  props: {
    modelValue: { type: Object, required: true },
    camp: { type: Object, required: true },
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
    periods() {
      return this.camp.periods().items.map((p) => ({
        value: p._meta.self,
        text: p.description,
      }))
    },
    categoriesByUri() {
      return Object.fromEntries(
        this.camp.categories().items.map((category) => [category._meta.self, category])
      )
    },
    categoryUris() {
      return Object.keys(this.categoriesByUri)
    },
    selectedPeriods() {
      if (!this.options.periods) return this.camp.periods().items
      return this.camp.periods().items.filter((period) => {
        return this.options.periods.includes(period._meta.self)
      })
    },
    selectedScheduleEntries() {
      return this.selectedPeriods.flatMap((period) => period.scheduleEntries().items)
    },
  },
  methods: {
    filterFn() {
      return (filter) =>
        this.selectedScheduleEntries.filter((scheduleEntry) =>
          filterMatchScheduleEntry(scheduleEntry, filter)
        )
    },
    updateFilter(newFilter) {
      this.options.filter = newFilter
      this.$emit('update:modelValue', this.options)
    },
  },
  defaultOptions(camp) {
    return {
      periods:
        camp.periods().items.length === 1 ? [camp.periods().items[0]._meta.self] : [],
      dayOverview: true,
      pageBreakAfterDayOverview: false,
      pageBreakBetweenScheduleEntries: false,
      pageBreakBeforeCategories: [],
      pageBreakAfterCategories: [],
      filter: repairFilterConfig(null, camp),
    }
  },
  design: {
    multiple: true,
  },
  repairConfig(config, camp) {
    if (!config.options) config.options = {}
    const knownPeriods = camp.periods().items.map((p) => p._meta.self)
    if (knownPeriods.length === 1) {
      config.options.periods = [camp.periods().items[0]._meta.self]
    } else {
      if (!config.options.periods) config.options.periods = []
      config.options.periods = config.options.periods.filter((period) => {
        return knownPeriods.includes(period)
      })
    }
    if (typeof config.options.dayOverview !== 'boolean') config.options.dayOverview = true
    if (typeof config.options.pageBreakAfterDayOverview !== 'boolean') {
      config.options.pageBreakAfterDayOverview = false
    }
    if (typeof config.options.pageBreakBetweenScheduleEntries !== 'boolean') {
      config.options.pageBreakBetweenScheduleEntries = false
    }
    config.options.pageBreakBeforeCategories = repairCategoryUriList(
      config.options.pageBreakBeforeCategories,
      camp
    )
    config.options.pageBreakAfterCategories = repairCategoryUriList(
      config.options.pageBreakAfterCategories,
      camp
    )
    config.options.filter = repairFilterConfig(config.options.filter, camp)
    return config
  },
}
</script>
