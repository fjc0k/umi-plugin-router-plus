import React from 'react'
import { usePageParams } from 'umi'

export interface Params {
  replyId: number,
}

const Layout: React.FC = props => {
  const { id } = usePageParams('PostReplyLayout')

  console.log(id)

  return props.children as any
}

export default Layout
