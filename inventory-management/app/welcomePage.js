import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { doSignInWithEmailAndPassword, doCreateUserwithEmailandPassword } from '../auth';

export default function WelcomePage({ onContinue }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignIn = async () => {
    try {
      await doSignInWithEmailAndPassword(email, password);
      onContinue();
      setError(null);
      setSuccess(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await doCreateUserwithEmailandPassword(email, password);
      setSuccess("Account created successfully! Please log in.");
      setError(null);
      setEmail('');
      setPassword('');
      setIsLogin(true); // Switch to login after successful sign-up
    } catch (error) {
      setError(error.message);
      setSuccess(null);
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
        {isLogin ? 'Log In' : 'Sign Up'}
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
      {success && (
        <Typography color="primary" variant="body2">
          {success}
        </Typography>
      )}
      <Button 
        variant="contained" 
        onClick={isLogin ? handleSignIn : handleSignUp}
        sx={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        {isLogin ? 'Log In' : 'Sign Up'}
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => setIsLogin(!isLogin)}
        sx={{ color: '#000000' }}
      >
        {isLogin ? 'Create an Account' : 'Already have an Account? Log In'}
      </Button>
    </Box>
  );
}
