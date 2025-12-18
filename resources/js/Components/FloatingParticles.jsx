
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingParticles = ({ count = 8, theme = 'time-capsule' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, // 2-8px (much smaller)
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      duration: Math.random() * 25 + 20, // 20-45 seconds (slower)
      delay: Math.random() * 15, // 0-15 seconds delay
      opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 (much dimmer)
    }));
  }, [count]);

  const getParticleColor = (index) => {
    const colors = [
      'bg-purple-400',
      'bg-pink-400', 
      'bg-blue-400',
      'bg-indigo-400',
      'bg-purple-300',
      'bg-pink-300'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Minimal floating dots only */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${getParticleColor(particle.id)}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ 
            y: '100vh',
            x: `${particle.x}vw`,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: ['100vh', '-10vh'],
            x: [
              `${particle.x}vw`,
              `${particle.x + (Math.random() * 20 - 10)}vw`,
              `${particle.x + (Math.random() * 30 - 15)}vw`,
            ],
            opacity: [0, particle.opacity, particle.opacity, 0],
            scale: [0.5, 1, 0.8, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}

      {/* Very minimal geometric particles */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`minimal-${i}`}
          className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0, 0.2, 0],
            scale: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
