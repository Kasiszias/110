import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';


export default function Show({ auth, capsule, artifacts }) {
  // Add form
  const { data, setData, post, processing, errors, reset } = useForm({
    type: 'personal',
    title: '',
    content: '',
    year: '',
    layer_z_index: 0,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('capsules.artifacts.store', capsule.id), {
      onSuccess: () => reset('title', 'content', 'year'),
    });
  };

  // Edit form
  const editForm = useForm({
    type: '',
    title: '',
    content: '',
    year: '',
    layer_z_index: 0,
  });
  const [editingId, setEditingId] = useState(null);

  // History API state
  const [historyEvents, setHistoryEvents] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Group artifacts by year
  const grouped = artifacts.reduce((acc, artifact) => {
    const key = artifact.year && artifact.year !== 0 ? artifact.year.toString() : 'No year';
    if (!acc[key]) acc[key] = [];
    acc[key].push(artifact);
    return acc;
  }, {});

  const sortedYearKeys = Object.keys(grouped).sort((a, b) => {
    if (a === 'No year') return 1;
    if (b === 'No year') return -1;
    return parseInt(b, 10) - parseInt(a, 10);
  });

  // Mini timeline years + scroll
  const timelineYears = sortedYearKeys.filter((y) => y !== 'No year');

  const scrollToYear = (year) => {
    const el = document.getElementById(`layer-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
      <AuthenticatedLayout
    user={auth.user}
    header={
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {capsule.title}
        </h2>
        <div className="flex items-center space-x-3 text-sm">
          <Link
            href={route('time-capsules.index')}
            className="text-indigo-600 hover:underline"
          >
            ← Back to My Capsules
          </Link>
          <Link
            href={route('dashboard')}
            className="text-gray-500 hover:underline"
          >
            Dashboard
          </Link>
        </div>
      </div>
    }
  >

      <Head title={capsule.title} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* LEFT: main content (3/4 width) */}
            <div className="md:col-span-3 space-y-6">
              {/* Capsule summary */}
              <div className="bg-white shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                  <p className="text-sm text-gray-600 mb-2">{capsule.description}</p>
                  <p className="text-sm text-gray-500">
                    Reveals at: {capsule.reveal_date_human || capsule.reveal_date}
                  </p>
                </div>
              </div>

              {/* Add artifact form */}
              <div className="bg-white shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                  <h3 className="font-semibold mb-4">Add Artifact</h3>
                  <form onSubmit={submit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                      >
                        <option value="personal">Personal</option>
                        <option value="historical">Historical</option>
                        <option value="future">Future</option>
                      </select>
                      {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                    </div>

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
                      <label className="block text-sm font-medium text-gray-700">
                        Content (text or URL)
                      </label>
                      <textarea
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          value={data.year}
                          onChange={(e) => setData('year', e.target.value)}
                        />
                        {errors.year && (
                          <p className="text-sm text-red-600 mt-1">{errors.year}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Layer index</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          value={data.layer_z_index}
                          onChange={(e) => setData('layer_z_index', e.target.value)}
                        />
                        {errors.layer_z_index && (
                          <p className="text-sm text-red-600 mt-1">{errors.layer_z_index}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Add Artifact
                    </button>
                  </form>
                </div>
              </div>

              {/* Historical events panel */}
              <div className="bg-white shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 space-y-4">
                  <h3 className="font-semibold">Historical events for a date</h3>
                  <HistoryLoader
                    setHistoryEvents={setHistoryEvents}
                    setHistoryLoading={setHistoryLoading}
                    setHistoryError={setHistoryError}
                  />
                  <div>
                    {historyLoading && (
                      <p className="text-sm text-gray-500">Loading events...</p>
                    )}
                    {historyError && (
                      <p className="text-sm text-red-600">{historyError}</p>
                    )}
                    {historyEvents.length > 0 && (
                      <ul className="mt-2 space-y-2">
                        {historyEvents.map((ev, idx) => (
                          <li
                            key={idx}
                            className="border rounded-md px-3 py-2 text-sm bg-gray-50 flex justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="text-xs text-gray-500 mb-1">
                                {ev.year || 'Unknown year'}
                              </div>
                              <div className="text-sm text-gray-800 break-words">
                                {ev.description}
                              </div>
                            </div>
                            {ev.wikipedia && (
                              <button
                                type="button"
                                onClick={() => {
                                  setData('type', 'historical');
                                  setData(
                                    'title',
                                    ev.description?.slice(0, 80) || 'Historical Event'
                                  );
                                  setData('content', ev.wikipedia);
                                  setData('year', ev.year || '');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="text-[11px] text-indigo-600 hover:underline flex-shrink-0"
                              >
                                Use as artifact
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Stratified artifact layers */}
              <div className="bg-white shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                  {sortedYearKeys.length === 0 ? (
                    <p>No artifacts yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {sortedYearKeys.map((yearKey, index) => (
                        <div
                          key={yearKey}
                          id={yearKey === 'No year' ? undefined : `layer-${yearKey}`}
                          className="rounded-lg border relative overflow-hidden"
                          style={{
                            background:
                              index % 2 === 0
                                ? 'linear-gradient(to right, #fef3c7, #fffbeb)'
                                : 'linear-gradient(to right, #e5e7eb, #f9fafb)',
                          }}
                        >
                          <div className="px-4 py-2 bg-black/10 text-xs font-semibold uppercase tracking-wide">
                            {yearKey === 'No year' ? 'Undated Layer' : `Layer • ${yearKey}`}
                          </div>
                          <div className="p-4 space-y-2">
                            {grouped[yearKey].map((artifact) => {
                              const isEditing = editingId === artifact.id;

                              const startEdit = () => {
                                setEditingId(artifact.id);
                                editForm.setData({
                                  type: artifact.type,
                                  title: artifact.title,
                                  content: artifact.content,
                                  year: artifact.year || '',
                                  layer_z_index: artifact.layer_z_index ?? 0,
                                });
                              };

                              const submitEdit = (e) => {
                                e.preventDefault();
                                editForm.put(
                                  route('capsules.artifacts.update', [
                                    capsule.id,
                                    artifact.id,
                                  ]),
                                  {
                                    onSuccess: () => setEditingId(null),
                                  }
                                );
                              };

                              return (
                                <div
                                  key={artifact.id}
                                  className="bg-white/80 border border-white/60 rounded-md px-3 py-2 flex justify-between items-start gap-3"
                                >
                                  {isEditing ? (
                                    <form
                                      onSubmit={submitEdit}
                                      className="min-w-0 flex-1 space-y-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <select
                                          className="text-[10px] px-2 py-0.5 rounded-full border-gray-300"
                                          value={editForm.data.type}
                                          onChange={(e) =>
                                            editForm.setData('type', e.target.value)
                                          }
                                        >
                                          <option value="personal">Personal</option>
                                          <option value="historical">Historical</option>
                                          <option value="future">Future</option>
                                        </select>
                                        <input
                                          type="number"
                                          className="text-[10px] border-gray-300 rounded px-2 py-0.5 w-20"
                                          value={editForm.data.layer_z_index}
                                          onChange={(e) =>
                                            editForm.setData(
                                              'layer_z_index',
                                              e.target.value
                                            )
                                          }
                                          placeholder="Layer"
                                        />
                                        <input
                                          type="number"
                                          className="text-[10px] border-gray-300 rounded px-2 py-0.5 w-24"
                                          value={editForm.data.year}
                                          onChange={(e) =>
                                            editForm.setData('year', e.target.value)
                                          }
                                          placeholder="Year"
                                        />
                                      </div>
                                      <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-md text-sm"
                                        value={editForm.data.title}
                                        onChange={(e) =>
                                          editForm.setData('title', e.target.value)
                                        }
                                      />
                                      <textarea
                                        className="w-full border-gray-300 rounded-md text-xs"
                                        value={editForm.data.content}
                                        onChange={(e) =>
                                          editForm.setData('content', e.target.value)
                                        }
                                      />
                                      <div className="flex space-x-2">
                                        <button
                                          type="submit"
                                          disabled={editForm.processing}
                                          className="text-[11px] text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingId(null)}
                                          className="text-[11px] text-gray-600 hover:underline"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  ) : (
                                    <div className="min-w-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold ${
                                            artifact.type === 'personal'
                                              ? 'bg-blue-100 text-blue-700'
                                              : artifact.type === 'historical'
                                              ? 'bg-yellow-100 text-yellow-700'
                                              : 'bg-green-100 text-green-700'
                                          }`}
                                        >
                                          {artifact.type}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                          Layer {artifact.layer_z_index ?? 0}
                                        </span>
                                        {artifact.year ? (
                                          <span className="text-[10px] text-gray-400">
                                            {artifact.year}
                                          </span>
                                        ) : null}
                                      </div>
                                      <div className="font-semibold text-sm break-words">
                                        {artifact.title}
                                      </div>
                                      <div className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                                        {artifact.content}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    {!isEditing && (
                                      <button
                                        type="button"
                                        onClick={startEdit}
                                        className="text-[11px] text-indigo-600 hover:underline"
                                      >
                                        Edit
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm('Delete this artifact?')) {
                                          router.delete(
                                            route('capsules.artifacts.destroy', [
                                              capsule.id,
                                              artifact.id,
                                            ])
                                          );
                                        }
                                      }}
                                      className="text-[11px] text-red-600 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Mini timeline */}
            <aside className="md:col-span-1 space-y-3">
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Timeline</h3>
                {timelineYears.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    Add artifacts with a year to see the timeline.
                  </p>
                ) : (
                  <ul className="space-y-1 max-h-64 overflow-y-auto text-sm">
                    {timelineYears.map((year) => (
                      <li key={year}>
                        <button
                          type="button"
                          onClick={() => scrollToYear(year)}
                          className="w-full text-left px-2 py-1 rounded hover:bg-indigo-50 text-gray-700 text-xs"
                        >
                          {year}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// keep your existing HistoryLoader component here


// Helper component: loads events from /api/history
function HistoryLoader({ setHistoryEvents, setHistoryLoading, setHistoryError }) {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const load = async (e) => {
  e.preventDefault();
  if (!month || !day) return;

  try {
    setHistoryLoading(true);
    setHistoryError(null);
    setHistoryEvents([]); // clear previous

    const params = new URLSearchParams({ month, day }).toString();
    const res = await fetch(`/api/history?${params}`);
    if (!res.ok) {
      throw new Error('Failed to load history');
    }
    const json = await res.json();
    const all = json.events || [];

    // Randomize order
    const shuffled = [...all].sort(() => Math.random() - 0.5);

    // Show only first 3 random events (change number if you want)
    setHistoryEvents(shuffled.slice(0, 5));
  } catch (err) {
    setHistoryError('Could not load historical events.');
    setHistoryEvents([]);
  } finally {
    setHistoryLoading(false);
  }
};


  return (
    <form onSubmit={load} className="flex flex-wrap items-end gap-2 text-sm">
      <div>
        <label className="block text-xs font-medium text-gray-700">Month (1–12)</label>
        <input
          type="number"
          min="1"
          max="12"
          className="mt-1 w-20 border-gray-300 rounded-md"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Day (1–31)</label>
        <input
          type="number"
          min="1"
          max="31"
          className="mt-1 w-20 border-gray-300 rounded-md"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-3 py-1.5 bg-gray-800 border border-transparent rounded-md font-semibold text-[11px] text-white uppercase tracking-widest hover:bg-gray-900"
      >
        Load events
      </button>
    </form>
  );
}


