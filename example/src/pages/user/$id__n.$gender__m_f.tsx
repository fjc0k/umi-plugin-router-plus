import React from 'react'
import {queryTypes, usePageParams} from 'umi'

export default function User() {
  const {id, gender} = usePageParams('User')

  return (
    <div>
      {`id is ${id} <${typeof id}>`}
      <hr />
      {`gender is ${gender} <${typeof gender}>`}
    </div>
  )
}

export const pageQueryTypes = {
  pid: queryTypes.number().enum([1, 2]),
  opid: queryTypes.number().enum([1, 2]),
}
