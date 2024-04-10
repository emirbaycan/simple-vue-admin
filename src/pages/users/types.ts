export type UserRole = 'admin' | 'user' | 'owner'

export type User = {
  id: number
  fullname: string
  email: string
  username: string
  role: UserRole
  avatar: string
  notes: string
  active: boolean
}
