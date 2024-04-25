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
      setError(error.message);
      console.error('Login Error:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border rounded-md p-8 flex flex-col items-center">
        <h1 className="text-3xl mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4 w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 border rounded-md"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;