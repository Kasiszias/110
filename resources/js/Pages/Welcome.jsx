
import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';

import EconomicDataLoader from '@/Components/EconomicDataLoader';
import WeatherSidebar from '@/Components/WeatherSidebar';
import SplineBackground from '@/Components/SplineBackground';
import FloatingParticles from '@/Components/FloatingParticles';
import InteractiveSidebar from '@/Components/InteractiveSidebar';
import AnimatedText, { FadeInUp, SlideInLeft, SlideInRight } from '@/Components/AnimatedText';

import { Calendar, Clock, Cloud, DollarSign, FileUp, History, Home, Lock, LogOut, Menu, Newspaper, Plus, Shield, Trash2, Upload, User, X, Sparkles, Zap, Star, ArrowRight, Archive, Package, ArchiveRestore, Minimize2, Maximize2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';


export default function Welcome() {
  const page = usePage();
  const auth = page.props.auth || {};
  const user = auth.user || null;
  const isUser = !!user;




  // Enhanced scroll animations - simplified for better performance
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  // Scroll-based icon change state
  const [currentIcon, setCurrentIcon] = useState(History);
  const scrollProgress = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 4]);
  
  // Map scroll progress to different icons
  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (value) => {
      const icons = [History, Package, Archive, Shield, ArchiveRestore];
      const index = Math.floor(value) % icons.length;
      setCurrentIcon(icons[index]);
    });
    
    return () => unsubscribe();
  }, [scrollProgress]);
  

  // Auth forms state
  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);


  // App state

  const [selectedYear, setSelectedYear] = useState(2024);
  const [customYear, setCustomYear] = useState('');
  const [showCustomYearInput, setShowCustomYearInput] = useState(false);
  const [historicalData, setHistoricalData] = useState({ events: [], news: [] });
  const [dataLoading, setDataLoading] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [capsulesLoading, setCapsulesLoading] = useState(false);

  // Popup states for circular buttons
  const [timePeriodPopup, setTimePeriodPopup] = useState(false);
  const [artifactVaultPopup, setArtifactVaultPopup] = useState(false);
  const [historicalLibraryPopup, setHistoricalLibraryPopup] = useState(false);

  const [capsuleForm, setCapsuleForm] = useState({
    name: '',
    description: '',
    reveal_date: '',
    message: '',
    email_recipients: [],
  });


  const [showArtifactModal, setShowArtifactModal] = useState(false);
  const [newArtifact, setNewArtifact] = useState({
    title: '',
    description: '',
    year: selectedYear,
    type: 'Personal Memory',
    file: null,
  });


  // Enhanced sealing states
  const [sealingState, setSealingState] = useState({
    isSealing: false,
    progress: 0,
    stage: 'idle', // idle, validating, creating, processing, uploading, completing
    message: '',
    error: null,
    requestId: null,
    timeoutMs: 300000, // 5 minutes timeout
    retryCount: 0,
    maxRetries: 3
  });

  // Refs
  const heroRef = useRef(null);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const mainAppRef = useRef(null);
  const assembleRef = useRef(null);
  const vaultRef = useRef(null);

  const scroll = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  // Fix CSRF token handling
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || window.csrf_token;
  
  // Configure axios defaults for Laravel
  useEffect(() => {
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
      axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }
    axios.defaults.withCredentials = true;
  }, [csrfToken]);

  // AUTH HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await axios.post(route('login'), loginForm, {

        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true,
      });
      setLoginForm({ email: '', password: '', remember: false });
      setTimeout(() => (window.location.href = '/'), 400);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);

    if (registerForm.password !== registerForm.password_confirmation) {
      setRegisterError('Passwords do not match');
      setRegisterLoading(false);
      return;
    }

    if (registerForm.password.length < 8) {
      setRegisterError('Password must be at least 8 characters');
      setRegisterLoading(false);
      return;
    }

    try {
      await axios.post(route('register'), registerForm, {

        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true,
      });
      setRegisterForm({ name: '', email: '', password: '', password_confirmation: '' });
      setTimeout(() => (window.location.href = '/'), 400);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Registration failed. Email may already be in use.';
      setRegisterError(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        route('logout'),
        {},
        {
          headers: { 'X-CSRF-TOKEN': csrfToken },
          withCredentials: true,
        }
      );
      window.location.href = '/';
    } catch (e) {
      console.error('Logout error', e);
    }
  };




  // DATA LOADERS - Enhanced with better error handling and proper fallbacks
  const loadHistoricalData = async () => {
    if (dataLoading) return;
    setDataLoading(true);

    try {
      const [eventsRes, newsRes] = await Promise.all([
        axios.get(`/api/history?year=${selectedYear}`, {
          headers: { 'X-CSRF-TOKEN': csrfToken }
        }).catch((error) => {
          console.warn('Events API error:', error.response?.status);
          // Return proper fallback structure
          return {
            data: {
              events: [
                {
                  year: selectedYear,
                  text: `Historical events for ${selectedYear} could not be loaded. This might be due to API limitations or network issues.`
                }
              ]
            },
            status: error.response?.status || 422
          };
        }),
        axios.get(`/api/newspapers?year=${selectedYear}`, {
          headers: { 'X-CSRF-TOKEN': csrfToken }
        }).catch((error) => {
          console.warn('News API error:', error.response?.status);
          // Return proper fallback structure
          return {
            data: {
              articles: [
                {
                  title: `News headlines for ${selectedYear} could not be loaded`,
                  description: 'This might be due to API limitations or network issues. You can still add your own memories and artifacts.',
                  source: 'System',
                  thumbnail: null
                }
              ]
            },
            status: error.response?.status || 422
          };
        }),
      ]);

      // Validate response structure with better fallbacks
      const events = eventsRes.data?.events || [];
      const news = newsRes.data?.articles || newsRes.data?.news || [];

      // Ensure we have proper array structures
      const validatedEvents = Array.isArray(events) ? events : [];
      const validatedNews = Array.isArray(news) ? news : [];

      // If both APIs failed and we have empty arrays, provide helpful fallback content
      const finalEvents = validatedEvents.length === 0 ? [
        {
          year: selectedYear,
          text: `No historical events available for ${selectedYear}. You can still create your own time capsule with personal memories.`
        }
      ] : validatedEvents;

      const finalNews = validatedNews.length === 0 ? [
        {
          title: `No news headlines available for ${selectedYear}`,
          description: 'Historical news data may not be available for this year, but you can add your own stories and memories.',
          source: 'System',
          thumbnail: null
        }
      ] : validatedNews;

      setHistoricalData({
        events: finalEvents,
        news: finalNews,
      });
    } catch (e) {
      console.error('History load error', e);
      // Provide comprehensive fallback data
      setHistoricalData({
        events: [
          {
            year: selectedYear,
            text: `Unable to load historical events for ${selectedYear}. Please check your connection and try again.`
          }
        ],
        news: [
          {
            title: 'News data unavailable',
            description: 'Unable to load news headlines. You can still create your time capsule with personal artifacts.',
            source: 'System',
            thumbnail: null
          }
        ]
      });
    } finally {
      setDataLoading(false);
    }
  };


  const loadCapsules = async () => {
    if (!isUser) return;
    setCapsulesLoading(true);
    try {
      const res = await axios.get('/api/my-capsules', {
        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      // Validate response structure
      const capsulesData = res.data?.capsules || res.data || [];
      const validatedCapsules = Array.isArray(capsulesData) ? capsulesData : [];

      setCapsules(validatedCapsules);
    } catch (e) {
      console.error('Capsules load error', e);

      let errorMessage = 'Failed to load capsules';

      if (e.response) {
        const status = e.response.status;
        switch (status) {
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to view capsules.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Failed to load capsules (${status})`;
        }
      } else if (e.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      }

      // Show error but don't break the UI - set empty array as fallback
      console.warn(errorMessage);
      setCapsules([]);
    } finally {
      setCapsulesLoading(false);
    }
  };

  useEffect(() => {
    if (isUser) {
      loadHistoricalData();
      loadCapsules();
    }
  }, [selectedYear, isUser]);

  // ARTIFACT HELPERS
  const addArtifact = (item) => {
    setArtifacts((prev) => [...prev, { ...item, id: Date.now() + Math.random() }]);
  };

  const removeArtifact = (id) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
  };


  // CAPSULE HANDLERS with file upload - ENHANCED VERSION with better error handling
  const sealCapsule = async () => {
    if (!capsuleForm.name || !capsuleForm.reveal_date) {
      alert('Error: Please fill in capsule name and reveal date');
      return;
    }

    if (artifacts.length === 0) {
      alert('Error: Add at least one artifact to the capsule');
      return;
    }

    // Validate reveal date is in the future
    const revealDate = new Date(capsuleForm.reveal_date);
    const now = new Date();
    if (revealDate <= now) {
      alert('Error: Reveal date must be in the future');
      return;
    }

    const formData = new FormData();

    // Basic capsule data
    formData.append('title', capsuleForm.name.trim());
    formData.append('description', capsuleForm.description?.trim() || '');
    formData.append('reveal_date', capsuleForm.reveal_date);
    formData.append('message', capsuleForm.message?.trim() || '');

    // Add email recipients if provided
    if (capsuleForm.email_recipients && capsuleForm.email_recipients.length > 0) {
      const validEmails = capsuleForm.email_recipients.filter(email =>
        email && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      );
      if (validEmails.length > 0) {
        formData.append('email_recipients', JSON.stringify(validEmails));
      }
    }

    // Process artifacts with better validation
    artifacts.forEach((artifact, index) => {
      const title = artifact.title?.trim() || `Artifact ${index + 1}`;
      const description = artifact.description?.trim() || artifact.text?.trim() || '';
      const year = artifact.year || selectedYear;
      const type = artifact.type || 'Personal Memory';

      formData.append(`artifacts[${index}][title]`, title);
      formData.append(`artifacts[${index}][description]`, description);
      formData.append(`artifacts[${index}][year]`, year.toString());
      formData.append(`artifacts[${index}][type]`, type);

      // Handle file uploads
      if (artifact.file) {
        formData.append(`artifacts[${index}][file]`, artifact.file);
      }
    });

    try {
      console.log('Attempting to seal capsule...', {
        name: capsuleForm.name,
        reveal_date: capsuleForm.reveal_date,
        artifacts_count: artifacts.length,
        has_files: artifacts.some(a => a.file)
      });

      const res = await axios.post('/api/capsules', formData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
        timeout: 30000, // 30 second timeout for file uploads
      });

      console.log('Capsule creation response:', res.data);

      // Improved success detection
      const isSuccess = res.status === 201 ||
                       res.status === 200 ||
                       (res.data && (res.data.success === true || res.data.success === 'true')) ||
                       (res.data && res.data.id) ||
                       (res.data && res.data.capsule);

      if (isSuccess) {
        const successMessage = `Capsule "${capsuleForm.name}" sealed successfully! Your time capsule is now locked and will be revealed on ${new Date(capsuleForm.reveal_date).toLocaleDateString()}.`;
        alert(successMessage);

        // Reset form state
        setCapsuleForm({
          name: '',
          description: '',
          reveal_date: '',
          message: '',
          email_recipients: []
        });
        setArtifacts([]);

        // Reload capsules and navigate to vault
        await loadCapsules();
        if (vaultRef.current) {
          scroll(vaultRef);
        }
      } else {
        // More specific error handling
        const errorMsg = res.data?.message ||
                        res.data?.error ||
                        'Capsule creation failed. Please check your data and try again.';
        throw new Error(errorMsg);
      }
    } catch (e) {
      console.error('Capsule creation error:', e);

      let errorMessage = 'Failed to create capsule';

      if (e.response) {
        // Server responded with error status
        const status = e.response.status;
        const data = e.response.data;

        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid capsule data provided';
            break;
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to create capsules.';
            break;
          case 413:
            errorMessage = 'Files are too large. Please reduce file sizes or remove some files.';
            break;
          case 422:
            // Validation errors
            if (data?.errors) {
              const errors = Object.values(data.errors).flat();
              errorMessage = errors.join('. ');
            } else {
              errorMessage = data?.message || 'Validation failed. Please check your input.';
            }
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data?.message || `Server error (${status})`;
        }
      } else if (e.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (e.message) {
        errorMessage = e.message;
      }

      alert('Error: ' + errorMessage);
    }
  };

  const deleteCapsule = async (id) => {
    if (!confirm('Are you sure you want to delete this capsule? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/capsules/${id}`, {
        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true,
      });
      setCapsules(prev => prev.filter(capsule => capsule.id !== id));
    } catch (e) {
      alert('Error deleting capsule: ' + (e.response?.data?.message || e.message));
    }
  };

  // UI helpers
  const timePeriods = [
    { year: 2024, label: '2024 - Present' },
    { year: 2020, label: '2020 - Pandemic' },
    { year: 2010, label: '2010 - Social Media' },
    { year: 2000, label: '2000 - Millennium' },
    { year: 1990, label: '1990 - Digital Age' },
    { year: 1980, label: '1980 - Cold War' },
    { year: 1970, label: '1970 - Disco Era' },
    { year: 1960, label: '1960 - Space Race' },
    { year: 1950, label: '1950 - Post-War' },
    { year: 1945, label: '1945 - WWII End' },
  ];

  const agingOpacity = (year) => {
    const age = new Date().getFullYear() - (year || selectedYear);
    return Math.min(1, 0.5 + age * 0.01);
  };

  // File upload handler for artifact modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid file type (JPEG, PNG, GIF, MP4, PDF, TXT)');
        return;
      }
      
      setNewArtifact(prev => ({ ...prev, file }));
    }
  };



  return (
    <>


      <Head title="Vault - Unearth the past" />





      {/* Enhanced 3D Spline Background */}
      <SplineBackground />
      
      {/* Minimal Floating Particles only */}
      <FloatingParticles count={8} theme="time-capsule" />
      
      {/* Dynamic scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Main scroll container */}
      <div className="relative z-10">
        <style>{`
          html { scroll-behavior: smooth; }
          body {
            background: #0f0d0a;
            color: #f5f1ed;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
          }

          /* Professional 3-Color Gradient System */
          .gradient-text {
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 200%;
            animation: gradient-shift 4s ease-in-out infinite;
          }

          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(139, 92, 246, 0.1);
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
          }

          .panel-gradient {
            background: linear-gradient(135deg, rgba(88, 28, 135, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
            border: 1px solid rgba(88, 28, 135, 0.3);
          }

          .button-primary {
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
            color: white;
            padding: 0.875rem 2.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .button-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .button-primary:hover::before {
            left: 100%;
          }

          .button-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
          }

          .button-outline {
            background: transparent;
            color: #8B5CF6;
            padding: 0.875rem 2.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid #8B5CF6;
            cursor: pointer;
          }

          .button-outline:hover {
            background: rgba(139, 92, 246, 0.1);
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
          }

          .artifact-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(139, 92, 246, 0.15);
            border-radius: 1rem;
            padding: 1.25rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .artifact-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
            transition: left 0.6s;
          }

          .artifact-card:hover::before {
            left: 100%;
          }

          .artifact-card:hover {
            border-color: rgba(139, 92, 246, 0.4);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
          }

          .sepia-aged {
            filter: sepia(0.2) saturate(0.8);
            opacity: 0.95;
          }

          .pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }

          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.3);
              border-color: rgba(139, 92, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 0 20px rgba(139, 92, 246, 0);
              border-color: rgba(139, 92, 246, 0.4);
            }
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* Professional Typography */
          .text-hero {
            font-size: clamp(2.5rem, 5vw, 5rem);
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.1;
          }

          .text-section {
            font-size: clamp(1.5rem, 3vw, 2.5rem);
            font-weight: 600;
            letter-spacing: -0.01em;
            line-height: 1.3;
          }

          .text-body {
            font-size: 1.125rem;
            font-weight: 400;
            line-height: 1.7;
            color: #e2e8f0;
          }

          /* Responsive Grid Improvements */
          @media (max-width: 768px) {
            .text-hero { font-size: clamp(2rem, 8vw, 3.5rem); }
            .text-section { font-size: clamp(1.25rem, 5vw, 2rem); }
            .button-primary, .button-outline { padding: 0.75rem 2rem; }

            /* Mobile layout adjustments */
            .mobile-stack {
              flex-direction: column;
              gap: 1rem;
            }

            .mobile-full-width {
              width: 100%;
            }

            .mobile-padding {
              padding: 1rem;
            }

            .mobile-text-center {
              text-align: center;
            }

            .mobile-grid-cols-1 {
              grid-template-columns: 1fr;
            }

            .mobile-gap-4 {
              gap: 1rem;
            }

            /* Artifact preview mobile improvements */
            .artifact-preview-mobile {
              max-height: 200px;
              overflow-y: auto;
            }

            /* Vault cards mobile */
            .vault-card-mobile {
              margin-bottom: 1rem;
            }
          }

          /* Loading States */
          .loading-shimmer {
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(139, 92, 246, 0.1);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #7C3AED, #DB2777);
          }
        `}</style>


        {/* Enhanced HERO SECTION with 3D effects */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            {/* Floating Icon with enhanced effects */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div 
                  className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 flex items-center justify-center shadow-2xl shadow-purple-500/30 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)"
                  }}
                  animate={{
    boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)"
  }}

                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      key={currentIcon.name}
                      initial={{ scale: 0, rotate: -180, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 180, opacity: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        duration: 0.6
                      }}
                    >
                      {React.createElement(currentIcon, { 
                        className: "w-14 h-14 text-white" 
                      })}
                    </motion.div>
                  </div>
                  
                  {/* Floating particles around icon */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                      style={{
                        top: `${20 + i * 10}%`,
                        left: `${10 + i * 15}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Typography with 3D effects */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-4"
            >
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text relative"
                style={{
                  textShadow: "0 0 30px rgba(168, 85, 247, 0.5)",
                }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="block"
                >
                  Unearth the Past
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                >
                 
                </motion.span>
              </motion.h1>
              
              <motion.h2 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                Create the{' '}
                <motion.span
                  className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Future
                </motion.span>
              </motion.h2>
            </motion.div>

            {/* Enhanced Description */}

            <div className="relative mb-16">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-2xl sm:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.02 }}
                >
                  Preserve your memories in digital time capsules. Create sealed vaults, explore historical moments, and unlock them at the perfect future date.
                </motion.span>
              </motion.p>

              {/* Background glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
            >
              <motion.button
                onClick={() => (isUser ? scroll(mainAppRef) : scroll(registerRef))}
                className="relative group px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-purple-500 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <span className="relative z-10 text-white flex items-center">
                  {isUser ? 'Continue to Your Capsules' : 'Create Your First Capsule'}
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>
              
              {!isUser && (
                <motion.button
                  onClick={() => scroll(loginRef)}
                  className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  I Already Have an Account
                </motion.button>
              )}
            </motion.div>

            {/* Enhanced Feature Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-gray-400"
            >




              {[
                { icon: History, text: "Historical Events", delay: 0 },
                { icon: DollarSign, text: "Economic Data", delay: 0.1 },
                { icon: Cloud, text: "Weather Archives", delay: 0.2 },
                { icon: Archive, text: "Time Capsule Vault", delay: 0.3 },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + feature.delay, duration: 0.5 }}
                  className="flex items-center space-x-2 group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <motion.div
                    className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  <span className="group-hover:text-purple-300 transition-colors duration-300">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* LOGIN SECTION */}
        {!isUser && (
          <motion.section
            ref={loginRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex justify-center items-center px-4 py-12"
          >
            <div className="glass-effect w-full max-w-md p-8 shadow-2xl shadow-purple-500/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Enter Your Vault</h2>
                <p className="text-gray-400 text-sm mt-2">Access your time capsules</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {loginError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {loginError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={loginForm.remember}
                    onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                    className="rounded border-gray-600"
                  />
                  <label htmlFor="remember" className="text-white text-sm">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full button-primary disabled:opacity-50"
                >
                  {loginLoading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => scroll(registerRef)}
                    className="text-purple-400 hover:text-pink-400 transition-colors"
                  >
                    Create one
                  </button>
                </p>
              </form>
            </div>
          </motion.section>
        )}

        {/* REGISTER SECTION */}
        {!isUser && (
          <motion.section
            ref={registerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex justify-center items-center px-4 py-12"
          >
            <div className="glass-effect w-full max-w-md p-8 shadow-2xl shadow-pink-500/10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Create Your Account</h2>
                <p className="text-gray-400 text-sm mt-2">Start preserving memories</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                {registerError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {registerError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    value={registerForm.password_confirmation}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password_confirmation: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Re-enter password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full button-primary disabled:opacity-50"
                >
                  {registerLoading ? 'Creating...' : 'Create Account'}
                </button>

                <p className="text-center text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => scroll(loginRef)}
                    className="text-purple-400 hover:text-pink-400 transition-colors"
                  >
                    Login here
                  </button>
                </p>
              </form>
            </div>
          </motion.section>
        )}


        {/* MAIN APPLICATION (logged in users only) */}
        {isUser && (
          <>

            {/* Enhanced Navigation Bar with 3D effects */}
            <motion.nav
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              className="sticky top-0 z-50 glass-effect border-b border-gray-800/50 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden"
                    whileHover={{ 
                      rotateY: 360,
                      boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative z-10">
                      <History className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  <motion.span 
                    className="text-xl font-bold gradient-text"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Vault - Unearth the past
                  </motion.span>
                </motion.div>

                <div className="hidden md:flex items-center space-x-8">
                  {[
                    { label: "Capsules", action: () => scroll(mainAppRef), icon: Shield },
                    { label: "Vault", action: () => scroll(vaultRef), icon: Archive },
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={item.action}
                      className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors text-sm font-medium group relative px-3 py-2 rounded-lg"
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgba(168, 85, 247, 0.1)"
                      }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-4 h-4 relative z-10" />
                      </motion.div>
                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-3 py-2 rounded-lg group relative"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(239, 68, 68, 0.1)"
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.div
                      whileHover={{ x: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <LogOut className="w-4 h-4 relative z-10" />
                    </motion.div>
                    <span className="relative z-10">Logout</span>
                  </motion.button>
                </div>

                <motion.div 
                  className="md:hidden"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu className="w-6 h-6 text-white hover:text-purple-400 transition-colors cursor-pointer" />
                </motion.div>
              </div>
            </motion.nav>




            {/* Enhanced MAIN APP SECTION with Interactive Sidebars and 3D floating effects */}
            <section ref={mainAppRef} className="min-h-screen py-20 px-4 relative">
              <div className="container mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
                  className="text-center mb-20 relative"
                >
                  {/* Background glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 blur-3xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <FadeInUp delay={0.4}>
                    <motion.h1 
                      className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 gradient-text relative z-10"
                      whileHover={{ scale: 1.02 }}
                      style={{
                        textShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
                      }}
                    >
                      <SlideInLeft delay={0.4} duration={0.6}>
                        Explore and Create
                      </SlideInLeft>
                      <SlideInRight delay={0.6} duration={0.6}>
                        Time Capsules
                      </SlideInRight>
                    </motion.h1>
                  </FadeInUp>
                  

                  <FadeInUp delay={0.8}>
                    <p className="text-2xl sm:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed relative z-10 font-medium">
                      Travel through time periods and curate artifacts for your digital vaults with advanced 3D visualization
                    </p>
                  </FadeInUp>
                </motion.div>



                {/* Circular Button Layout with Content Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Enhanced LEFT: Time Period Selector with Playful Animations */}
                  <motion.div
                    initial={{ opacity: 0, x: -100, rotateY: -15 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      rotateY: 0,
                      scale: 1
                    }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      x: -5, 
                      rotateY: 5,
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.3)"
                    }}
                    className="lg:col-span-1"
                  >
                  <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6 h-[600px] relative overflow-hidden group transition-all duration-300">
                    {/* Playful background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none"
                      animate={{
                        opacity: scrollYProgress.get() > 0.2 ? 0.8 : 0.4,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="h-full flex flex-col">
                      <h3 className="text-lg font-semibold text-white mb-6 flex items-center sticky top-0 z-10 bg-gradient-to-b from-black/50 to-transparent pb-4">
                        <Clock className="w-5 h-5 mr-2 text-purple-400" />
                        Time Period Selector
                        <span className="ml-auto text-sm font-normal text-purple-400">({selectedYear})</span>
                      </h3>







                      {/* Scrollable Time Periods - ENHANCED SCROLLABILITY */}
                      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800 custom-scrollbar" style={{ 
                        maxHeight: 'calc(100vh - 500px)', 
                        minHeight: '300px',
                        scrollBehavior: 'smooth'
                      }}>
                        {timePeriods.map((period) => (
                          <motion.button
                            key={period.year}
                            onClick={() => setSelectedYear(period.year)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative ${
                              selectedYear === period.year
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'bg-gray-900/50 hover:bg-gray-800 text-white hover:border-purple-500/30'
                            }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                          >
                            {selectedYear === period.year && (
                              <motion.span 
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-white"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                            <span className={`ml-6 ${selectedYear === period.year ? 'text-white' : ''}`}>
                              {period.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>






                  {/* Enhanced CENTER: Artifacts Panel with Enhanced Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 100, rotateX: -10, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      scale: 1
                    }}
                    transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      y: -5,
                      scale: 1.02,
                      rotateY: 2,
                      boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.3)"
                    }}
                    className="lg:col-span-1"
                  >
                    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-2xl p-6 h-[600px] relative overflow-hidden group transition-all duration-300">
                      {/* Playful background effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent pointer-events-none"
                        animate={{
                          opacity: scrollYProgress.get() > 0.4 ? 0.8 : 0.4,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-gradient-to-b from-black/50 to-transparent pb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center">
                            <FileUp className="w-5 h-5 mr-2 text-purple-400" />
                            Your Artifact Vault
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                              {selectedYear}
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-500/20 text-pink-400">
                              {artifacts.length} items
                            </span>
                          </div>
                        </div>

                        {/* Scrollable Artifacts List */}
                        {artifacts.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center text-center py-12">
                            <div>
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                              </motion.div>
                              <p className="font-semibold mb-2 text-white">Empty Artifact Vault</p>
                              <p className="text-sm text-gray-400 mb-4">Add historical events, memories, or news headlines</p>
                              <button
                                onClick={() => setShowArtifactModal(true)}
                                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                              >
                                Add First Artifact
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
                            <AnimatePresence>
                              {artifacts.map((artifact, index) => (
                                <motion.div
                                  key={artifact.id}
                                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                  animate={{ 
                                    opacity: agingOpacity(artifact.year), 
                                    scale: 1,
                                    y: 0
                                  }}
                                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="artifact-card sepia-aged relative group hover:border-purple-500/50"
                                  layout
                                >
                                  {/* Enhanced Artifact Card */}
                                  <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white text-sm mb-1 truncate">{artifact.title}</h4>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                            {artifact.year}
                                          </span>
                                          <span className="px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-xs">
                                            {artifact.type}
                                          </span>
                                          {artifact.file && (
                                            <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center">
                                              <Upload className="w-3 h-3 mr-1" />
                                              File
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <motion.button
                                        onClick={() => removeArtifact(artifact.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/10"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                    
                                    <p className="text-sm text-gray-300 line-clamp-3 mb-3 leading-relaxed">
                                      {artifact.description}
                                    </p>
                                    
                                    {/* Artifact Preview Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                                      <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date().toLocaleDateString()}
                                      </div>
                                      <motion.button
                                        onClick={() => {
                                          // Preview artifact functionality
                                          alert(`Previewing: ${artifact.title}\n\n${artifact.description}`);
                                        }}
                                        className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        Preview
                                      </motion.button>
                                    </div>
                                  </div>
                                  
                                  {/* Hover glow effect */}
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 rounded-lg opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                  />
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* Action Buttons - Sticky at Bottom */}
                        <div className="space-y-3 pt-4 border-t border-gray-700 sticky bottom-0 bg-gradient-to-t from-black/90 to-transparent">
                          <motion.button
                            onClick={() => setShowArtifactModal(true)}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-5 h-5" />
                            Add New Artifact
                          </motion.button>

                          {artifacts.length > 0 && (
                            <motion.button
                              onClick={() => scroll(assembleRef)}
                              className="w-full py-3 rounded-lg bg-pink-500/20 border border-pink-500 text-pink-400 hover:bg-pink-500/30 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Shield className="w-5 h-5" />
                              Review & Seal Capsule
                              <span className="text-xs px-2 py-1 rounded-full bg-pink-500/30">
                                {artifacts.length}
                              </span>
                            </motion.button>
                          )}
                          
                          {/* Progress indicator when adding artifacts */}
                          {artifacts.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                <span>Capsule Progress</span>
                                <span>{Math.min(artifacts.length * 25, 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <motion.div
                                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(artifacts.length * 25, 100)}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>





                  {/* Enhanced RIGHT: Historical Library with Interactive Animations */}
                  <motion.div
                    initial={{ opacity: 0, x: 100, rotateY: 15, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      scale: 1
                    }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{
                      x: 5,
                      rotateY: -5,
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.3)"
                    }}
                    className="lg:col-span-1"
                  >
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6 h-[600px] overflow-y-auto relative overflow-hidden group transition-all duration-300">

                      {/* Wikipedia Events */}
                      <div className="mb-8">
                        <h4 className="font-semibold text-white mb-3 flex items-center text-sm">
                          <History className="w-4 h-4 mr-2 text-purple-400" />
                          Wikipedia Events (Dec 17)
                        </h4>
                        {dataLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
                          </div>
                        ) : historicalData.events.length > 0 ? (
                          <div className="space-y-3">
                            {historicalData.events.slice(0, 3).map((event, i) => (
                              <div key={i} className="artifact-card p-4">
                                <p className="text-xs text-purple-400 font-semibold mb-1">{event.year}</p>
                                <p className="text-sm text-white mb-3 line-clamp-2">{event.text}</p>
                                <button
                                  onClick={() =>
                                    addArtifact({
                                      title: `Event ${event.year}`,
                                      description: event.text,
                                      year: event.year,
                                      type: 'Historical Event',
                                    })
                                  }
                                  className="w-full text-xs py-2 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                >
                                  Add to Capsule
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No events found</p>
                        )}
                      </div>

                      {/* News Headlines */}
                      <div className="mb-8">
                        <h4 className="font-semibold text-white mb-3 flex items-center text-sm">
                          <Newspaper className="w-4 h-4 mr-2 text-purple-400" />
                          News Headlines ({selectedYear})
                        </h4>
                        {dataLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
                          </div>
                        ) : historicalData.news.length > 0 ? (
                          <div className="space-y-3">
                            {historicalData.news.slice(0, 2).map((article, i) => (
                              <div key={i} className="artifact-card p-4">
                                {article.thumbnail && (
                                  <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className="w-full h-24 object-cover rounded-lg mb-3"
                                  />
                                )}
                                <p className="text-xs text-purple-400 font-semibold mb-1">{article.source}</p>
                                <p className="text-sm text-white mb-3 line-clamp-2">{article.title}</p>
                                <button
                                  onClick={() =>
                                    addArtifact({
                                      title: article.title,
                                      description: article.description || article.title,
                                      year: selectedYear,
                                      type: 'News Headline',
                                    })
                                  }
                                  className="w-full text-xs py-2 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                                >
                                  Add to Capsule
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No news for this year</p>
                        )}
                      </div>

                      {/* Economic Data */}
                      <div className="mb-8">
                        <EconomicDataLoader
                          year={selectedYear}
                          onAdd={(item) => addArtifact(item)}
                        />
                      </div>

                      {/* Weather */}
                      <WeatherSidebar
                        year={selectedYear}
                        onAddSummary={(summary) =>
                          addArtifact({
                            title: `Weather ${selectedYear}`,
                            description: summary,
                            year: selectedYear,
                            type: 'Weather',
                          })
                        }
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ASSEMBLE CAPSULE SECTION */}
            {artifacts.length > 0 && (
              <motion.section
                ref={assembleRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen py-16 px-4"
              >
                <div className="container mx-auto max-w-4xl">
                  <h2 className="text-4xl font-bold mb-2 gradient-text text-center">
                    Assemble Your Time Capsule
                  </h2>
                  <p className="text-gray-400 text-center mb-12">
                    Configure and seal your collection of memories
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Preview */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-effect rounded-2xl p-8"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-8">Preview</h3>
                      <div className="text-center">
                        <div className="relative inline-block mb-8">
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center pulse-glow">
                            <Shield className="w-20 h-20 text-purple-400" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Capsule Name</p>
                          <p className="text-lg font-semibold text-white">
                            {capsuleForm.name || 'Untitled Capsule'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Artifacts Included</p>
                          <p className="text-lg font-semibold text-purple-400">{artifacts.length} items</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Reveal Date</p>
                          <p className="text-sm text-white">
                            {capsuleForm.reveal_date ? new Date(capsuleForm.reveal_date).toLocaleDateString() : 'Not set'}
                          </p>
                        </div>

                        {/* Enhanced Artifact Preview */}
                        {artifacts.length > 0 && (
                          <div className="mt-6">
                            <p className="text-xs text-gray-400 font-semibold mb-3">Artifact Preview</p>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              <AnimatePresence>
                                {artifacts.map((artifact, index) => (
                                  <motion.div
                                    key={artifact.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{artifact.title}</p>
                                        <p className="text-xs text-white/70">{artifact.type} • {artifact.year}</p>
                                        <p className="text-xs text-white/80 line-clamp-2 mt-1">{artifact.description}</p>
                                      </div>
                                      <button
                                        onClick={() => removeArtifact(artifact.id)}
                                        className="ml-2 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Configuration */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-effect rounded-2xl p-8"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-8">Configuration</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Capsule Name *
                          </label>
                          <input
                            type="text"
                            value={capsuleForm.name}
                            onChange={(e) =>
                              setCapsuleForm({ ...capsuleForm, name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                            placeholder="My 2024 Memories"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            value={capsuleForm.description}
                            onChange={(e) =>
                              setCapsuleForm({ ...capsuleForm, description: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                            placeholder="Describe your capsule..."
                            rows="3"
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Reveal Date *
                          </label>
                          <input
                            type="date"
                            value={capsuleForm.reveal_date}
                            onChange={(e) =>
                              setCapsuleForm({ ...capsuleForm, reveal_date: e.target.value })
                            }
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                            required
                          />
                        </div>


                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Personal Message
                          </label>
                          <textarea
                            value={capsuleForm.message}
                            onChange={(e) =>
                              setCapsuleForm({ ...capsuleForm, message: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                            placeholder="To my future self..."
                            rows="4"
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Email Recipients (Optional)
                          </label>
                          <input
                            type="email"
                            value={capsuleForm.email_recipients.join(', ')}
                            onChange={(e) =>
                              setCapsuleForm({
                                ...capsuleForm,
                                email_recipients: e.target.value.split(',').map(email => email.trim()).filter(email => email)
                              })
                            }
                            className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                            placeholder="friend@example.com, family@example.com"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Separate multiple emails with commas. Recipients will receive the capsule on the reveal date.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                          <p className="text-sm text-yellow-400">
                            Warning: Once sealed, this capsule will be locked until the reveal date.
                          </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => scroll(mainAppRef)}
                            className="flex-1 py-3 rounded-lg border border-gray-600 text-white hover:bg-gray-800/50 transition-colors font-semibold"
                          >
                            Back
                          </button>
                          <button
                            onClick={sealCapsule}
                            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300"
                            disabled={!capsuleForm.name || !capsuleForm.reveal_date || artifacts.length === 0}
                          >
                            <Lock className="w-5 h-5 inline mr-2" />
                            Seal Capsule
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>
            )}


            {/* Enhanced VAULT SECTION with 3D floating effects */}
            <motion.section
              ref={vaultRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="min-h-screen py-20 px-4 relative"
            >
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-2 gradient-text">
                    Your Time Capsule Vault
                  </h2>
                  <p className="text-lg text-gray-400">
                    A collection of your preserved memories and moments
                  </p>
                </div>

                <div className="text-center mb-12">
                  <button
                    onClick={() => scroll(mainAppRef)}
                    className="button-primary"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create New Capsule
                  </button>
                </div>

                {capsulesLoading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-400">Loading your capsules...</p>
                  </div>
                ) : capsules.length === 0 ? (
                  <div className="text-center py-20">
                    <Shield className="w-32 h-32 mx-auto mb-6 opacity-30" />
                    <h3 className="text-2xl font-semibold text-white mb-3">No capsules yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Create your first time capsule to start preserving memories for the future
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {capsules.map((capsule) => {
                      const revealDate = new Date(capsule.reveal_date);
                      const now = new Date();
                      const isUnlocked = now >= revealDate;
                      const daysLeft = Math.max(
                        0,
                        Math.ceil((revealDate - now) / (1000 * 60 * 60 * 24))
                      );

                      return (

                        <motion.div
                          key={capsule.id}
                          initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
                          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                          whileHover={{ 
                            scale: 1.05, 
                            y: -8,
                            rotateX: 5,
                            rotateY: 5,
                            boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4)"
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            delay: capsule.id * 0.1
                          }}
                          className="artifact-card p-8 sepia-aged relative overflow-hidden group cursor-pointer"
                        >
                          {/* Floating background glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100"
                            animate={{
                              scale: [1, 1.02, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-white text-lg">{capsule.title}</h3>
                              <p className="text-sm text-gray-400 mt-1">{capsule.description}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20">
                              {isUnlocked ? (
                                <Shield className="w-5 h-5 text-green-400" />
                              ) : (
                                <Lock className="w-5 h-5 text-purple-400" />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 mb-6 text-sm">
                            <p className="text-white/70">
                              Created: {new Date(capsule.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-white/70">
                              Opens: {revealDate.toLocaleDateString()}
                            </p>
                          </div>

                          {isUnlocked ? (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-6">
                              <p className="text-sm text-green-400 font-semibold">Unlocked</p>
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-6">
                              <p className="text-sm text-purple-400 font-semibold">Locked</p>
                              <p className="text-xs text-gray-400">Opens in {daysLeft} days</p>
                            </div>
                          )}

                          <div className="mb-4">
                            <p className="text-xs text-gray-400 font-semibold mb-2">Artifacts</p>
                            <p className="text-lg font-bold text-purple-400">
                              {capsule.artifacts?.length || 0} items
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button className="flex-1 py-2 text-sm rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors font-semibold">
                              View
                            </button>
                            <button
                              onClick={() => deleteCapsule(capsule.id)}
                              className="flex-1 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.section>

            {/* ARTIFACT MODAL */}
            <AnimatePresence>
              {showArtifactModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowArtifactModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold gradient-text">Add New Artifact</h3>
                      <button
                        onClick={() => setShowArtifactModal(false)}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newArtifact.title}
                          onChange={(e) =>
                            setNewArtifact({ ...newArtifact, title: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                          placeholder="Artifact title"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          value={newArtifact.description}
                          onChange={(e) =>
                            setNewArtifact({ ...newArtifact, description: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                          placeholder="Describe your artifact..."
                          rows="3"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Year
                        </label>
                        <input
                          type="number"
                          value={newArtifact.year}
                          onChange={(e) =>
                            setNewArtifact({
                              ...newArtifact,
                              year: parseInt(e.target.value) || selectedYear,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg glass-effect border border-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>



                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Category
                        </label>
                        <select
                          value={newArtifact.type}
                          onChange={(e) =>
                            setNewArtifact({ ...newArtifact, type: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg border-2 focus:border-purple-500 focus:outline-none transition-all duration-300"
                          style={{ 
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            borderColor: '#000000'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                          onBlur={(e) => e.target.style.borderColor = '#000000'}
                        >
                          <option value="Personal Memory" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Personal Memory</option>
                          <option value="Photo" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Photo</option>
                          <option value="Video" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Video</option>
                          <option value="Text" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Text</option>
                          <option value="Prediction" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Prediction</option>
                          <option value="Historical Event" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Historical Event</option>
                          <option value="News Headline" style={{ backgroundColor: '#000000', color: '#ffffff' }}>News Headline</option>
                          <option value="Economic Data" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Economic Data</option>
                          <option value="Weather" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Weather</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          File Attachment (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors cursor-pointer">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer block">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-white font-semibold">
                              {newArtifact.file ? newArtifact.file.name : 'Click to upload'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Supports images, videos, documents
                            </p>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setShowArtifactModal(false)}
                          className="flex-1 py-3 rounded-lg border border-gray-600 text-white hover:bg-gray-800/50 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (newArtifact.title && newArtifact.description) {
                              addArtifact({
                                ...newArtifact,
                                year: newArtifact.year || selectedYear,
                              });
                              setNewArtifact({
                                title: '',
                                description: '',
                                year: selectedYear,
                                type: 'Personal Memory',
                                file: null,
                              });
                              setShowArtifactModal(false);
                            } else {
                              alert('Please fill in title and description');
                            }
                          }}
                          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300"
                        >
                          Add Artifact
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );
}