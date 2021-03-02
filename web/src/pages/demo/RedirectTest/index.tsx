/**
 * Created by Jacob Xie on 3/2/2021
 */

import {useModel} from "umi"


const Link = (props: {l: string | undefined}) =>
  props.l ?
    <a href={props.l}>
      {props.l}
    </a> : <span>Null</span>

export default () => {
  const {redirectInfo} = useModel("tempCopy")

  const genHref = () => {
    if (redirectInfo){
      return `/gallery/dashboard?anchor=${redirectInfo}`
    }
    return undefined
  }

  return <Link l={genHref()} />
}

