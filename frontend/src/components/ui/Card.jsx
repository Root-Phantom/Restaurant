import React from 'react';

export default function Card({title, subtitle, right, children}) {
    return (

        <div className="bg-[var(--panel)] rounded-lg p-4 border border-white/5"> {(title || right || subtitle) && (
            <div className="flex items-start justify-between mb-3">
                <div> {title && <div className="text-base font-semibold">{title}</div>} {subtitle &&
                    <div className="text-xs text-[var(--muted)]">{subtitle}</div>} </div>
                {right} </div>)} {children} </div>);
}