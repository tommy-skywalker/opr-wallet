import React from 'react';
import { Screen } from '../types';

const ITEMS: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  {
    screen: 'wallet',
    label: 'Wallet',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 10a2 2 0 012-2h14a2 2 0 012 2M3 10v8a2 2 0 002 2h14a2 2 0 002-2v-8m-4 4h.01" />
    ),
  },
  {
    screen: 'earn',
    label: 'Earn',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  },
  {
    screen: 'activity',
    label: 'Activity',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3 8 4-16 3 8h4" />
    ),
  },
  {
    screen: 'settings',
    label: 'Settings',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
            className={`w-[22px] h-[22px] transition-colors ${active ? 'text-white' : 'text-white/35'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={active ? 2 : 1.7}
          >
            {item.icon}
          </svg>
          <span
            className={`text-[10px] font-medium transition-colors ${
              active ? 'text-white' : 'text-white/35'
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
