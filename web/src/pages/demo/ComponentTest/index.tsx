/**
 * Created by Jacob Xie on 11/25/2020
 */

import {useLocation} from "react-router-dom"
import {Button} from "antd"
import {useState} from "react"

const useQuery = () => new URLSearchParams(useLocation().search)


const Link = (props: {l: string | undefined}) =>
  props.l ?
    <a href={props.l}>
      {props.l}
    </a> :
    <span>Null</span>

export default () => {
  const [info, setInfo] = useState<string>()

  const query = useQuery()

  const readFromClipboard = async () => {
    const i = await navigator.clipboard.readText()
    setInfo(i)
  }

  const genHref = () => {
    if (info)
      return `/gallery/dashboard?anchor=${info}`
    return undefined
  }

  return (
    <>
      <Button
        onClick={readFromClipboard}
      >
        Get info from clipboard
      </Button>

      <br/>

      <Link l={genHref()} />

      {query.get("anchor")}
    </>
  )
}

