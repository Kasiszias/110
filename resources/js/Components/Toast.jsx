import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const types = {
        success: {
            icon: CheckCircle,
            bg: 'from-green-500/20 to-emerald-500/20',
            border: 'border-green-500/30',
            text: 'text-green-400',
        },
        error: {
            icon: XCircle,
            bg: 'from-red-500/20 to-pink-500/20',
            border: 'border-red-500/30',
            text: 'text-red-400',
        },
        warning: {
            icon: AlertCircle,
            bg: 'from-yellow-500/20 to-orange-500/20',
            border: 'border-yellow-500/30',
            text: 'text-yellow-400',
        },
    };

    const config = types[type];
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.8 }}
                    className={`fixed top-4 right-4 z-[100] bg-gradient-to-r ${config.bg} backdrop-blur-xl border ${config.border} rounded-xl p-4 shadow-2xl max-w-md`}
                >
                    <div className="flex items-start space-x-3">
                        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
                        <p className="text-white text-sm flex-1 leading-relaxed">{message}</p>
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onClose, 300);
                            }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
