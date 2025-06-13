import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, TextField, Typography, Box, Container, Paper } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { useUser } from '../hooks/useUser';
import { UserRole } from '../types';
import fullLogo from '../assets/full-logo.png';

const SignIn: React.FC = () => {
  // ... existing code ...

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={fullLogo} alt="Frutas Prohibidas Full Logo" style={{ width: '100%', maxWidth: '400px', marginBottom: '32px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        <Typography component="h1" variant="h5">
          Sign in to your account
        </Typography>
        // ... existing code ...
      </Paper>
    </Container>
  );
};

export default SignIn; 