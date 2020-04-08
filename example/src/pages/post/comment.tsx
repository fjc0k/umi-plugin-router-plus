import React from 'react'
import { usePageParams } from 'umi'

export default function () {
  const { id } = usePageParams('PostComment')
  return <div>post#{id} comment</div>
}
