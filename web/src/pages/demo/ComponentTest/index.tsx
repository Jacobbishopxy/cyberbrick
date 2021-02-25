/**
 * Created by Jacob Xie on 11/25/2020
 */

import {DisplayFormSeriesPie} from "@/components/Gallery/ModulePanel/Collections/graph/common/DisplayFormSeriesPie"



const columns = [
  "Jacob",
  "MZ",
  "Sam"
]

export default () => {

  return (
    <DisplayFormSeriesPie
      columns={columns}
    />
  )
}

