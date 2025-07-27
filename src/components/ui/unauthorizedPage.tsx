import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white text-green-900 flex items-center justify-center flex-col">
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
