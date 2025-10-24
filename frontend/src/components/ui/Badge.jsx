import React from 'react';
import clsx from 'clsx';

export default function Badge({children, color = 'default'}) {
    const map = {
        default: "bg-white/10 text-white",
        success: "bg-green-600/20 text-green-300",
        warning: "bg-yellow-600/20 text-yellow-300",
        info: "bg-blue-600/20 text-blue-300"
    };
    return (
        <span className={clsx("px-2 py-1 rounded text-xs font-medium", map[color])}>
{children}
</span>
    );
}