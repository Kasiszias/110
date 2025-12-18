import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Eye, Lock, Unlock, Mail, Download } from 'lucide-react';
import SplineBackground from '@/Components/SplineBackground';
import LoadingSpinner from '@/Components/LoadingSpinner';
import Countdown from '@/Components/Countdown';

export default function CapsuleShow({ auth, capsule: initialCapsule = null }) {
    const { id } = useParams();
    const [capsule, setCapsule] = useState(initialCapsule);
    const [loading, setLoading] = useState(!initialCapsule);
    const [revealed, setRevealed] = useState(false);
    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        if (!initialCapsule) {
            setLoading(true);
            fetch(`/api/capsules/${id}`)
                .then(response => response.json())
                .then(data => {
                    setCapsule(data.capsule);
                    setRevealed(data.capsule?.is_revealed || false);
                    setArtifacts(data.artifacts || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching capsule:', error);
                    setLoading(false);
                });
        } else {
            setRevealed(initialCapsule.is_revealed);
            setArtifacts(initialCapsule.artifacts || []);
        }
    }, [id, initialCapsule]);

    const handleReveal = async () => {
        try {
            const response = await fetch(`/api/capsules/${id}/reveal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                }
            });
            
            const data = await response.json();
            if (data.success) {
                setRevealed(true);
                setArtifacts(data.artifacts || []);
                if (capsule) {
                    setCapsule({ ...capsule, is_revealed: true });
                }
            }
        } catch (error) {
            console.error('Error revealing capsule:', error);
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

    const getStatusInfo = () => {
        if (!capsule) return null;
        
        if (capsule.is_revealed) {
            return {
                status: 'revealed',
                label: 'Revealed',
                color: 'green',
                icon: <Unlock className="h-4 w-4" />
            };
        } else if (new Date(capsule.reveal_date) <= new Date()) {
            return {
                status: 'ready',
                label: 'Ready to Reveal',
                color: 'yellow',
                icon: <Clock className="h-4 w-4" />
            };
        } else {
            return {
                status: 'locked',
                label: 'Locked',
                color: 'red',
                icon: <Lock className="h-4 w-4" />
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
                <SplineBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (!capsule) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
                <SplineBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Capsule Not Found</h1>
                        <Link
                            href="/capsules"
                            className="text-indigo-600 hover:text-indigo-800 underline"
                        >
                            Back to Capsules
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
            <SplineBackground />
            
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/capsules"
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    ← Back to Capsules
                                </Link>
                            </div>
                            
                            {auth?.user && capsule.user_id === auth.user.id && (
                                <Link
                                    href={`/capsules/${id}/edit`}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Edit Capsule
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Capsule Header */}
                        <div className="px-6 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">
                                        {capsule.title || 'Untitled Time Capsule'}
                                    </h1>
                                    {capsule.description && (
                                        <p className="text-indigo-100 text-lg">
                                            {capsule.description}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex items-center space-x-2 ml-6">
                                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        statusInfo?.color === 'green' ? 'bg-green-500 text-white' :
                                        statusInfo?.color === 'yellow' ? 'bg-yellow-500 text-white' :
                                        'bg-red-500 text-white'
                                    }`}>
                                        {statusInfo?.icon}
                                        <span className="ml-1">{statusInfo?.label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Capsule Details */}
                        <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-5 w-5 mr-3" />
                                        <div>
                                            <div className="font-medium">Created</div>
                                            <div className="text-sm">{formatDate(capsule.created_at)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="h-5 w-5 mr-3" />
                                        <div>
                                            <div className="font-medium">Reveal Date</div>
                                            <div className="text-sm">{formatDate(capsule.reveal_date)}</div>
                                        </div>
                                    </div>
                                    
                                    {!capsule.is_revealed && new Date(capsule.reveal_date) > new Date() && (
                                        <div className="flex items-center text-indigo-600">
                                            <Countdown targetDate={capsule.reveal_date} />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    {capsule.email_recipients && capsule.email_recipients.length > 0 && (
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="h-5 w-5 mr-3" />
                                            <div>
                                                <div className="font-medium">Recipients</div>
                                                <div className="text-sm">{capsule.email_recipients.length} email(s)</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {capsule.is_public && (
                                        <div className="flex items-center text-green-600">
                                            <Eye className="h-5 w-5 mr-3" />
                                            <div>
                                                <div className="font-medium">Visibility</div>
                                                <div className="text-sm">Public Capsule</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center text-gray-600">
                                        <div className="h-5 w-5 mr-3" />
                                        <div>
                                            <div className="font-medium">Artifacts</div>
                                            <div className="text-sm">{artifacts.length} item(s)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reveal Section */}
                        {!capsule.is_revealed && new Date(capsule.reveal_date) <= new Date() && (
                            <div className="px-6 py-6 bg-yellow-50 border-t border-yellow-200">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        This capsule is ready to be revealed!
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {auth?.user && capsule.user_id === auth.user.id 
                                            ? "You can reveal this capsule now."
                                            : "You have permission to reveal this capsule."
                                        }
                                    </p>
                                    
                                    {auth?.user && (
                                        <button
                                            onClick={handleReveal}
                                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Unlock className="h-5 w-5 mr-2" />
                                            Reveal Capsule
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Artifacts Section */}
                        {revealed && (
                            <div className="px-6 py-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Capsule Contents
                                </h3>
                                
                                {artifacts.length === 0 ? (
                                    <p className="text-gray-600">No artifacts found in this capsule.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {artifacts.map((artifact) => (
                                            <div
                                                key={artifact.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">
                                                        {artifact.title || 'Untitled Artifact'}
                                                    </h4>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        artifact.type === 'text' ? 'bg-blue-100 text-blue-800' :
                                                        artifact.type === 'image' ? 'bg-green-100 text-green-800' :
                                                        artifact.type === 'video' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {artifact.type}
                                                    </span>
                                                </div>
                                                
                                                {artifact.content && (
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                        {artifact.content}
                                                    </p>
                                                )}
                                                
                                                {artifact.file_path && (
                                                    <div className="flex items-center text-sm text-indigo-600">
                                                        <Download className="h-4 w-4 mr-1" />
                                                        <a 
                                                            href={`/storage/${artifact.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            Download File
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
