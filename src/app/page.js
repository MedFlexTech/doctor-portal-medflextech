'use client';
import { useState } from 'react';
import {auth} from '../lib/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

import Link from 'next/link';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('before');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('after');
      // Redirect to dashboard or any other protected route
      router.push('/Dashboard');
    } catch (error) {
      console.error('Login Error:', error.message);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;