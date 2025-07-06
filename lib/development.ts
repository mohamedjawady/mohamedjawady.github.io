export const isDevelopment = process.env.NODE_ENV === 'development'

export function canAccessDrafts(): boolean {
  return isDevelopment || process.env.SHOW_DRAFTS === 'true'
}
