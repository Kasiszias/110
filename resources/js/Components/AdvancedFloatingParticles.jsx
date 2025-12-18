import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AdvancedFloatingParticles = ({ count = 30 }) => {
  const [particles, setParticles] = useState([]);

  // Time capsule themed particle types
  const particleTypes = [
    { shape: 'circle', color: 'rgba(168, 85, 247, 0.6)', size: 4 },
    { shape: 'square', color: 'rgba(59, 130, 246, 0.4)', size: 6 },
    { shape: 'triangle', color: 'rgba(34, 197, 94, 0.5)', size: 5 },
    { shape: 'diamond', color: 'rgba(251, 191, 36, 0.3)', size: 8 },
    { shape: 'capsule', color: 'rgba(236, 72, 153, 0.4)', size: 10 },
    { shape: 'hourglass', color: 'rgba(139, 92, 246, 0.3)', size: 7 },
  ];


  const generateParticles = () => {
    // Ensure we have a valid window object and dimensions
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
    
    const newParticles = Array.from({ length: count }, (_, i) => {
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      
      // Ensure all values are valid numbers, not NaN
      const x = isFinite(Math.random() * width) ? Math.random() * width : width / 2;
      const y = isFinite(Math.random() * height) ? Math.random() * height : height / 2;
      const duration = isFinite(Math.random() * 20 + 15) ? Math.random() * 20 + 15 : 20;
      const delay = isFinite(Math.random() * 5) ? Math.random() * 5 : 0;
      const rotationSpeed = isFinite((Math.random() - 0.5) * 360) ? (Math.random() - 0.5) * 360 : 0;
      const opacity = isFinite(Math.random() * 0.8 + 0.2) ? Math.random() * 0.8 + 0.2 : 0.5;
      
      return {
        id: i,
        x,
        y,
        ...type,
        duration,
        delay,
        rotationSpeed,
        opacity,
      };
    });
    setParticles(newParticles);
  };

  useEffect(() => {
    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, [count]);

  const ParticleComponent = ({ particle }) => {
    const controls = useAnimation();

    const startAnimation = async () => {
      const animations = {
        y: [null, -100, window.innerHeight + 100],
        x: [null, Math.random() * 200 - 100, Math.random() * window.innerWidth],
        rotate: [0, particle.rotationSpeed, particle.rotationSpeed * 2],
        opacity: [0, particle.opacity, 0],
        scale: [0.5, 1, 0.8, 0],
      };

      await controls.start({
        ...animations,
        transition: {
          duration: particle.duration,
          repeat: Infinity,
          delay: particle.delay,
          ease: "linear",
          times: [0, 0.3, 0.7, 1],
        }
      });
    };

    useEffect(() => {
      startAnimation();
    }, []);

    const renderShape = () => {
      const baseStyle = {
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
      };

      switch (particle.shape) {
        case 'circle':
          return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
        case 'square':
          return <div style={baseStyle} />;
        case 'triangle':
          return (
            <div
              style={{
                ...baseStyle,
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderLeft: `${particle.size / 2}px solid transparent`,
                borderRight: `${particle.size / 2}px solid transparent`,
                borderBottom: `${particle.size}px solid ${particle.color}`,
              }}
            />
          );
        case 'diamond':
          return (
            <div
              style={{
                ...baseStyle,
                transform: 'rotate(45deg)',
              }}
            />
          );
        case 'capsule':
          return (
            <div
              style={{
                ...baseStyle,
                borderRadius: particle.size / 2,
                width: particle.size * 1.5,
              }}
            />
          );
        case 'hourglass':
          return (
            <div
              style={{
                ...baseStyle,
                width: particle.size * 0.7,
                height: particle.size * 1.2,
                background: 'linear-gradient(to bottom, transparent 45%, rgba(139, 92, 246, 0.3) 45%, rgba(139, 92, 246, 0.3) 55%, transparent 55%)',
                border: `1px solid ${particle.color}`,
              }}
            />
          );
        default:
          return <div style={baseStyle} />;
      }
    };

    return (
      <motion.div
        animate={controls}
        className="absolute pointer-events-none"
        style={{
          left: particle.x,
          top: particle.y,
        }}
      >
        {renderShape()}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(particle => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
      
      {/* Special time capsule shaped particles */}
      <motion.div
        className="absolute"
        style={{
          left: '10%',
          top: '20%',
        }}
        animate={{
          y: [0, -50, 0],
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-8 bg-purple-500/20 rounded-lg border border-purple-400/30 backdrop-blur-sm relative">
          <div className="absolute top-1 left-1 right-1 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-purple-400/40 rounded"></div>
        </div>
      </motion.div>

      <motion.div
        className="absolute"
        style={{
          right: '15%',
          bottom: '30%',
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-4 h-4 bg-blue-400/30 rounded-full relative">
          <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
        </div>
      </motion.div>

      {/* Animated orbs */}
      <motion.div
        className="absolute"
        style={{
          left: '80%',
          top: '70%',
        }}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-pink-300/20"></div>
      </motion.div>
    </div>
  );
};

export default AdvancedFloatingParticles;
