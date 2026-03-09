import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen bg-slate-950 font-sans text-slate-300">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64">
                <Header />
                <main className="flex-1 p-6 overflow-auto bg-slate-950 relative">
                    {/* Subtle background glow effect */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
