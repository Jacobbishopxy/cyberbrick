
import { request } from "umi"


const base = `/gateway`
export const sendInvitation = async (param: API.Invitation): Promise<void> => {
    return request(`${base}/api/auth/invitation`, {
        method: "post",
        data: param
    })
}

export const register = async (id: string): Promise<void> => {
    return request(`${base}/api/auth/register/${id}`)
}

export const login = async (param: API.Login) => {
    return request(`${base}/api/auth`, { method: "post", credentials: 'include', data: param })
}

export const check = async (): Promise<API.LoginCheckData> => {
    return request(`${base}/api/auth`, { credentials: 'include' })
}

export const logout = async (): Promise<void> => {
    return request(`${base}/api/auth`, { credentials: 'include', method: "delete" })
}
