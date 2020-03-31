import React from 'react'
import { usePageParams } from 'umi'

export default function () {
  const { gender = 'male' } = usePageParams('UserRank')

  return (
    <div>{gender} rank</div>
  )
}

export interface Params {
  gender?: 'male' | 'female',
}
