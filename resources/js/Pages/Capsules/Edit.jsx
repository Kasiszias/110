import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, capsule }) {
  const { data, setData, put, processing, errors } = useForm({
    title: capsule.title || '',
    description: capsule.description || '',
    reveal_date: capsule.reveal_date?.slice(0, 16) || '',
    public: !!capsule.public,
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('time-capsules.update', capsule.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Capsule</h2>}
    >
      <Head title="Edit Capsule" />

      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                  />
                  {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reveal date &amp; time</label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    value={data.reveal_date}
                    onChange={(e) => setData('reveal_date', e.target.value)}
                  />
                  {errors.reveal_date && <p className="text-sm text-red-600 mt-1">{errors.reveal_date}</p>}
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

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Save changes
                  </button>
                  <a
                    href={route('time-capsules.index')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50"
                  >
                    Cancel
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
