import { Button } from "antd"
import * as auth from "@/services/auth"
import { Redirect, useLocation } from "react-router-dom"
import { useState } from "react"
import { Link, SelectLang } from "umi"
import Footer from "@/components/Footer"
import styles from './index.less'
export const Invitation = () => {
    const search = useLocation().search
    const id = new URLSearchParams(search).get('id')
    const email = new URLSearchParams(search).get('email')

    const [succeeded, setSucceeded] = useState(false)

    const onRegister = async () => {
        if (id && email)
            return auth.register(id).then(_ => setSucceeded(true))
    }

    const invited = id && email ?
        <>
            <p>Welcome to join Cyberbrick!</p>
            <p>Your email is {email}</p>
            <Button onClick={onRegister}> Confirm</Button>
        </> :
        <>
            Your invitation is invalid! Please <Link to={"/user/registration"}> register</Link> again
        </>

    return (
        succeeded ? <Redirect to="/user/login" /> :
            <div className={styles.container}>
                <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <Link to="/user/registration">
                                <span className={styles.title}>Registration</span>
                            </Link>
                        </div>
                        <div className={styles.desc}>@Infore</div>
                    </div>

                    <div className={styles.main}></div>
                    <div className={styles.info}>
                        {invited}
                    </div>
                </div>
                <Footer />
            </div>
    )
}
