// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {}
  return {
    canOnline: process.env.DATA_ENV === 'offline',
    canAdmin: currentUser && currentUser.access === 'admin',
  }
}
