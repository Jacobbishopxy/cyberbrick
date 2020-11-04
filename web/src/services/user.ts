import {request} from "umi"

export async function query() {
  return request<API.CurrentUser[]>('/api/collection/users')
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/collection/currentUser')
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/collection/notices')
}

export async function queryRandomUnicorn() {
  return request("/api/misc/random-unicorn")
}
