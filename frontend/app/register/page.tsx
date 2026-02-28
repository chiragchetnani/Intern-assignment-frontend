"use client";

import { useState } from "react";
import { apiFetch } from "@/components/services/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", res.access_token);
      router.push("/dashboard");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-6">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg">

        <h1 className="text-2xl font-semibold text-neutral-100 mb-2">
          Create account
        </h1>
        <p className="text-sm text-neutral-400 mb-6">
          Start using AI Legal Research Assistant
        </p>

        <div className="space-y-4">
          <input
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-neutral-200 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}