/**
 * Created by Jacob Xie on 2/1/2021
 */

import { Route, Switch, Router, } from "react-router-dom"
// import { Lifecycle } from 'react-router'

import Gallery from "./Gallery"
import Configuration from "./Configuration"
import Dataset from "./Dataset"
import Dashboard from "./Dashboard"
import DashboardTemplate from "./DashboardTemplate"
import { PrivateRoute } from '@/components/PrivateRoute'
export default () => {

    return (
        <Switch>
            {/* <PrivateRoute path="/gallery/configuration" component={Configuration}></PrivateRoute> */}
            <Route path="/gallery/" component={Gallery} exact />
            <Route path="/gallery/configuration" component={Configuration} />
            <Route path="/gallery/dashboardTemplate" component={DashboardTemplate} onLeave={(a, b, c) => {
                console.log(233, a, b, c)
            }} />
            <Route path="/gallery/dataset" component={Dataset} />
            <Route path="/gallery/dashboard" component={Dashboard} />
        </Switch>

    )
}

