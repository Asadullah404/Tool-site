'use client';

import { useState, Suspense } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const msg = searchParams.get('msg');

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError('');
    try {
      console.log("Starting Google Login...");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Login success, user:", user.email);

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log("New user, creating Firestore doc...");
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          conversionCount: 0,
          tier: 'free',
          createdAt: new Date()
        });
      }
      console.log("Redirecting to dashboard...");
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || 'Google login failed.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      console.log("Starting Email Login...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login success, redirecting...");
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Email Login Error:", err);
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md border border-gray-100">
        <div>
          {msg === 'limit_reached' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-bold text-center">
              GUEST LIMIT REACHED! PLEASE LOGIN TO CONTINUE.
            </div>
          )}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 uppercase">Log in to your account</h2>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-5 h-5 hidden" alt="" />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs font-bold uppercase">or email</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              LOG IN
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/register" className="text-sm font-bold text-red-600 hover:text-red-500">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
