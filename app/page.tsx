// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-semibold mb-4">Welcome — My Project</h1>
        <p className="mb-4">Use the login page to sign in.</p>
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Go to Login</Link>
      </div>
    </main>
  );
}
