import { Modal } from "antd"
import { useState } from "react"
import { Route, Redirect } from "react-router-dom"
import { history } from 'umi'
export const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isVisible, setIsVisible] = useState(true)
    console.log(666, location)
    return (
        <Route
            {...rest}
            render={props => <Modal visible={isVisible} onCancel={() => {
                setIsVisible(false)
                history.goBack()
            }}></Modal>
                // true ? (
                //   <Component {...props} />
                // ) : (
                //   <Redirect
                //     to={{
                //       pathname: "/logins",
                //       state: { from: props.location }
                //     }}
                //   />
                // )
            }
        />
    )
}