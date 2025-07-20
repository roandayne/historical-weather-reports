import React, { type FC } from 'react'

interface PublicPageProps {
  children: React.ReactNode
}

const PublicPage: FC<PublicPageProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default PublicPage