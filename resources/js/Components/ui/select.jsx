import React, { useState } from 'react';

export function Select({ children, ...props }) {
    return <div {...props}>{children}</div>;
}


export function SelectTrigger({ children, className, ...props }) {
    return (
        <button
            className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function SelectValue({ placeholder }) {
    return <span className="text-gray-400">{placeholder}</span>;
}

export function SelectContent({ children, className, ...props }) {
    return (
        <div className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 bg-gray-800 text-white shadow-md ${className}`} {...props}>
            {children}
        </div>
    );
}

export function SelectItem({ children, value, ...props }) {
    return (
        <div
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-700 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            {...props}
        >
            {children}
        </div>
    );
}
