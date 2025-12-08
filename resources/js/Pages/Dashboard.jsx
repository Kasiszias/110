import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Time Capsule Creator: Digital Archaeology
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Intro / concept summary */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <p className="text-sm text-gray-600 mb-3">
                A single-page experience where you bury digital time capsules, layer
                personal memories with real historical events, and set future reveal
                dates so your own history can be unearthed later.
              </p>
              <p className="text-sm text-gray-600">
                Start by creating a capsule, add artifacts from your life and from
                history, then watch the countdown until it is revealed.
              </p>
            </div>
          </div>

          {/* Three concept cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Bury capsules */}
            <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Bury a Time Capsule</h3>
              <p className="text-sm text-gray-600 flex-1">
                Create a capsule with a title, description, and reveal date. A live
                countdown shows how long remains until it opens, then the system
                automatically marks it as revealed.
              </p>
              <Link
                href={route('time-capsules.index')}
                className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:underline"
              >
                Go to My Capsules
              </Link>
            </div>

            {/* Card 2: Layer artifacts */}
            <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Layer Artifacts</h3>
              <p className="text-sm text-gray-600 flex-1">
                Inside each capsule, add personal, historical, and future artifacts.
                They are grouped by year and layer index so you can see your story as
                stacked layers of time.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                Tip: Use the layer index and year fields to control where each artifact
                appears in the stratified view.
              </p>
            </div>

            {/* Card 3: Unearth history */}
            <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Unearth History</h3>
              <p className="text-sm text-gray-600 flex-1">
                Use the historical events panel to load real Wikipedia “On this day”
                events for any date, then turn them into artifacts inside your
                capsule to add historical context around your memories.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                This connects your personal timeline to global events, just like a
                digital archaeology dig.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
