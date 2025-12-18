import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const InteractiveSidebar = ({ children, position = 'left' }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimation();
  const { scrollY } = useScroll();
  
  const slideVariants = {
    open: {
      x: position === 'left' ? 0 : 'calc(100% - 320px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: position === 'left' ? '-100%' : '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Handle scroll direction and sidebar behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      setLastScrollY(currentScrollY);

      // Auto-hide/show sidebar based on scroll direction
      if (direction === 'down' && isOpen) {
        // Scroll down - hide sidebar
        controls.start('closed');
        setIsOpen(false);
      } else if (direction === 'up' && !isOpen) {
        // Scroll up - show sidebar
        controls.start('open');
        setIsOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection, isOpen, controls]);

  // Animate content on scroll
  const contentY = useTransform(scrollY, [0, 300], [0, -30]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0.7]);

  const toggleSidebar = () => {
    if (isOpen) {
      controls.start('closed');
      setIsOpen(false);
    } else {
      controls.start('open');
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full w-80 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-${position === 'left' ? 'r' : 'l'} border-purple-500/20 z-50 shadow-2xl`}
        variants={slideVariants}
        initial="open"
        animate={controls}
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Toggle Button */}
        <motion.button
          onClick={toggleSidebar}
          className={`absolute top-6 ${position === 'left' ? '-right-4' : '-left-4'} w-8 h-8 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {position === 'left' ? (

              isOpen ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />
            ) : (

              isOpen ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </motion.div>
        </motion.button>

        {/* Sidebar Content */}
        <motion.div
          className="h-full p-6 overflow-y-auto"
          variants={contentVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          {children}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Floating particles inside sidebar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Meeting Point Animation */}
      <motion.div
        className={`fixed top-1/2 ${position === 'left' ? 'left-80' : 'right-80'} transform -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-purple-500/50 to-pink-500/50 rounded-full z-40`}
        animate={{
          scaleY: isOpen ? 1 : 0.3,
          opacity: isOpen ? 0.6 : 0.2,
        }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: isOpen ? '0 0 10px rgba(168, 85, 247, 0.3)' : 'none',
        }}
      />
    </>
  );
};

export default InteractiveSidebar;
