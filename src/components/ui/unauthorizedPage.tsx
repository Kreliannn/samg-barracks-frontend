"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white flex-col">
        <Loader2 className="w-12 h-12 text-green-900 animate-spin mb-4" />
        <p className="text-green-800 font-medium">loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-green-900 flex items-center justify-center flex-col transition-all duration-500">
      <h1 className="text-4xl font-bold mb-4">401 - Unauthorized</h1>
      <p className="mb-6 text-green-700">You don’t have access to this page.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800 transition"
      >
        Go Back
      </Link>
    </div>
  );
}
