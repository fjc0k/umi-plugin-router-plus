import React from 'react'

export interface Params {
  replyId: number,
}

const Layout: React.FC = props => props.children as any

export default Layout
