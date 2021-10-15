
import { divide } from '@umijs/deps/compiled/lodash';
import React, { useRef } from 'react'
import { useAppSelector } from '@/redux/hooks'
export default () => {



    const count = useAppSelector((state) => state.counter.value)
    console.log(10, count)
    return (

        <div>

        </div>
    )
}


