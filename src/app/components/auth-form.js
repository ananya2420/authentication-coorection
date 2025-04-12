"use client";  // Ensure the component is client-side

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";  // Updated import
import { useActionState } from "react";
import { auth, signUp } from "../../../actions/auth-actions";

export default function AuthForm({ mode }) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useActionState(auth, { errors: {} });

  // Local state for real-time form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Initialize useRouter for navigation
  const router = useRouter();  // The router hook now works with the new app structure

  const handleSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "signUp") {
          await signUp(email, password);
          
          // After successful sign up, navigate to the TrainingsPage
          router.push("/trainings");  // Navigates to /trainings page
        } else {
          // Handle login logic
        }
      } catch (errors) {
        setFormState((prevState) => ({
          ...prevState,
          errors,
        }));
      }
    });
  };

  return (
    <form
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-center">
        <img
          src="/images/auth-icon.jpg"
          alt="A lock icon"
          className="w-16 h-16"
        />
      </div>

      <p className="mt-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your email"
          required
        />
      </p>

      <p className="mt-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter your password"
          required
        />
      </p>

      {formState.errors && Object.keys(formState.errors).length > 0 && (
        <ul id="form-errors" className="mt-2 text-red-500">
          {Object.keys(formState.errors).map((error) => (
            <li key={error}>{formState.errors[error]}</li>
          ))}
        </ul>
      )}

      <p className="mt-6">
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
        </button>
      </p>

      <p className="mt-4 text-center text-sm text-gray-600">
        {mode === "login" && (
          <Link href="/training" className="text-blue-500 hover:underline">
            Create an account
          </Link>
        )}
        {mode === "signUp" && (
          <Link href="/training" className="text-blue-500 hover:underline">
            Already have an account? Log in
          </Link>
        )}
      </p>
    </form>
  );
}
