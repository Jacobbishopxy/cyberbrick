
import { divide } from '@umijs/deps/compiled/lodash';
import React, { useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
export default () => {



    const count = useAppSelector((state) => state.counter.value)
    let a: number = 'a'
    console.log(10, count)
    return (

        <div>

        </div>
    )
}


