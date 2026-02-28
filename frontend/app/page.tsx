"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-5xl font-bold mb-6">
        AI Powered Legal Intelligence
      </h1>

      <p className="text-lg max-w-xl mb-8 text-gray-300">
        Structured legal analysis. Case references.
        Conflict detection. Confidence scoring.
      </p>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="bg-white text-black px-6 py-3 rounded"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/register")}
          className="border border-white px-6 py-3 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}