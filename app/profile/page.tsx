"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Session {
  name: string;
  email: string;
  phone_number: string;
  avatar: string;
  status: string;
  userRole: { name: string };
}

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
          withCredentials: true,
        });
        setSession(res.data.session);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    fetchProfile();
  }, []);

  if (!session) return <p>Loading profile...</p>;

  return (
    <div className="max-w-md bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        <img
          src={session.avatar}
          alt={session.name}
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-semibold">{session.name}</h2>
          <p className="text-gray-600">{session.email}</p>
          <p className="text-gray-600">{session.phone_number}</p>
          <span className="text-sm text-green-600 capitalize">
            {session.status}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm bg-gray-200 px-2 py-1 rounded">
          Role: {session.userRole.name}
        </span>
      </div>
    </div>
  );
}
