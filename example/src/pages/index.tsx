import React from 'react'
import {navigateTo} from 'umi'

const _ = (text: string, handleClick: () => any) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

export default function () {
  return (
    <div>
      {_('user', () => {
        navigateTo('User', {
          id: 2,
          gender: 'f',
        })
      })}
    </div>
  )
}
