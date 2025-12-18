
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { DollarSign, TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function EconomicDataLoader({ year = new Date().getFullYear(), onAdd }) {
  const [data, setData] = useState({
    gdp: null,
    inflation: null,
    stocks: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchEconomicData = async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const [gdpRes, inflationRes, stocksRes] = await Promise.allSettled([
          axios.get(`/api/economic/gdp?year=${year}`),
          axios.get(`/api/economic/inflation?year=${year}`),
          axios.get(`/api/economic/stocks?year=${year}`),
        ]);

        setData({
          gdp: gdpRes.status === 'fulfilled' ? gdpRes.value.data : null,
          inflation: inflationRes.status === 'fulfilled' ? inflationRes.value.data : null,
          stocks: stocksRes.status === 'fulfilled' ? stocksRes.value.data : null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Economic data fetch error', error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load economic data',
        }));
      }
    };

    fetchEconomicData();
  }, [year]);


  if (data.loading) {
    return <p className="text-gray-400 text-sm">Loading economic data...</p>;
  }

  if (data.error) {
    return <p className="text-red-400 text-sm">{data.error}</p>;
  }

  const handleAdd = (type, payload) => {
    if (!onAdd) return;
    onAdd({
      title: `${type} in ${year}`,
      description: payload.description || `${type} data for ${year}`,
      year,
      type: 'Economic Data',
    });
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
          <DollarSign className="w-4 h-4 mr-2 text-purple-400" />
        </motion.div>
        Economic Data ({year})
      </motion.h4>

      <AnimatePresence>
        {data.loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-gray-400 text-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
            />
            <span>Loading economic data...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {data.error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20"
        >
          {data.error}
        </motion.div>
      )}

      <motion.div className="space-y-3">
        {/* GDP */}
        <motion.div 
          className="glass-effect rounded-lg p-4 cursor-pointer"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 8px 32px rgba(168, 85, 247, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div className="flex items-center justify-between mb-2">
            <p className="text-xs text-purple-400 font-semibold flex items-center">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
              </motion.div>
              Gross Domestic Product
            </p>
          </motion.div>
          <motion.p 
            className="text-sm text-white mb-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.gdp?.value ? `$${(data.gdp.value / 1e12).toFixed(2)} trillion` : 'N/A'}
          </motion.p>
          <motion.p 
            className="text-xs text-gray-400 mb-3 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {data.gdp?.context}
          </motion.p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleAdd('GDP', { description: data.gdp?.context || 'GDP data' })}
            className="w-full text-xs py-2 rounded bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors font-semibold relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Add GDP to Capsule</span>
          </motion.button>
        </motion.div>

        {/* Inflation */}
        <motion.div 
          className="glass-effect rounded-lg p-4 cursor-pointer"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 8px 32px rgba(236, 72, 153, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div className="flex items-center justify-between mb-2">
            <p className="text-xs text-pink-400 font-semibold flex items-center">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <BarChart3 className="w-3 h-3 mr-1" />
              </motion.div>
              Inflation Rate
            </p>
          </motion.div>
          <motion.p 
            className="text-sm text-white mb-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.inflation?.value ? `${data.inflation.value.toFixed(2)}%` : 'N/A'}
          </motion.p>
          <motion.p 
            className="text-xs text-gray-400 mb-3 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {data.inflation?.context}
          </motion.p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleAdd('Inflation', { description: data.inflation?.context || 'Inflation data' })}
            className="w-full text-xs py-2 rounded bg-pink-600/20 text-pink-400 hover:bg-pink-600/30 transition-colors font-semibold relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600/0 via-pink-600/20 to-pink-600/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Add Inflation to Capsule</span>
          </motion.button>
        </motion.div>

        {/* Stocks */}
        <motion.div 
          className="glass-effect rounded-lg p-4 cursor-pointer"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 8px 32px rgba(168, 85, 247, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div className="flex items-center justify-between mb-2">
            <p className="text-xs text-purple-400 font-semibold flex items-center">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <PieChart className="w-3 h-3 mr-1" />
              </motion.div>
              S&P 500 Index
            </p>
          </motion.div>
          <motion.p 
            className="text-sm text-white mb-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.stocks?.value ? data.stocks.value.toFixed(2) : 'N/A'}
          </motion.p>
          <motion.p 
            className="text-xs text-gray-400 mb-3 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {data.stocks?.context}
          </motion.p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleAdd('Stock Index', { description: data.stocks?.context || 'Stock index data' })}
            className="w-full text-xs py-2 rounded bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors font-semibold relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Add Stocks to Capsule</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
