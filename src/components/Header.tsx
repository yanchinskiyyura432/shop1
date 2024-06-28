import React from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductListHeader: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#bdbdbd',  p:2,  boxShadow: 2 }}>
        <Link to={'/'} style={{ textDecoration: 'none', color: '#424242' }}>
      <Typography
        variant="h4"
        sx={{
            display: 'flex',
          fontSize: '24px',
          fontWeight: 'bold',
          alignItems: 'center',

          
        }}
      >
        Home
      </Typography>
      </Link>
    </Box>
  );
};

export default ProductListHeader;
