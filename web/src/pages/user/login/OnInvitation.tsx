import { Button } from "antd"
import * as auth from "../services/auth"
import { Redirect, useLocation } from "react-router-dom";
import { useState } from "react";

export const OnInvitation = () => {
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const email = new URLSearchParams(search).get('email');

    const [succeeded, setSucceeded] = useState(false)

    const onRegister = async () => {
        if (id && email)
            return auth.register(id).then(_ => setSucceeded(true))
    }

    const invited = id && email ?
        <>
            <p>Welcome to join cyberbrick!
                Your email is {email} </p>
            <Button onClick={onRegister}> Confirm</Button>
        </> :
        <>
            Your invitation is undefined! Please <a href={"#/registration"}> register</a> again
        </>

    return (
        succeeded ? <Redirect to="/login" /> : invited
    )
}