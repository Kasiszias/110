import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import Countdown from '@/Components/Countdown';

export default function Index({ auth, capsules }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    reveal_date: '',
    public: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('time-capsules.store'), {
      onSuccess: () => reset('title', 'description', 'reveal_date'),
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Time Capsules</h2>}
    >
      <Head title="My Time Capsules" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Create form */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h3 className="font-semibold mb-4">Create New Capsule</h3>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reveal date &amp; time</label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.reveal_date}
                    onChange={(e) => setData('reveal_date', e.target.value)}
                  />
                  {errors.reveal_date && (
                    <p className="text-sm text-red-600 mt-1">{errors.reveal_date}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="public"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={data.public}
                    onChange={(e) => setData('public', e.target.checked)}
                  />
                  <label htmlFor="public" className="ml-2 block text-sm text-gray-700">
                    Public capsule
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                >
                  Create Capsule
                </button>
              </form>
            </div>
          </div>

          {/* List */}
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
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold">{capsule.title}</div>
                          {capsule.revealed && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase font-semibold">
                              Revealed
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Reveals at:{' '}
                          {capsule.reveal_date_human || capsule.reveal_date}
                        </div>
                        <Countdown target={capsule.reveal_date} />
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs uppercase text-gray-400">
                          {capsule.public ? 'Public' : 'Private'}
                        </span>
                        <Link
                          href={route('capsules.show', capsule.id)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={route('time-capsules.edit', capsule.id)}
                          className="text-xs text-indigo-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Delete this capsule?')) {
                              router.delete(route('time-capsules.destroy', capsule.id));
                            }
                          }}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
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
