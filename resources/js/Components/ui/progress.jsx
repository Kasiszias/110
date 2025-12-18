import React from 'react';


export function Progress({ value, className, ...props }) {
    return (
        <div
            className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-600 ${className}`}
            {...props}
        >
            <div
                className="h-full w-full flex-1 bg-purple-600 transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </div>
    );
}
