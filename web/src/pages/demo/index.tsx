/**
 * Created by Jacob Xie on 2/1/2021
 */

import {Route, Switch} from "react-router-dom"

import Demo from "./Demo"
import Charts from "./Charts"
import ComponentTest from "./ComponentTest"
import GalleryModuleTest from "./GalleryModuleTest"
import GridLayout from "./GridLayout"
import RedirectTest from "./RedirectTest"
import LocalStorage from "./LocalStorage"
import RectangleChart from "./RectangleChart"


export default () => {

  return (
    <Switch>
      <Route path="/demo/" component={Demo} exact/>
      <Route path="/demo/local-storage" component={LocalStorage}/>
      <Route path="/demo/rectangle-chart" component={RectangleChart}/>
      <Route path="/demo/charts" component={Charts}/>
      <Route path="/demo/grid-layout" component={GridLayout}/>
      <Route path="/demo/redirect-test" component={RedirectTest}/>
      <Route path="/demo/module-test" component={GalleryModuleTest}/>
      <Route path="/demo/component-test" component={ComponentTest}/>
    </Switch>
  )
}

