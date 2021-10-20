
import { divide } from '@umijs/deps/compiled/lodash';
import React, { useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import './test.less'
export default () => {


    return (
        <div className='testBox'>
            <div className='top'>
                123
            </div>
            <div className='btm'>
                456
            </div>
        </div>
    )
}


