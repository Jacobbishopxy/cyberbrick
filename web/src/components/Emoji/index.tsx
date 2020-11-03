/**
 * Created by Jacob Xie on 4/27/2020.
 */

import React from 'react'


interface EmojiProps {
  label: string
  symbol: string
  size?: number
}

export const Emoji = (props: EmojiProps) =>
  <option
    className="emoji"
    aria-label={props.label || ''}
    aria-hidden={props.label ? 'false' : 'true'}
    value={props.label}
    style={{fontSize: props.size}}
  >
    {props.symbol}
  </option>


export default Emoji
