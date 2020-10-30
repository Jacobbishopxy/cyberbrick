import request from "umi-request"

export async function query() {
  return request<API.CurrentUser[]>('/api/collection/users')
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/collection/currentUser')
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/collection/notices')
}
