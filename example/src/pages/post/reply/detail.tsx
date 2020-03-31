import React from 'react'
import { usePageParams } from 'umi'

export default function () {
  const { id, replyId } = usePageParams('PostReplyDetail')
  return (
    <div>post#{id}, reply#{replyId} detail</div>
  )
}
