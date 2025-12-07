import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, capsules }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Time Capsules</h2>}
    >
      <Head title="My Time Capsules" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {capsules.length === 0 ? (
                <p>No capsules yet.</p>
              ) : (
                <ul className="space-y-2">
                  {capsules.map((capsule) => (
                    <li
                      key={capsule.id}
                      className="border rounded-md px-4 py-2 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">{capsule.title}</div>
                        <div className="text-sm text-gray-500">
                          Reveals at: {new Date(capsule.reveal_date).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-xs uppercase text-gray-400">
                        {capsule.public ? 'Public' : 'Private'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
