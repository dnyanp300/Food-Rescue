import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase'; // Import your firebase config

// Import MUI button
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Login() {
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      // 1. Show the Google Sign-In Popup
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      console.log("Got Google ID Token:", idToken);

      // 2. Send this token to our backend
      const response = await fetch("http://localhost:8000/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Backend login failed");
      }

      // 3. Backend login was a success!
      console.log("Backend response:", data);
      setUserData(data); // Save the user data to display
      setError(null);

    } catch (err) {
      console.error("Login Failed:", err.message);
      setError(err.message);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: '50px auto', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Button 
        variant="contained" 
        fullWidth 
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}

      {userData && (
        <Box sx={{ mt: 2, background: '#f0f0f0', padding: 2, borderRadius: 1, wordBreak: 'break-all' }}>
          <Typography variant="h6">Login Success!</Typography>
          <Typography>Welcome, {userData.user.name}</Typography>
          <Typography sx={{ fontSize: 12 }}>Your App Token: {userData.access_token.substring(0, 20)}...</Typography>
        </Box>
      )}
    </Box>
  );
}