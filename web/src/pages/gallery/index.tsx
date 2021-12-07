/**
 * Created by Jacob Xie on 2/1/2021
 */

import { Route, Switch, HashRouter as Router, Prompt } from "react-router-dom"
import { useState } from 'react'
// import { Lifecycle } from 'react-router'

import Gallery from "./Gallery"
import Configuration from "./Configuration"
import Dataset from "./Dataset"
import Dashboard from "./Dashboard"
import DashboardTemplate from "./DashboardTemplate"
import { PrivateRoute } from '@/components/PrivateRoute'
import { Modal } from "antd"
export default () => {
    return (
        // <Router getUserConfirmation={(message, callback) => {
        //     console.log(199)
        //     Modal.confirm({
        //         title: message,
        //         onCancel: () => {
        //             callback(false);
        //         },
        //         onOk: () => {
        //             callback(true);
        //         }
        //     });
        // }}>
        <Switch>
            {/* // {<PrivateRoute path="/gallery/configuration" component={Configuration}></PrivateRoute>} */}


            <Route path="/gallery/" component={Gallery} exact />
            <Route path="/gallery/configuration" component={Configuration} />
            <Route path="/gallery/dashboardTemplate" component={DashboardTemplate} />
            <Route path="/gallery/dataset" component={Dataset} />
            <Route path="/gallery/dashboard" component={Dashboard} />


        </Switch>
        // </Router>

    )
}

