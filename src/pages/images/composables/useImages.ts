import { Ref, ref, unref, watch } from 'vue'
import {
  getItems,
  updateItem,
  addItem,
  removeItem,
  type Filters,
  Pagination,
  Sorting,
} from '../../../data/pages/images'
import { Image } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ search: '' })

export const useItems = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const items = ref<Image[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getItems({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    items.value = data

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,

    filters,
    sorting,
    pagination,

    items,

    fetch,

    async add(item: Image) {
      isLoading.value = true
      await addItem(item)
      await fetch()
      isLoading.value = false
    },

    async update(item: Image) {
      isLoading.value = true
      await updateItem(item)
      await fetch()
      isLoading.value = false
    },

    async remove(item: Image) {
      isLoading.value = true
      await removeItem(item)
      await fetch()
      isLoading.value = false
    },
  }
}
