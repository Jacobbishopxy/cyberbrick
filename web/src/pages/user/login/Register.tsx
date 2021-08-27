import * as auth from "@/services/auth"
import { Registration } from "@/components/Login"
import { useState } from "react"
import { Link, SelectLang } from "umi"
import Footer from "@/components/Footer"
import styles from './index.less'
// TODO: API from services
export const RegisterPage = () => {
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const onRegister = async (value: API.Invitation) => {
        return auth.sendInvitation({ email: value.email, nickname: value.nickname, password: value.password })
            .then((_: any) => setRegisterSuccess(true))
    }
    const onRegisterFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo)
    }

    const register = <Registration onFinish={onRegister}
        onFinishFailed={onRegisterFailed}
    />


    const registerSuccessPage = <div className={styles.info}>
        Register Succeed! Please check your email to confirm the invitation!
    </div>

    return <div className={styles.container}>
        <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
        <div className={styles.content}>
            <div className={styles.top}>
                <div className={styles.header}>
                    <Link to="/">
                        <span className={styles.title}>Registration</span>
                    </Link>
                </div>
                <div className={styles.desc}>@Infore</div>
            </div>

            <div className={styles.main}>

            </div>
            {registerSuccess ? registerSuccessPage : register}
        </div>
        <Footer />
    </div>

}
