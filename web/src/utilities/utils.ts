/**
 * Created by Jacob Xie on 3/11/2020.
 */

import moment from 'moment'
import {useCallback, useEffect, useRef, useState} from 'react'

const dateFormat = 'YYYYMMDD'
const dateFormat2 = 'YYYY-MM-DD'

export const currentTimeStamp = () => moment().format()
export const stringToTimestamp = (time: string) => moment(time).format()
export const timeStampToDateString = (time: moment.Moment) => time.format(dateFormat)
export const numberToDateString = (time: string) => moment(time).format(dateFormat2)

export const today = () => moment(new Date())
export const todayString = () => today().format(dateFormat)

export const useDidMountEffect = (func: Function, deps: any) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) func()
    else didMount.current = true
  }, deps)
}

export const useForceUpdate = () => {
  const [, setTick] = useState(0)
  const update = useCallback(() => {
    setTick(tick => tick + 1)
  }, [])
  return update()
}

