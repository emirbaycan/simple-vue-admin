import { Ref, ref, unref } from 'vue'
import { getItems, addItem, updateItem, removeItem, Sorting, Pagination } from '../../../data/pages/testimonials'
import { Testimonial } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'created_at', sortingOrder: 'desc' })

export const useItems = (options?: { sorting?: Ref<Sorting>; pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const items = ref<Testimonial[]>([])

  const { sorting = makeSortingRef(), pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getItems({
      ...unref(sorting),
      ...unref(pagination),
    })
    items.value = data as Testimonial[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  fetch()

  return {
    isLoading,

    items,

    fetch,

    async add(project: Testimonial) {
      isLoading.value = true
      await addItem({
        ...project,
      })
      await fetch()
      isLoading.value = false
    },

    async update(project: Testimonial) {
      isLoading.value = true
      await updateItem({
        ...project,
      })
      await fetch()
      isLoading.value = false
    },

    async remove(project: Testimonial) {
      isLoading.value = true
      await removeItem({
        ...project,
      })
      await fetch()
      isLoading.value = false
    },

    pagination,
    sorting,
  }
}
