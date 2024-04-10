import { Job } from '../../pages/jobs/types'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Array<Job>[number] | undefined
  sortingOrder: 'asc' | 'desc' | null
}

const api_url = import.meta.env.VITE_API_URL

const getSortItem = (obj: any, sortBy: keyof Array<Job>[number]) => {
  if (sortBy === 'created_at') {
    return new Date(obj[sortBy])
  }

  return obj[sortBy]
}

export const getItems = async (options: Sorting & Pagination) => {
  const response = await fetch(api_url + 'jobs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json()

  const items: Array<Job> = result.items
  const count = result.count

  if (options.sortBy && options.sortingOrder) {
    items.sort((a, b) => {
      a = getSortItem(a, options.sortBy!)
      b = getSortItem(b, options.sortBy!)
      if (a < b) {
        return options.sortingOrder === 'asc' ? -1 : 1
      }
      if (a > b) {
        return options.sortingOrder === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const normalizedItems = items.slice((options.page - 1) * options.perPage, options.page * options.perPage)

  return {
    data: normalizedItems,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: count,
    },
  }
}

export const addItem = async (item: Job) => {
  const response = await fetch(api_url + 'jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })

  const result = await response.json()
  const newItem: Job = result.item

  return {
    ...newItem,
  }
}

export const updateItem = async (item: Job) => {
  const response = await fetch(api_url + 'jobs/' + item.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })

  const result = await response.json()
  const newItem: Job = result.item

  return newItem
}

export const removeItem = async (item: Job) => {
  const response = await fetch(api_url + 'jobs/' + item.id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })

  const result = await response.json()

  return result
}
