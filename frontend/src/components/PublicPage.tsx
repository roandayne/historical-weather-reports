import React, { type FC } from 'react'
import Navigation from './Navigation'

interface PublicPageProps {
  children: React.ReactNode
}

const PublicPage: FC<PublicPageProps> = ({ children }) => {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  )
}

export default PublicPage