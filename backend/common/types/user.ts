export interface User {
  id: string
  role: 'anonymous' | 'system'
}

export function createAnonymousUser (): User {
  return { role: 'anonymous', id: 'anonymous' }
}

export function userToString (user: User): string {
  return `${user.role}::${user.id}`
}
