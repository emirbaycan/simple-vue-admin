import { Project } from '../../pages/projects/types'

// Simulate API calls
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Array<Project>[number] | undefined
  sortingOrder: 'asc' | 'desc' | null
}

const admin_api_url = import.meta.env.VITE_API_URL + 'api/admin/'

const getSortItem = (obj: any, sortBy: keyof Array<Project>[number]) => {
  if (sortBy === 'created_at') {
    return new Date(obj[sortBy])
  }

  return obj[sortBy]
}

export const getProjects = async (options: Sorting & Pagination) => {
  const response = await fetch(admin_api_url + 'projects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  const result = await response.json()

  const projects: Array<Project> = result.items
  const count = result.count

  if (options.sortBy && options.sortingOrder) {
    projects.sort((a, b) => {
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

  const normalizedProjects = projects.slice((options.page - 1) * options.perPage, options.page * options.perPage)

  return {
    data: normalizedProjects,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: count,
    },
  }
}

export const addProject = async (project: Project) => {
  const response = await fetch(admin_api_url + 'projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(project),
  })

  const result = await response.json()
  const newProject: Project = result.item

  return {
    ...newProject,
  }
}

export const updateProject = async (project: Project) => {
  const response = await fetch(admin_api_url + 'projects/' + project.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(project),
  })

  const result = await response.json()
  const newProject: Project = result.item

  return newProject
}

export const removeProject = async (project: Project) => {
  const response = await fetch(admin_api_url + 'projects/' + project.id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(project),
  })

  const result = await response.json()

  return result
}
