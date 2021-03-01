/**
 * Created by Jacob Xie on 3/1/2021
 */

import {useState, useCallback} from "react"

export default () => {
  const [text, setText] = useState<string | undefined>()

  const copy = useCallback((t: string) => setText(t), [])

  return {text, copy}
}
