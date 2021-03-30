import {request} from "umi"

export interface LoginParamsType {
  username: string
  password: string
  mobile: string
  captcha: string
  type: string
}

export async function login(body: API.LoginParams, options?: {[key: string]: any}) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string
  },
  options?: {[key: string]: any},
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

export async function outLogin() {
  return request('/api/login/outLogin')
}
