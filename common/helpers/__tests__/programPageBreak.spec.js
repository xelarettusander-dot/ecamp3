import { describe, expect, it } from 'vitest'
import {
  categoryUriOfScheduleEntry,
  chunkScheduleEntriesByPageBreaks,
  hasProgramPageBreaks,
  repairCategoryUriList,
  shouldBreakBeforeScheduleEntry,
} from '../programPageBreak.js'

const entry = (categoryUri) => ({
  activity: () => ({
    category: () => ({
      _meta: { self: categoryUri },
    }),
  }),
})

describe('programPageBreak', () => {
  describe('hasProgramPageBreaks', () => {
    it('is false by default', () => {
      expect(hasProgramPageBreaks({})).toBe(false)
      expect(hasProgramPageBreaks({ pageBreakBetweenScheduleEntries: false })).toBe(
        false
      )
    })

    it('is true when breaking between all entries', () => {
      expect(hasProgramPageBreaks({ pageBreakBetweenScheduleEntries: true })).toBe(true)
    })

    it('is true when category lists are non-empty', () => {
      expect(hasProgramPageBreaks({ pageBreakBeforeCategories: ['/categories/1'] })).toBe(
        true
      )
      expect(hasProgramPageBreaks({ pageBreakAfterCategories: ['/categories/1'] })).toBe(
        true
      )
    })
  })

  describe('shouldBreakBeforeScheduleEntry', () => {
    const a = entry('/categories/a')
    const b = entry('/categories/b')

    it('never breaks before the first entry', () => {
      expect(shouldBreakBeforeScheduleEntry(a, null, { pageBreakBetweenScheduleEntries: true })).toBe(
        false
      )
    })

    it('breaks before every entry when pageBreakBetweenScheduleEntries is true', () => {
      expect(
        shouldBreakBeforeScheduleEntry(b, a, { pageBreakBetweenScheduleEntries: true })
      ).toBe(true)
    })

    it('breaks before listed categories', () => {
      expect(
        shouldBreakBeforeScheduleEntry(b, a, {
          pageBreakBeforeCategories: ['/categories/b'],
        })
      ).toBe(true)
      expect(
        shouldBreakBeforeScheduleEntry(b, a, {
          pageBreakBeforeCategories: ['/categories/a'],
        })
      ).toBe(false)
    })

    it('breaks after listed categories', () => {
      expect(
        shouldBreakBeforeScheduleEntry(b, a, {
          pageBreakAfterCategories: ['/categories/a'],
        })
      ).toBe(true)
      expect(
        shouldBreakBeforeScheduleEntry(b, a, {
          pageBreakAfterCategories: ['/categories/b'],
        })
      ).toBe(false)
    })
  })

  describe('chunkScheduleEntriesByPageBreaks', () => {
    const a = entry('/categories/a')
    const b = entry('/categories/b')
    const c = entry('/categories/c')

    it('returns a single chunk when no breaks apply', () => {
      expect(chunkScheduleEntriesByPageBreaks([a, b, c], {})).toEqual([[a, b, c]])
    })

    it('puts each entry in its own chunk when breaking between all', () => {
      expect(
        chunkScheduleEntriesByPageBreaks([a, b, c], {
          pageBreakBetweenScheduleEntries: true,
        })
      ).toEqual([[a], [b], [c]])
    })

    it('chunks by before-category rules', () => {
      expect(
        chunkScheduleEntriesByPageBreaks([a, b, c], {
          pageBreakBeforeCategories: ['/categories/b'],
        })
      ).toEqual([[a], [b, c]])
    })

    it('chunks by after-category rules', () => {
      expect(
        chunkScheduleEntriesByPageBreaks([a, b, c], {
          pageBreakAfterCategories: ['/categories/a'],
        })
      ).toEqual([[a], [b, c]])
    })
  })

  describe('categoryUriOfScheduleEntry', () => {
    it('reads the category URI', () => {
      expect(categoryUriOfScheduleEntry(entry('/categories/x'))).toBe('/categories/x')
    })
  })

  describe('repairCategoryUriList', () => {
    const camp = {
      categories: () => ({
        items: [{ _meta: { self: '/categories/1' } }, { _meta: { self: '/categories/2' } }],
      }),
    }

    it('filters unknown URIs and repairs invalid values', () => {
      expect(repairCategoryUriList(null, camp)).toEqual([])
      expect(
        repairCategoryUriList(['/categories/1', '/categories/missing', '/categories/2'], camp)
      ).toEqual(['/categories/1', '/categories/2'])
    })
  })
})
