// src/app/(auth)/layout.js

'use client'; // Add this directive to mark the component as client-side

import './../global.css'; // Ensure correct import path
import { useEffect, useState } from 'react';
import { metadata } from './metadata'; // Import metadata
import { logout } from '../../../actions/auth-actions';

export default function AuthRootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
  }, []);

  if (!isClient) {
    return null; // Prevent rendering anything on the server-side
  }

  return (
    <div className="bg-gray-100 text-gray-900 font-sans antialiased">
      <header className="bg-blue-600 text-white py-4 px-6" id="auth-header">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg font-semibold">Welcome back!</p>
          <form className="mt-2" action={logout}>
            <button
              type="button"
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
