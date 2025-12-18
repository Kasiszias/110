import React, { useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const AnimatedText = ({ 
  children, 
  delay = 0,
  duration = 0.6,
  direction = 'up', // 'up', 'down', 'left', 'right'
  once = true,
  className = '',
  style = {},
  ...props 
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });
  const controls = useAnimation();

  const directionVariants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
      scale: direction === 'left' || direction === 'right' ? 0.8 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay,
        duration,
        ease: 'easeOut',
      },
    },
  };

  // Character-level animation for text content
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: delay + (i * 0.05),
        duration: 0.3,
      },
    }),
  };

  // Check if children is text content
  const isText = typeof children === 'string';

  useEffect(() => {
    if (isInView && (!once || !hasAnimated)) {
      controls.start('visible');
      setHasAnimated(true);
    } else if (!isInView && !once) {
      controls.start('hidden');
    }
  }, [isInView, controls, delay, once, hasAnimated]);

  if (isText) {
    // Split text into individual characters for animation
    const letters = children.split('');
    
    return (
      <motion.span
        ref={ref}
        className={`inline-block ${className}`}
        style={style}
        initial="hidden"
        animate={controls}
        variants={directionVariants}
        {...props}
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            custom={index}
            variants={textVariants}
            style={{
              display: char === ' ' ? 'inline' : 'inline-block',
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={controls}
      variants={directionVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Convenience components for common animations
export const FadeInUp = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <AnimatedText direction="up" delay={delay} duration={duration} {...props}>
    {children}
  </AnimatedText>
);

export const FadeInDown = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <AnimatedText direction="down" delay={delay} duration={duration} {...props}>
    {children}
  </AnimatedText>
);

export const SlideInLeft = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <AnimatedText direction="left" delay={delay} duration={duration} {...props}>
    {children}
  </AnimatedText>
);

export const SlideInRight = ({ children, delay = 0, duration = 0.6, ...props }) => (
  <AnimatedText direction="right" delay={delay} duration={duration} {...props}>
    {children}
  </AnimatedText>
);

export default AnimatedText;
