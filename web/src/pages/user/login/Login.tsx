import { Modal } from "antd"
import { useState } from "react"
import { Redirect } from "react-router-dom"
import { Login } from "../components"
import * as auth from "../services/auth"
interface LoginPageProps {
    setLogined: React.Dispatch<React.SetStateAction<boolean>>
}
export const LoginPage = (props: LoginPageProps) => {
    const [succeeded, setSucceeded] = useState(false)

    const onFinish = async (value: API.Login) => {
        return auth.login({ email: value.email, password: value.password })
            .then(_ => {
                props.setLogined(true)
                setSucceeded(true)
            })
    }
    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo)
    }
    const registrationHref = "#/registration"
    const forgetPasswordHref = "/"

    return succeeded ? <Redirect to="/" /> :
        <Login
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            registrationHref={registrationHref}
            forgetPasswordHref={forgetPasswordHref}
        />
}
