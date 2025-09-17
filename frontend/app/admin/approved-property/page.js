'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ApprovedOwnersPage() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    async function fetchOwners() {
      try {
        const res = await fetch(
          // `${process.env.NEXT_PUBLIC_API_BASE}/admin/owners?hasApproved=true`, approved-owners
           `${process.env.NEXT_PUBLIC_API_BASE}/admin/approved-owners`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOwners(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch owners with approved rooms');
      }
    }
    fetchOwners();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Approved Property Owners</h1>
      {owners.length === 0 ? (
        <p className="text-gray-600">No owners with approved properties.</p>
      ) : (
        <ul className="space-y-4">
          {owners.map((owner) => (
            <li
              key={owner._id}
              className="flex justify-between items-center p-4 border rounded-lg bg-white shadow"
            >
              <div>
                <p className="font-semibold">{owner.name}</p>
                <p className="text-sm text-gray-500">{owner.email}</p>
              </div>
              <Link
                href={`/admin/approved-property/${owner._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Approved Rooms
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
