import React from 'react'
import { usePageName, usePageParams } from 'umi'

export default function () {
  const pageName = usePageName()
  const { gender = 'male' } = usePageParams('UserRank')

  return (
    <div>
      {pageName}: {gender} rank
    </div>
  )
}

export interface Params {
  gender?: 'male' | 'female'
}
