import React from 'react'
import { navigateTo, useQuery } from 'umi'

export default function User() {
  const { id } = useQuery('User')

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

export interface Query {
  /** ID */
  id: number,
}
