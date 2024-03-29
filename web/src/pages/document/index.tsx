/**
 * Created by Jacob Xie on 2/1/2021
 */

import { Route, Switch, HashRouter as Router } from "react-router-dom"
import { Modal } from 'antd'

import Document from "./Document"
import Manual from "./Manual"
import Menu from "./Menu"
import Gallery from "./Gallery"


export default () => {

    return (
        <Switch>
            <div>
                <Route path="/document/" component={Document} exact />
                <Route path="/document/manual" component={Manual} />
                <Route path="/document/menu" component={Menu} />
                <Route path="/document/gallery" component={Gallery} />
            </div>
        </Switch>
    )
}

