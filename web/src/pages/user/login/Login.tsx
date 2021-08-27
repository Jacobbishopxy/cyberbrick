import { useState } from "react"
import { Redirect } from "react-router-dom"

import { Login } from "@/components/Login"
import { login } from "@/services/auth"
import { useIntl, useModel, history } from "umi"
import { SelectLang } from "umi"
import Footer from "@/components/Footer"
import styles from './index.less'

import { Link } from "umi"
import { Alert, message, Spin } from "antd"
interface LoginPageProps {
    setLoginState: React.Dispatch<React.SetStateAction<boolean>>
}
const LoginMessage: React.FC<{
    content: string
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
)

const goto = () => {
    if (!history) return
    setTimeout(() => {
        const { query } = history.location
        const { redirect } = query as { redirect: string }
        history.push(redirect || '/')
    }, 10)
}

export const LoginPage = (props: LoginPageProps) => {
    const [submitting, setSubmitting] = useState(false)
    // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({})
    const { initialState, setInitialState } = useModel('@@initialState')

    const intl = useIntl()

    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.()
        if (userInfo) {
            setInitialState({
                ...initialState,
                currentUser: userInfo,
            })
        }
    }
    const handleSubmit = async (value: API.Login) => {
        setSubmitting(true)
        try {
            // 登录
            await login({ email: value.email, password: value.password })
            message.success('登录成功！')
            await fetchUserInfo()
            goto()
            return

            // // 如果失败去设置用户错误信息
            // setUserLoginState(msg)
        } catch (error) {
            message.error('登录失败，请重试！')
        }
        setSubmitting(false)
    }
    //   const {status, type: loginType} = userLoginState

    // const onFinish = async (value: API.Login) => {
    //     return login({ email: value.email, password: value.password })
    //         .then(_ => {
    //             setSucceeded(true)
    //         })
    // }
    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo)
    }
    const registrationHref = "/user/registration"
    const forgetPasswordHref = "/"

    const loginForm = <Login
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        registrationHref={registrationHref}
        forgetPasswordHref={forgetPasswordHref}
    />
    return submitting ? <Redirect to="/" /> :
        <div className={styles.container}>
            <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <Link to="/">
                            <span className={styles.title}>Cyberbrick</span>
                        </Link>
                    </div>
                    <div className={styles.desc}>@Infore</div>
                </div>

                <div className={styles.main}></div>
                {status === 'error' && (
                    <LoginMessage
                        content={intl.formatMessage({
                            id: 'pages.login.accountLogin.errorMessage',
                            defaultMessage: '账户或密码错误（admin/ant.design)',
                        })}
                    />
                )}
                {submitting ? <Spin tip="Loading...">{loginForm}</Spin> : loginForm}
            </div>
            <Footer />
        </div>



}
