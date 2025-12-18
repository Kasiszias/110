import React from 'react';

export function Tabs({ children, ...props }) {
    return <div {...props}>{children}</div>;
}


export function TabsList({ children, className, ...props }) {
    return (
        <div
            className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-700 p-1 text-gray-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function TabsTrigger({ children, className, ...props }) {
    return (
        <button
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function TabsContent({ children, className, ...props }) {
    return (
        <div
            className={`mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
