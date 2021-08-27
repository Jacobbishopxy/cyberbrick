
import { LoginPage } from "./Login"
import { RegisterPage } from "./Register"
import { LogoutPage } from "./Logout"
import { Invitation } from "./Invitation"
import { Route, Switch } from "react-router-dom"

export default () => {

    return (
        <Switch>
            <Route path="/user/login" component={LoginPage} exact />
            <Route path="/user/registration" component={RegisterPage} />
            <Route path="/user/logout" component={LogoutPage} />
            <Route path="/user/invitation/register" component={Invitation} />
        </Switch>
    )
}