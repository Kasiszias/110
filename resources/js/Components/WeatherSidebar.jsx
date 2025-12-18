
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Cloud, Thermometer, Sun, CloudRain } from 'lucide-react';

export default function WeatherSidebar({ year, onAddSummary }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);


  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure we're using the correct year parameter and format
      const res = await axios.get('/api/weather', {
        params: {
          year: parseInt(year),
          lat: 40.7128,
          lon: -74.0060,
        },
      });

      if (!res.data.success) {
        setError(res.data.message || 'Weather API unavailable');
        setLoading(false);
        return;
      }

      const daily = res.data.data?.daily;
      if (
        !daily ||
        !Array.isArray(daily.temperature_2m_max) ||
        !Array.isArray(daily.temperature_2m_min)
      ) {
        setError('Weather data not available for this year');
        setLoading(false);
        return;
      }

      const tempsMax = daily.temperature_2m_max;
      const tempsMin = daily.temperature_2m_min;
      const days = daily.time?.length || tempsMax.length;

      const hotDays = tempsMax.filter((t) => t >= 30).length;
      const coldDays = tempsMin.filter((t) => t <= 0).length;
      const yearMax = Math.max(...tempsMax);
      const yearMin = Math.min(...tempsMin);
      const avgMax = (tempsMax.reduce((a, b) => a + b, 0) / tempsMax.length).toFixed(1);

      const text = `In ${year}, this location recorded about ${days} days of temperature data. Peak temperature reached ${yearMax}°C while the lowest dipped to ${yearMin}°C. Average high was ${avgMax}°C. There were roughly ${hotDays} very warm days (30°C or higher) and ${coldDays} freezing days (0°C or lower). This climate snapshot helps understand the year's seasonal patterns.`;

      setSummary(text);
    } catch (e) {
      console.error('Weather fetch error', e);
      setError('Unable to load weather history.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (summary && onAddSummary) {
      onAddSummary(summary);
    }
  };


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      y: -1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h4 
        className="font-semibold text-white mb-3 flex items-center text-sm"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Cloud className="w-4 h-4 mr-2 text-purple-400" />
        </motion.div>
        Weather Archive ({year})
      </motion.h4>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-gray-400 text-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full"
            />
            <span>Loading weather data...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20 mb-3"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {summary && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-effect rounded-lg p-4 mb-4"
          >
            <motion.p 
              className="text-gray-400 text-xs line-clamp-3 flex items-start space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Thermometer className="w-3 h-3 text-pink-400 mt-1 flex-shrink-0" />
              </motion.div>
              <span>{summary}</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="flex gap-2">
        <motion.button
          type="button"
          onClick={fetchWeather}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 text-xs py-3 rounded bg-pink-600/20 text-pink-400 hover:bg-pink-600/30 transition-colors font-semibold relative overflow-hidden"
          disabled={loading}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-600/0 via-pink-600/20 to-pink-600/0"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 flex items-center justify-center space-x-2">
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border border-pink-400 border-t-transparent rounded-full"
              />
            ) : (
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sun className="w-3 h-3" />
              </motion.div>
            )}
            <span>{loading ? 'Loading...' : 'Load Weather'}</span>
          </span>
        </motion.button>
        
        <motion.button
          type="button"
          onClick={handleAdd}
          disabled={!summary}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`flex-1 text-xs py-3 rounded font-semibold transition-colors relative overflow-hidden ${
            summary
              ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
              : 'bg-gray-400/20 text-gray-400 opacity-50 cursor-not-allowed'
          }`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <CloudRain className="w-3 h-3" />
            </motion.div>
            <span>Add to Capsule</span>
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
