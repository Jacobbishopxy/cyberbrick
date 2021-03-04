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
    if (redirectInfo) {
      const {parentInfo, eleId} = JSON.parse(redirectInfo)

      // todo: component all loaded then call `#id` redirect
      return `/gallery/dashboard?anchor=${JSON.stringify(parentInfo)}#${eleId}`
    }
    return undefined
  }

  return <Link l={genHref()} />
}

