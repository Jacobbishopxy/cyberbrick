/**
 * Created by Jacob Xie on 3/1/2021
 */

import {useState, useCallback} from "react"

export default () => {
  const [redirectInfo, setRedirectInfo] = useState<string | undefined>()

  const copyRedirectInfo = useCallback((t: string) => setRedirectInfo(t), [])

  return {redirectInfo, copyRedirectInfo}
}
