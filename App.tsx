import React, { useEffect, useMemo, useState } from 'react';
import { Screen, Asset } from './types';
import { ASSETS, EARN, TRANSACTIONS } from './data';
import Lock from './components/Lock';
import Wallet from './components/Wallet';
import Earn from './components/Earn';
import Activity from './components/Activity';
import Settings from './components/Settings';
import Send from './components/Send';
import Receive from './components/Receive';
import BottomNav from './components/BottomNav';

const AUTH_KEY = 'opr_unlocked_at';
const LOCK_AFTER_MS = 15 * 60 * 1000;

const App: React.FC = () => {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    const at = Number(localStorage.getItem(AUTH_KEY) || 0);
    return at > 0 && Date.now() - at < LOCK_AFTER_MS;
  });
  const [screen, setScreen] = useState<Screen>('wallet');
  const [modal, setModal] = useState<null | 'send' | 'receive'>(null);

  const spotTotal = useMemo(
    () => ASSETS.reduce((sum, a) => sum + a.amount * a.price, 0),
    [],
  );

  // Refresh the unlock stamp on interaction, and re-lock after inactivity.
  useEffect(() => {
    if (!unlocked) return;
    const touch = () => localStorage.setItem(AUTH_KEY, String(Date.now()));
    touch();
    const events: (keyof WindowEventMap)[] = ['click', 'keydown', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const timer = setInterval(() => {
      const at = Number(localStorage.getItem(AUTH_KEY) || 0);
      if (Date.now() - at > LOCK_AFTER_MS) setUnlocked(false);
    }, 30000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      clearInterval(timer);
    };
  }, [unlocked]);

  const lock = () => {
    localStorage.removeItem(AUTH_KEY);
    setUnlocked(false);
    setScreen('wallet');
  };

  if (!unlocked) {
    return <Lock onUnlock={() => setUnlocked(true)} />;
  }

  const openAsset = (_a: Asset) => setModal('receive');

  const body = () => {
    switch (screen) {
      case 'earn':
        return <Earn earn={EARN} onWithdraw={() => setModal('send')} />;
      case 'activity':
        return <Activity transactions={TRANSACTIONS} />;
      case 'settings':
        return <Settings onLock={lock} />;
      case 'wallet':
      default:
        return (
          <Wallet
            assets={ASSETS}
            earn={EARN}
            spotTotal={spotTotal}
            onSend={() => setModal('send')}
            onReceive={() => setModal('receive')}
            onEarn={() => setScreen('earn')}
            onAsset={openAsset}
          />
        );
    }
  };

  return (
    <div className="h-[100dvh] bg-black flex flex-col overflow-hidden">
      <div className="flex-1 w-full max-w-md mx-auto bg-[#0B0C0F] flex flex-col relative overflow-hidden">
        <main key={screen} className="flex-1 min-h-0 overflow-y-auto no-scrollbar animate-fade-up">
          {body()}
        </main>
        <div className="shrink-0 z-20">
          <BottomNav current={screen} onNavigate={setScreen} />
        </div>
      </div>

      {modal === 'send' && (
        <Send assets={ASSETS} spotTotal={spotTotal} onClose={() => setModal(null)} />
      )}
      {modal === 'receive' && <Receive assets={ASSETS} onClose={() => setModal(null)} />}
    </div>
  );
};

export default App;
