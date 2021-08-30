import { check } from "./auth"
import { request } from "umi"

export async function query() {
  return request<API.CurrentUser[]>('/api/users')
}
//TODO: query with cookies; how to get cookie from server
export async function queryCurrent() {
  // return request<API.CurrentUser>('/api/auth')
  return check()
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices')
}

export async function queryRandomUnicorn() {
  return request("/api/misc/random-unicorn")
}
