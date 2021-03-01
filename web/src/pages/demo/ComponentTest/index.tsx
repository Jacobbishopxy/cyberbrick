/**
 * Created by Jacob Xie on 11/25/2020
 */

import {useModel} from "umi"


const Link = (props: {l: string | undefined}) =>
  props.l ?
    <a href={props.l}>
      {props.l}
    </a> : <span>Null</span>

export default () => {
  const {text} = useModel("tempCopy")

  const genHref = () => {
    if (text)
      return `/gallery/dashboard?anchor=${text}`
    return undefined
  }

  return <Link l={genHref()} />

}

