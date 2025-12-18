// resources/js/Components/ui/navigation-menu.jsx
import React from 'react';

export function NavigationMenu({ children, ...props }) {
    return <div {...props}>{children}</div>;
}

export function NavigationMenuList({ children, className = '', ...props }) {
    return (
        <ul className={`flex flex-1 list-none items-center justify-center space-x-1 ${className}`} {...props}>
            {children}
        </ul>
    );
}

export function NavigationMenuItem({ children, className = '', ...props }) {
    return (
        <li className={className} {...props}>
            {children}
        </li>
    );
}


export function NavigationMenuTrigger({ children, className = '', ...props }) {
    return (
        <button
            className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function NavigationMenuContent({ children, className = '', ...props }) {
    return (
        <div
            className={`absolute left-0 top-full w-fit bg-gray-800 text-white ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function NavigationMenuLink({ children, className = '', ...props }) {
    return (
        <a
            className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white ${className}`}
            {...props}
        >
            {children}
        </a>
    );
}
