import {request} from "umi"

export async function query() {
  return request<API.CurrentUser[]>('/api/users')
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser')
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices')
}

export async function queryRandomUnicorn() {
  return request("/api/misc/random-unicorn")
}
