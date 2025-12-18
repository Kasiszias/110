import React from 'react';

export function Dialog({ children, ...props }) {
    return <div {...props}>{children}</div>;
}


export function DialogContent({ children, className, ...props }) {
    return (
        <div className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-600 bg-gray-800 p-6 shadow-lg duration-200 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function DialogHeader({ children, className, ...props }) {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
            {children}
        </div>
    );
}

export function DialogTitle({ children, className, ...props }) {
    return (
        <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
            {children}
        </h2>
    );
}


export function DialogDescription({ children, className, ...props }) {
    return (
        <p className={`text-sm text-gray-400 ${className}`} {...props}>
            {children}
        </p>
    );
}

export function DialogTrigger({ children, ...props }) {
    return <div {...props}>{children}</div>;
}