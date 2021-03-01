/**
 * Created by Jacob Xie on 11/25/2020
 */

import {useLocation} from "react-router-dom"
// import {Button} from "antd"


const useQuery = () => new URLSearchParams(useLocation().search)


export default () => {

  const query = useQuery()

  return (
    <>
      {query.get("name")}
    </>
  )
}

