/**
 * Page-break rules for Program PDF export between schedule entries.
 *
 * Options shape:
 * - pageBreakBetweenScheduleEntries: boolean (break before every entry)
 * - pageBreakBeforeCategories: category URI[] (break before entries of these categories)
 * - pageBreakAfterCategories: category URI[] (break before the entry after these categories)
 */

export function categoryUriOfScheduleEntry(scheduleEntry) {
  try {
    return scheduleEntry.activity().category()._meta.self
  } catch {
    return null
  }
}

export function hasProgramPageBreaks(options = {}) {
  if (options.pageBreakBetweenScheduleEntries) return true
  return (
    (options.pageBreakBeforeCategories?.length ?? 0) > 0 ||
    (options.pageBreakAfterCategories?.length ?? 0) > 0
  )
}

export function shouldBreakBeforeScheduleEntry(current, previous, options = {}) {
  if (!previous) return false
  if (options.pageBreakBetweenScheduleEntries) return true

  const currentCategory = categoryUriOfScheduleEntry(current)
  const previousCategory = categoryUriOfScheduleEntry(previous)

  if (
    currentCategory &&
    (options.pageBreakBeforeCategories || []).includes(currentCategory)
  ) {
    return true
  }

  if (
    previousCategory &&
    (options.pageBreakAfterCategories || []).includes(previousCategory)
  ) {
    return true
  }

  return false
}

/**
 * Split schedule entries into page chunks according to page-break options.
 * @returns {Array<Array>} chunks of schedule entries
 */
export function chunkScheduleEntriesByPageBreaks(scheduleEntries, options = {}) {
  if (!scheduleEntries?.length) return []

  const chunks = []
  let currentChunk = []

  for (let i = 0; i < scheduleEntries.length; i++) {
    const entry = scheduleEntries[i]
    const previous = i > 0 ? scheduleEntries[i - 1] : null
    if (previous && shouldBreakBeforeScheduleEntry(entry, previous, options)) {
      chunks.push(currentChunk)
      currentChunk = [entry]
    } else {
      currentChunk.push(entry)
    }
  }

  if (currentChunk.length) chunks.push(currentChunk)
  return chunks
}

export function repairCategoryUriList(uris, camp) {
  const known = (camp.categories?.().items || []).map((category) => category._meta.self)
  if (!Array.isArray(uris)) return []
  return uris.filter((uri) => known.includes(uri))
}
