import React from 'react';
import { WALLET_ADDRESS } from '../data';
import { truncate } from '../utils';
import { ScreenHeader, Logo } from './Ui';

const Settings: React.FC<{ onLock: () => void }> = ({ onLock }) => (
  <div className="pb-6">
    <ScreenHeader title="Settings" />

    <section className="px-5 pt-2">
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#16C784] p-[1.5px]">
          <div className="w-full h-full rounded-full bg-[#15171C] flex items-center justify-center">
            <Logo size={22} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-white">Main wallet</p>
          <p className="text-[12px] text-white/40 font-mono mt-0.5">{truncate(WALLET_ADDRESS, 10, 6)}</p>
        </div>
      </div>
    </section>

    <Group title="Security">
      <Item label="Recovery phrase" value="Backed up" />
      <Item label="Face ID" toggle />
      <Item label="Auto lock" value="15 minutes" />
    </Group>

    <Group title="Preferences">
      <Item label="Currency" value="USD" />
      <Item label="Network" value="Mainnet" />
      <Item label="Price alerts" toggle />
    </Group>

    <Group title="About">
      <Item label="Version" value="1.2.0" />
      <Item label="Terms of service" />
      <Item label="Privacy policy" />
    </Group>

    <section className="px-5 mt-4">
      <button
        onClick={onLock}
        className="w-full h-12 rounded-2xl bg-white/[0.05] border border-white/[0.09] text-[14px] font-medium text-white/70 active:scale-[0.99] transition-transform"
      >
        Lock wallet
      </button>
    </section>

    <p className="text-[11px] text-white/25 text-center mt-6 px-10 leading-relaxed">
      Demonstration build. No private keys are generated or stored, and no funds are held.
    </p>
  </div>
);

const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="px-5 mt-5">
    <h2 className="text-[12px] font-medium text-white/35 mb-2">{title}</h2>
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
      {children}
    </div>
  </section>
);

const Item: React.FC<{ label: string; value?: string; toggle?: boolean }> = ({
  label,
  value,
  toggle,
}) => (
  <div className="px-4 py-3.5 flex items-center justify-between active:bg-white/[0.03] transition-colors cursor-pointer">
    <span className="text-[14px] text-white">{label}</span>
    {toggle ? (
      <div className="w-[42px] h-[25px] rounded-full bg-[#16C784] p-[2px] flex items-center justify-end">
        <div className="w-[21px] h-[21px] rounded-full bg-white" />
      </div>
    ) : value ? (
      <span className="text-[13px] text-white/40">{value}</span>
    ) : (
      <svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </div>
);

export default Settings;
