import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Plus, Calendar, Clock, Users, Eye } from 'lucide-react';
import SplineBackground from '@/Components/SplineBackground';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function CapsulesIndex({ auth, time_capsules = [] }) {
    const [capsules, setCapsules] = useState(time_capsules);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, active, revealed, public

    useEffect(() => {
        // Fetch capsules if not provided
        if (!time_capsules || time_capsules.length === 0) {
            setLoading(true);
            fetch('/api/capsules')
                .then(response => response.json())
                .then(data => {
                    setCapsules(data.capsules || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching capsules:', error);
                    setLoading(false);
                });
        }
    }, [time_capsules]);

    const filteredCapsules = capsules.filter(capsule => {
        if (filter === 'all') return true;
        if (filter === 'active') return !capsule.is_revealed && new Date(capsule.reveal_date) > new Date();
        if (filter === 'revealed') return capsule.is_revealed;
        if (filter === 'public') return capsule.is_public;
        return true;
    });

    const getStatusBadge = (capsule) => {
        if (capsule.is_revealed) {
            return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Revealed</span>;
        } else if (new Date(capsule.reveal_date) <= new Date()) {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Ready to Reveal</span>;
        } else {
            return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Locked</span>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const timeUntilReveal = (revealDate) => {
        const now = new Date();
        const reveal = new Date(revealDate);
        const diff = reveal - now;
        
        if (diff <= 0) return 'Ready to reveal';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} days, ${hours} hours`;
        return `${hours} hours`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
            <SplineBackground />
            
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Time Capsules</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Discover and create digital time capsules to preserve memories across time
                                </p>
                            </div>
                            
                            {auth?.user && (
                                <Link
                                    href="/capsules/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Capsule
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex space-x-2">
                        {[
                            { key: 'all', label: 'All Capsules' },
                            { key: 'active', label: 'Active' },
                            { key: 'revealed', label: 'Revealed' },
                            { key: 'public', label: 'Public' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    filter === key
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Capsules Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : filteredCapsules.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No time capsules found</h3>
                            <p className="text-gray-600 mb-4">
                                {filter === 'all' 
                                    ? "Create your first time capsule to get started!"
                                    : `No capsules match the "${filter}" filter.`
                                }
                            </p>
                            {auth?.user && filter === 'all' && (
                                <Link
                                    href="/capsules/create"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Capsule
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCapsules.map((capsule) => (
                                <div
                                    key={capsule.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                                {capsule.title || 'Untitled Capsule'}
                                            </h3>
                                            {getStatusBadge(capsule)}
                                        </div>
                                        
                                        {capsule.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {capsule.description}
                                            </p>
                                        )}
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Created: {formatDate(capsule.created_at)}
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-2" />
                                                Reveal: {formatDate(capsule.reveal_date)}
                                            </div>
                                            
                                            {!capsule.is_revealed && (
                                                <div className="flex items-center text-sm text-indigo-600">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Time until reveal: {timeUntilReveal(capsule.reveal_date)}
                                                </div>
                                            )}
                                            
                                            {capsule.email_recipients && capsule.email_recipients.length > 0 && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    {capsule.email_recipients.length} recipient(s)
                                                </div>
                                            )}
                                            
                                            {capsule.is_public && (
                                                <div className="flex items-center text-sm text-green-600">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Public capsule
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/capsules/${capsule.id}`}
                                                className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                View Details
                                            </Link>
                                            
                                            {capsule.is_revealed && (
                                                <Link
                                                    href={`/capsules/${capsule.id}/reveal`}
                                                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Reveal
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
