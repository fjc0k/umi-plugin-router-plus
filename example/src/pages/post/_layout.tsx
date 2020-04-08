import React from 'react'

export interface Params {
  id: number
}

const Layout: React.FC = props => props.children as any

export default Layout
