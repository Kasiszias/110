import React, { useState, useEffect } from 'react';

export default function Countdown({ targetDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();

            if (difference <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isExpired: true
                });
                if (onComplete) onComplete();
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isExpired: false
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (timeLeft.isExpired) {
        return (
            <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">🔓 Unlocked!</span>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
                <div className="text-xs text-purple-100 uppercase tracking-wide">Days</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
                <div className="text-xs text-blue-100 uppercase tracking-wide">Hours</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
                <div className="text-xs text-green-100 uppercase tracking-wide">Minutes</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-3 shadow-lg">
                <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
                <div className="text-xs text-orange-100 uppercase tracking-wide">Seconds</div>
            </div>
        </div>
    );
}
