import React from 'react'
import {usePageParams} from 'umi'

export default function () {
  const {id, gender} = usePageParams('User')

  return (
    <div>
      {`id is ${id} <${typeof id}>`}
      <hr />
      {`gender is ${gender} <${typeof gender}>`}
    </div>
  )
}
