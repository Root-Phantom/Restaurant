import React from 'react';
import {Link, NavLink} from 'react-router-dom';

export default function AppShell({children}) {
    return (
        <div className="h-full grid grid-rows-[56px_1fr]">
            <header className="bg-[var(--panel)] border-b border-white/5 flex items-center justify-between px-4">
                <Link to="/orders" className="text-white font-semibold">Restaurant Admin</Link>
                <nav className="flex items-center gap-4 text-sm">
                    <NavLink to="/orders"
                             className={({isActive}) => isActive ? "text-white" : "text-[var(--muted)] hover:text-white"}>Orders</NavLink>
                    <NavLink to="/orders/new"
                             className={({isActive}) => isActive ? "text-white" : "text-[var(--muted)] hover:text-white"}>New
                        Order</NavLink>
                </nav>
            </header>
            <main className="p-4 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}

