'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PendingOwnersPage() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/pending-owners`);
        const data = await res.json();
        setOwners(data);
      } catch (err) {
        toast.error('Failed to load owners');
      }
    }
    fetchOwners();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Owners with Pending Rooms</h1>
      <ul className="space-y-4">
        {owners.map((owner) => (
          <li key={owner._id} className="p-4 border rounded-lg bg-white shadow flex justify-between">
            <div>
              <p className="font-semibold">{owner.name}</p>
              <p className="text-gray-500">{owner.email}</p>
            </div>
            <Link
              href={`/admin/pending-property/${owner._id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              View Rooms
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
