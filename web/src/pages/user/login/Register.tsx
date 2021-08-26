import * as auth from "../services/auth"
import { Registration } from "../components/Login"
import { useState } from "react"

// TODO: API from services
export const RegisterPage = () => {
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const onRegister = async (value: API.Invitation) => {
        return auth.sendInvitation({ email: value.email, nickname: value.nickname, password: value.password })
            .then(_ => setRegisterSuccess(true))
    }
    const onRegisterFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo)
    }

    const register = <Registration onFinish={onRegister}
        onFinishFailed={onRegisterFailed}
    />

    const registerSuccessPage = <>
        Register Succeed! Please check your email to confirm the invitation!
    </>
    return (registerSuccess ? registerSuccessPage : register)

}
