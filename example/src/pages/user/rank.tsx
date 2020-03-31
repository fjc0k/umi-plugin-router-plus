import React from 'react'
import { useQuery } from 'umi'

export default function () {
  const { gender = 'male' } = useQuery('UserRank')

  return (
    <div>{gender} rank</div>
  )
}

export interface Query {
  gender?: 'male' | 'female',
}
