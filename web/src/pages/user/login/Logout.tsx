import { useEffect, useState } from "react"

import { logout } from "@/services/auth"

interface LogoutPageProps {
    setLoginState: React.Dispatch<React.SetStateAction<boolean>>
}

export const LogoutPage = (props: LogoutPageProps) => {

    const { setLoginState } = props

    const [succeeded, setSucceeded] = useState(false)

    useEffect(() => {
        logout().then(_ => {
            setLoginState(false)
            setSucceeded(true)
        })
    }, [setLoginState])

    return succeeded ?
        <>
            You've successfully logged out!
        </> :
        <>
            Please wait... Logging you out...
        </>
}
