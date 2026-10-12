import React from 'react';
import { Screen } from '../types';

const ITEMS: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  {
    screen: 'wallet',
    label: 'Wallet',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5A2.5 2.5 0 015.5 6h11A2.5 2.5 0 0119 8.5v7a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 013 15.5v-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10.5h1.5A1.5 1.5 0 0122 12v.5a1.5 1.5 0 01-1.5 1.5H19" />
        <path strokeLinecap="round" d="M6.5 6V5.2A1.2 1.2 0 017.9 4l8.3 1.4" />
      </>
    ),
  },
  {
    screen: 'earn',
    label: 'Earn',
    icon: (
      <>
        <path strokeLinecap="round" d="M4 20V13M9 20v-4.5M14 20v-8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 8.5L17 5l3 3.5" />
        <path strokeLinecap="round" d="M19 20V5.5" />
      </>
    ),
  },
  {
    screen: 'activity',
    label: 'Activity',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3.2l2.1-5.2 3.4 11 2.4-7.1 1.5 1.3H21" />
      </>
    ),
  },
  {
    screen: 'settings',
    label: 'Settings',
    icon: (
      <>
        <path strokeLinecap="round" d="M4 7h10M18.5 7H20M4 17h3M11 17h9" />
        <circle cx="16.2" cy="7" r="2.2" />
        <circle cx="8.8" cy="17" r="2.2" />
      </>
    ),
  },
];

const BottomNav: React.FC<{ current: Screen; onNavigate: (s: Screen) => void }> = ({
  current,
  onNavigate,
}) => (
  <nav className="bg-[#0B0C0F]/85 backdrop-blur-xl border-t border-white/[0.07] grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
    {ITEMS.map((item) => {
      const active = current === item.screen;
      return (
        <button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          className="py-2.5 flex flex-col items-center gap-1 active:scale-95 transition-transform"
        >
          <svg
            className={`w-[22px] h-[22px] transition-colors ${active ? 'text-white' : 'text-white/32'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={active ? 1.9 : 1.6}
          >
            {item.icon}
          </svg>
          <span
            className={`text-[10px] font-medium transition-colors ${
              active ? 'text-white' : 'text-white/32'
            }`}
          >
            {item.label}
          </span>
        </button>
      );
    })}
  </nav>
);

export default BottomNav;
