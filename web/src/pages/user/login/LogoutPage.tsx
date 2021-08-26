import { useEffect, useState } from "react"
import * as auth from "../services/auth"
interface LogoutPageProps {
    setLogined: React.Dispatch<React.SetStateAction<boolean>>
}
export const LogoutPage = (props: LogoutPageProps) => {
    const [succeeded, setSucceeded] = useState(false)

    useEffect(() => {
        auth.logout().then(_ => {
            props.setLogined(false)
            setSucceeded(true)
        }
        )

    }, [])
    return succeeded ?
        <>
            You've successfully logged out!
        </> :
        <>
            Please wait... Logging you out...
        </>
}