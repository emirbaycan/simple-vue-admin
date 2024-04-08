import { Ref, ref, unref } from 'vue'
import {
  getProjects,
  addProject,
  updateProject,
  removeProject,
  Sorting,
  Pagination,
} from '../../../data/pages/projects'
import { Project } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'created_at', sortingOrder: 'desc' })

export const useProjects = (options?: { sorting?: Ref<Sorting>; pagination?: Ref<Pagination> }) => {
  const isLoading = ref(false)
  const projects = ref<Project[]>([])

  const { sorting = makeSortingRef(), pagination = makePaginationRef() } = options ?? {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getProjects({
      ...unref(sorting),
      ...unref(pagination),
    })
    projects.value = data as Project[]

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  fetch()

  return {
    isLoading,

    projects,

    fetch,

    async add(project: Project) {
      isLoading.value = true
      await addProject({
        ...project,
      })
      await fetch()
      isLoading.value = false
    },

    async update(project: Project) {
      isLoading.value = true
      await updateProject({
        ...project,
      })
      await fetch()
      isLoading.value = false
    },

    async remove(project: Project) {
      isLoading.value = true
      await removeProject({
        ...project,
      })
      await fetch()
      isLoading.value = false
    },

    pagination,
    sorting,
  }
}
