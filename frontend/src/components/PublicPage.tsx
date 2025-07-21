import React, { type FC } from 'react';
import { Box } from '@mui/material';
import { containerStyles } from '../styles/PublicPage.styles';

interface PublicPageProps {
  children: React.ReactNode;
}

const PublicPage: FC<PublicPageProps> = ({ children }) => {
  return <Box sx={containerStyles}>{children}</Box>;
};

export default PublicPage;
