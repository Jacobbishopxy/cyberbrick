/**
 * Created by Jacob Xie on 3/1/2021
 */

import {useState, useCallback} from "react"

export default () => {
  const [parentInfo, setParentInfo] = useState<string | undefined>()
  const [redirectInfo, setRedirectInfo] = useState<string | undefined>()

  const copyParentInfo = useCallback((t: string) => setParentInfo(t), [])
  const copyRedirectInfo = useCallback((t: string) => setRedirectInfo(t), [])

  return {parentInfo, redirectInfo, copyParentInfo, copyRedirectInfo}
}
