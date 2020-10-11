import React from 'react'
import { usePageName, usePageParams } from 'umi'

export default function () {
  const pageName = usePageName()
  const { id, replyId } = usePageParams('PostReplyDetail')
  return (
    <div>
      {pageName}: post#{id}, reply#{replyId} detail
    </div>
  )
}
