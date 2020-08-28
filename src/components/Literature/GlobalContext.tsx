/**
 * Created by Jacob Xie on 8/28/2020.
 */

import React from "react"

const EditableContext = React.createContext<boolean>(false)
const SearchableContext = React.createContext<boolean>(false)

export { EditableContext, SearchableContext }
