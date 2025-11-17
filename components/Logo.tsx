import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
    <div className={`relative ${className} bg-white p-4`} title="AI Wedding Planner">
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="AI Wedding Planner Logo">
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            {/* Two intertwined rings, representing a union */}
            <circle cx="38" cy="50" r="22" fill="none" stroke="url(#logo-gradient)" strokeWidth="6" />
            <circle cx="62" cy="50" r="22" fill="none" stroke="url(#logo-gradient)" strokeWidth="6" opacity="0.7" />
            
            {/* AI Sparkle at the intersection */}
            <path d="M50 40 L52 48 L60 50 L52 52 L50 60 L48 52 L40 50 L48 48 Z" fill="#fde047" />
        </svg>
    </div>
);
