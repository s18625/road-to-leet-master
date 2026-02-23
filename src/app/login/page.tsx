'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">LeetCode Tracker</h1>
      <button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Log in with Google
      </button>
    </div>
  );
}
