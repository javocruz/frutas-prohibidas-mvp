import React from 'react';
import { Typography, Container, Paper } from '@mui/material';
import fullLogo from '../assets/full-logo.png';

const SignIn: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img
          src={fullLogo}
          alt="Frutas Prohibidas Full Logo"
          style={{
            width: '100%',
            maxWidth: '400px',
            marginBottom: '32px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
        <Typography component="h1" variant="h5">
          Sign in to your account
        </Typography>
        {/* Add your sign-in form here */}
      </Paper>
    </Container>
  );
};

export default SignIn;
