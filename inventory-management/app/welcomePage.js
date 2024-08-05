import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { doSignInWithEmailAndPassword } from '../auth';

export default function WelcomePage({ onContinue }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await doSignInWithEmailAndPassword(email, password);
      onContinue();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#ffffff"
      gap={2}
    >
      <Typography variant="h4" color="#000000">
        Welcome to your personal online pantry!
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ width: '300px' }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ width: '300px' }}
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button 
        variant="contained" 
        onClick={handleLogin}
        sx={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        Login
      </Button>
    </Box>
  );
}