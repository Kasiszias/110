import React, { Suspense, useEffect, useState, memo } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const SplineBackground = memo(({ scene = "https://prod.spline.design/kww-Gw6bRsQ8FX4d/scene.splinecode" }) => {
    const [splineApp, setSplineApp] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleSplineLoad = (spline) => {
        setSplineApp(spline);
        setIsLoaded(true);
        console.log('Spline scene loaded successfully');
    };

    const handleSplineError = (error) => {
        console.error('Spline loading error:', error);
        setHasError(true);
        setIsLoaded(true);
    };

    // Cursor interaction (optional, can be removed for better performance)
    useEffect(() => {
        if (!splineApp) return;

        const moveCursor = (e) => {
            try {
                // Throttled cursor interaction
                const objects = splineApp.findObjectsByName('Eye');
                objects.forEach(obj => {
                    obj.lookAt && obj.lookAt(new window.Vector3(e.clientX, e.clientY, 0));
                });
            } catch (error) {
                // Silently fail
            }
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [splineApp]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Loading skeleton */}
            {!isLoaded && (
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Error fallback */}
            {hasError ? (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20">
                    <div className="absolute inset-0 backdrop-blur-3xl" />
                </div>
            ) : (
                <Suspense fallback={null}>
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isLoaded ? 1 : 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Spline
                            scene={scene}
                            onLoad={handleSplineLoad}
                            onError={handleSplineError}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </motion.div>
                </Suspense>
            )}

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        </div>
    );
});

SplineBackground.displayName = 'SplineBackground';

export default SplineBackground;
