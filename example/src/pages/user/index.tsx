import React from 'react'
import { navigateTo, usePageParams } from 'umi'

export default function User() {
  const { id } = usePageParams('User')

  return (
    <div>
      ID: {id}，类型：{typeof id}
      <button
        onClick={() => {
          navigateTo('User', {
            id: id + 1,
          })
        }}>
        navigateTo user={id + 1}
      </button>
    </div>
  )
}

export interface Params {
  /** ID */
  id: number
}
