import React from 'react';


export function Badge({ className, variant = 'default', ...props }) {
    const variants = {
        default: 'border-transparent bg-purple-600 text-white hover:bg-purple-700',
        secondary: 'border-transparent bg-gray-600 text-white hover:bg-gray-700',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'text-gray-300 border-gray-600',
    };

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
