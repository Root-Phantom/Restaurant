import React from 'react';
import clsx from 'clsx';

export default function Button({children, className, variant = 'primary', ...props}) {
    const base = "inline-flex items-center justify-center px-4 h-10 rounded-md text-sm font-medium transition";
    const variants = {
        primary: "bg-primary-600 hover:bg-primary-500 text-white",
        ghost: "bg-transparent hover:bg-white/10 text-white",
        danger: "bg-red-600 hover:bg-red-500 text-white"
    };
    return (
        <button className={clsx(base, variants[variant], className)} {...props}>
            {children}
        </button>
    );
}

