
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Scaffolding Arcade Hub...');

// 1. Create Directories
const dirs = [
  'components',
  'components/auth',
  'components/dev',
  'components/games',
  'components/profile',
  'components/ui',
  'context',
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// 2. Define Files
const files = {
  'package.json': JSON.stringify({
    "name": "arcade-hub",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.64",
      "@types/react-dom": "^18.2.21",
      "@vitejs/plugin-react": "^4.2.1",
      "typescript": "^5.2.2",
      "vite": "^5.1.6"
    }
  }, null, 2),

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,

  'tsconfig.json': JSON.stringify({
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": false,
      "noUnusedParameters": false,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["./**/*.tsx", "./**/*.ts"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }, null, 2),

  'tsconfig.node.json': JSON.stringify({
    "compilerOptions": {
      "composite": true,
      "skipLibCheck": true,
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts"]
  }, null, 2),

  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Game Arcade Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      html { font-size: 14px; }
      @media (min-width: 640px) { html { font-size: 15px; } }
      @media (min-width: 1024px) { html { font-size: 16px; } }

      @keyframes pop-in {
        0% { transform: scale(0.5); opacity: 0; }
        70% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .machine-shake { animation: shake 0.5s ease-in-out; }

      :root {
        --game-area-padding-x: 2rem;
        --game-area-padding-y: 1.5rem;
        --tictactoe-p1-color: #f59e0b;
        --tictactoe-p2-color: #60a5fa;
        --connect4-p1-color: #ef4444;
        --connect4-p2-color: #facc15;
        --connect4-board-color: #3b82f6;
        --board-gap: 8px;
        --keno-selected-color: #3b82f6;
        --keno-drawn-color: #f59e0b;
        --keno-match-color: #22c55e;
        --keno-miss-color: #ef4444;
      }

      .game-transition-in { animation: slide-in 0.3s ease-out forwards; }
      .game-transition-out { animation: slide-out 0.3s ease-in forwards; }
      @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slide-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }

      .connect4-board-overlay {
        background-image: radial-gradient(circle at center, transparent 64%, var(--connect4-board-color) 65%);
        background-size: 14.28% 16.66%;
        pointer-events: none;
      }
      
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
      /* Additional Styles */
      .leather-board {
          background: linear-gradient(145deg, #8B4513, #A0522D);
          border: 4px solid #D2691E;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.3);
          color: #FFD700;
          text-shadow: 1px 1px 2px #000;
      }
      .leather-board input {
          background: rgba(0,0,0,0.2);
          border: 1px solid #FFD700;
          color: #FFF;
      }
      
      /* Cube Scene */
      .cube-scene {
        --cubie-size: 60px;
        --sticker-margin: 3px;
        width: calc(var(--cubie-size) * 4);
        height: calc(var(--cubie-size) * 4);
        display: flex;
        align-items: center;
        justify-content: center;
        perspective: calc(var(--cubie-size) * 15);
        cursor: grab;
      }
      .cube-container {
        transform-style: preserve-3d;
        position: relative;
        width: var(--cubie-size);
        height: var(--cubie-size);
      }
      .cubie {
        position: absolute;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
      }
      .sticker {
        position: absolute;
        width: calc(var(--cubie-size) - var(--sticker-margin) * 2);
        height: calc(var(--cubie-size) - var(--sticker-margin) * 2);
        margin: var(--sticker-margin);
        border-radius: 4px;
        background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%);
        box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
      }
      .sticker.face-U { transform: rotateX(90deg) translateZ(calc(var(--cubie-size) / 2)); }
      .sticker.face-D { transform: rotateX(-90deg) translateZ(calc(var(--cubie-size) / 2)); }
      .sticker.face-L { transform: rotateY(-90deg) translateZ(calc(var(--cubie-size) / 2)); }
      .sticker.face-R { transform: rotateY(90deg) translateZ(calc(var(--cubie-size) / 2)); }
      .sticker.face-F { transform: translateZ(calc(var(--cubie-size) / 2)); }
      .sticker.face-B { transform: rotateY(180deg) translateZ(calc(var(--cubie-size) / 2)); }
      
      /* Card Flip */
      .perspective { perspective: 1000px; }
      .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
      .card-inner.is-flipped { transform: rotateY(180deg); }
      .card-front, .card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; }
      .card-back { transform: rotateY(180deg); }
      .card-inner.is-matched { opacity: 0.5; transform: rotateY(180deg) scale(0.95); }
      
      /* Stun Animation */
      @keyframes stun-flash { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.5); } 100% { opacity: 0; transform: scale(2); } }
      .stun-flash-effect { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, white, transparent 60%); animation: stun-flash 0.4s ease-out forwards; }
      @keyframes stun-particle-fly { from { transform: translate(0, 0) scale(1); opacity: 1; } to { transform: translate(var(--x-end), var(--y-end)) scale(0); opacity: 0; } }
      .stun-particle { position: absolute; width: 8px; height: 8px; background: gold; border-radius: 50%; animation: stun-particle-fly 0.4s ease-out forwards; }

      /* Mancala */
      :root { --mancala-pit-gap: 8px; }
      .mancala-pit, .mancala-store { background: #A0522D; border-radius: 1.5rem; position: relative; transition: background-color 0.2s; border: 2px solid #63300e; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
      .mancala-pit { aspect-ratio: 1 / 1; }
      .mancala-store { padding: 8px; }
      .highlight { background-color: #D2691E !important; box-shadow: 0 0 15px #FFD700, inset 0 0 10px rgba(0,0,0,0.5); }
      .stones-container { position: absolute; inset: 5%; }
      .stone { position: absolute; width: 20%; height: 20%; border-radius: 50%; box-shadow: inset 0 -2px 2px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.4); }
      .stone-gold { background: radial-gradient(circle at 30% 30%, #fff0a0, #ffd700); }
      .stone-silver { background: radial-gradient(circle at 30% 30%, #f0f0f0, #c0c0c0); }
      .stone-bronze { background: radial-gradient(circle at 30% 30%, #ffc078, #cd7f32); }
      .stone-slate { background: radial-gradient(circle at 30% 30%, #90a4ae, #546e7a); }
      .stone-oak { background: radial-gradient(circle at 30% 30%, #c8bda9, #8b5a2b); }
      .stone-mahogany { background: radial-gradient(circle at 30% 30%, #e67e58, #c04000); }
      .stone-stack { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-weight: bold; }
      .stone-stack-icon { font-size: 2rem; line-height: 1; color: #546e7a; }
      .stone-stack-count { font-size: 1.2rem; color: white; text-shadow: 1px 1px 2px #000; }

      /* Coin Pusher */
      .cp-game-wrapper { width: 100%; height: 100%; min-height: 600px; background-color: #0d1a2e; color: #e0e0e0; display: flex; font-family: 'Arial', sans-serif; border-radius: 12px; overflow: hidden; }
      .cp-header { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #12233f; border-bottom: 1px solid #2e456b; }
      .cp-main-content { flex-grow: 1; display: flex; flex-direction: column; position: relative; }
      .coin-pusher-scene { flex-grow: 1; display: flex; justify-content: center; align-items: center; perspective: 1000px; overflow: hidden; background: radial-gradient(circle at center, #1a2b4a, #0d1a2e); }
      .coin-pusher-world { transform-style: preserve-3d; transform: rotateX(45deg) rotateZ(0deg) translateY(-30px); width: 320px; height: 400px; position: relative; }
      .pusher-bed { position: absolute; inset: 0; background: #1c3256; border: 8px solid #2e456b; border-radius: 4px; transform: translateZ(-20px); box-shadow: inset 0 0 30px rgba(0,0,0,0.8); }
      .pusher-wall { position: absolute; background: linear-gradient(to right, #d4af37, #ffd700, #d4af37); height: 40px; width: 100%; transform-origin: top; transform: translateZ(20px); box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
      @keyframes coin-pulse-rotate { 0% { transform: rotateY(0deg); filter: brightness(1); } 50% { filter: brightness(1.2); } 100% { transform: rotateY(360deg); filter: brightness(1); } }
      .animate-coin { animation: coin-pulse-rotate 6s infinite linear; }
      .cp-coin { position: absolute; width: 26px; height: 26px; background: radial-gradient(circle at 30% 30%, #fff, #ffd700 60%); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.5), inset 0 0 2px rgba(255,255,255,0.5); transition: transform 0.1s linear; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #b8860b; font-weight: bold; }
      .cp-coin::before { content: '$'; }
      .cp-controls-wrapper { padding: 16px; background: #08111f; border-top: 1px solid #2e456b; }
      
      /* Slots */
      .slot-reel-window { background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 20%, transparent 80%, rgba(0,0,0,0.8)); overflow: hidden; border-radius: 4px; position: relative; box-shadow: inset 0 0 15px rgba(0,0,0,0.8); }
      .slot-symbol { display: flex; align-items: center; justify-content: center; }
      @keyframes win-pulse { 0%, 100% { transform: scale(1); filter: brightness(1.2); } 50% { transform: scale(1.1); filter: brightness(1.5); } }
      .winning-symbol { animation: win-pulse 0.8s infinite; }
    </style>
  </head>
  <body>
    <div id="root" class="w-full"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`,

  'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'metadata.json': `{
  "name": "5idecoders-arcade-hub nov23",
  "description": "5idecoders-arcade-hub",
  "requestFramePermissions": []
}`,

  'App.tsx': `import React, { useState } from 'react';
import { CoinProvider } from './context/CoinContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameMode, Game } from './types';
import { ADULT_GAMES, UNDER18_GAMES } from './constants';
import Header from './components/Header';
import GameArea from './components/GameArea';
import Footer from './components/Footer';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import VerificationPage from './components/auth/VerificationPage';
import ProfilePage from './components/profile/ProfilePage';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, verificationPendingEmail } = useAuth();
  const [mode, setMode] = useState<GameMode>(GameMode.Under18);
  const [games] = useState(() => {
      // Initial games logic - effect below updates it
      return mode === GameMode.Adult ? ADULT_GAMES : UNDER18_GAMES;
  });
  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);
  
  // View States for Auth/Profile
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [showProfile, setShowProfile] = useState(false);

  // Handle Game Mode switching
  const handleSetMode = (newMode: GameMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      const newGames = newMode === GameMode.Adult ? ADULT_GAMES : UNDER18_GAMES;
      setSelectedGame(newGames[0]);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-400">Loading Arcade...</div>;
  }

  // 1. Verification Flow
  if (verificationPendingEmail && !isAuthenticated) {
      return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_50%_25%,_#161b22_60%,_#232a35_100%)] text-gray-100 font-sans flex flex-col">
            <Header mode={mode} setMode={handleSetMode} simple />
            <main className="flex-grow flex flex-col items-center w-full pt-10">
                <VerificationPage email={verificationPendingEmail} />
            </main>
            <Footer />
        </div>
      )
  }

  // 2. Unauthenticated Flow
  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_50%_25%,_#161b22_60%,_#232a35_100%)] text-gray-100 font-sans flex flex-col">
            <Header mode={mode} setMode={handleSetMode} simple />
            <main className="flex-grow flex flex-col items-center w-full pt-10">
                {authView === 'login' ? (
                    <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
                ) : (
                    <SignupPage 
                        onSwitchToLogin={() => setAuthView('login')} 
                        onSignupSuccess={() => {/* Logic handled by verification state in context */}}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
  }

  // 3. Authenticated Flow
  const activeGames = mode === GameMode.Adult ? ADULT_GAMES : UNDER18_GAMES;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_25%,_#161b22_60%,_#232a35_100%)] text-gray-100 font-sans flex flex-col">
      <Header 
        mode={mode} 
        setMode={handleSetMode} 
        onProfileClick={() => setShowProfile(true)} 
        onHomeClick={() => setShowProfile(false)}
        isProfileActive={showProfile}
      />
      <main className="flex-grow flex flex-col items-center w-full">
        {showProfile ? (
            <ProfilePage onBack={() => setShowProfile(false)} />
        ) : (
            <GameArea 
                games={activeGames} 
                selectedGame={activeGames.find(g => g.id === selectedGame.id) || activeGames[0]} 
                onSelectGame={setSelectedGame} 
                mode={mode}
            />
        )}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
        <CoinProvider>
            <AppContent />
        </CoinProvider>
    </AuthProvider>
  );
}

export default App;`,

  'types.ts': `import React from 'react';

export enum GameMode {
  Under18 = 'under18',
  Adult = 'adult',
}

export interface Game {
  id: string;
  label: string;
  component: React.ComponentType<any>; // Allow games to receive props
}

export type PlayMode = 'vsPlayer' | 'vsComputer';
export type CurrencyMode = 'fun' | 'real';

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  isGuest?: boolean;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: CurrencyMode;
  reason: string;
  timestamp: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}`,

  'constants.tsx': `import { Game } from './types';
import KenoGame from './components/games/KenoGame';
import PlinkoGame from './components/games/PlinkoGame';
import WormGame from './components/games/WormGame';
import ConnectFourGame from './components/games/ConnectFourGame';
import FishingGame from './components/games/FishingGame';
import RubiksCubeGame from './components/games/RubiksCubeGame';
import CrashGame from './components/games/CrashGame';
import SlotsGame from './components/games/SlotsGame';
import MancalaGame from './components/games/MancalaGame';
import BlackjackGame from './components/games/BlackjackGame';
import TexasHoldemGame from './components/games/TexasHoldemGame';

export const ADULT_GAMES: Game[] = [
    { id: 'crash', label: 'Crash', component: CrashGame },
    { id: 'blackjack', label: 'Blackjack', component: BlackjackGame },
    { id: 'poker', label: 'Hold\\'em', component: TexasHoldemGame },
    { id: 'keno', label: 'Keno', component: KenoGame },
    { id: 'plinko', label: 'Plinko', component: PlinkoGame },
    { id: 'slots', label: 'Slots', component: SlotsGame },
    { id: 'fishing', label: 'Ocean Hunter', component: FishingGame },
];

export const UNDER18_GAMES: Game[] = [
    { id: 'worm', label: 'Worm.io', component: WormGame },
    { id: 'connect4', label: 'Connect Four', component: ConnectFourGame },
    { id: 'rubikscube', label: "Rubik's Cube", component: RubiksCubeGame },
    { id: 'mancala', label: 'Mancala', component: MancalaGame },
];`,

  'context/CoinContext.tsx': `import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { CurrencyMode, Transaction } from '../types';
import { useAuth } from './AuthContext';

interface CoinContextType {
  funCoins: number;
  realCoins: number;
  currencyMode: CurrencyMode;
  setCurrencyMode: (mode: CurrencyMode) => void;
  coins: number; // Represents the active currency balance
  addCoins: (amount: number, reason?: string) => void;
  subtractCoins: (amount: number, reason?: string) => boolean;
  resetCoins: () => void;
  canBet: (amount: number) => boolean;
  transactions: Transaction[];
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [funCoins, setFunCoins] = useState<number>(1000);
  const [realCoins, setRealCoins] = useState<number>(100);
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('fun');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      const savedFun = localStorage.getItem(\`funCoins_\${user.id}\`);
      const savedReal = localStorage.getItem(\`realCoins_\${user.id}\`);
      const savedTx = localStorage.getItem(\`transactions_\${user.id}\`);
      
      setFunCoins(savedFun ? Number(savedFun) : 1000);
      setRealCoins(savedReal ? Number(savedReal) : 100);
      setTransactions(savedTx ? JSON.parse(savedTx) : []);
    } else {
      // Default for guest/logged out
      setFunCoins(1000);
      setRealCoins(100);
      setTransactions([]);
    }
  }, [user]);

  // Save balances
  useEffect(() => {
    if (user) {
      localStorage.setItem(\`funCoins_\${user.id}\`, String(funCoins));
      localStorage.setItem(\`realCoins_\${user.id}\`, String(realCoins));
    }
  }, [funCoins, realCoins, user]);

  // Save transactions
  useEffect(() => {
    if (user) {
      localStorage.setItem(\`transactions_\${user.id}\`, JSON.stringify(transactions));
    }
  }, [transactions, user]);


  const activeBalance = currencyMode === 'fun' ? funCoins : realCoins;
  const updateActiveBalance = currencyMode === 'fun' ? setFunCoins : setRealCoins;

  const logTransaction = (type: 'credit' | 'debit', amount: number, reason: string) => {
    const newTx: Transaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        amount,
        currency: currencyMode,
        reason,
        timestamp: Date.now()
    };
    setTransactions(prev => [newTx, ...prev].slice(0, 100)); // Keep last 100 transactions
  };

  const addCoins = (amount: number, reason: string = 'Game Win') => {
    updateActiveBalance(prev => prev + amount);
    logTransaction('credit', amount, reason);
  };

  const subtractCoins = (amount: number, reason: string = 'Game Bet') => {
    if (activeBalance >= amount) {
      updateActiveBalance(prev => prev - amount);
      logTransaction('debit', amount, reason);
      return true;
    }
    return false;
  };

  const resetCoins = () => {
      setFunCoins(1000);
      setRealCoins(100);
      setTransactions([]);
  }

  const canBet = (amount: number) => {
    return activeBalance >= amount && amount > 0;
  };

  return (
    <CoinContext.Provider value={{ 
      funCoins, 
      realCoins, 
      currencyMode, 
      setCurrencyMode,
      coins: activeBalance,
      addCoins, 
      subtractCoins, 
      resetCoins,
      canBet,
      transactions
    }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinSystem = (): CoinContextType => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error('useCoinSystem must be used within a CoinProvider');
  }
  return context;
};`,

  'context/AuthContext.tsx': `import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  cancelVerification: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  verificationPendingEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Admin User Configuration
const ADMIN_USER = {
  id: 'admin_root_001',
  username: 'Admin',
  email: '5ide4ustle5ales@gmail.com',
  password: 'admin',
  isVerified: true,
  verificationCode: null,
  joinedAt: new Date().toISOString(),
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  bio: 'System Administrator'
};

// Mock database helper
const getStoredUsers = (): any[] => {
    const stored = localStorage.getItem('arcade_users');
    const users = stored ? JSON.parse(stored) : [];
    
    // Ensure Admin user exists
    if (!users.find((u: any) => u.email === ADMIN_USER.email)) {
        users.push(ADMIN_USER);
        localStorage.setItem('arcade_users', JSON.stringify(users));
    }
    
    return users;
};

const saveStoredUsers = (users: any[]) => localStorage.setItem('arcade_users', JSON.stringify(users));

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check for active session
    const sessionUser = localStorage.getItem('arcade_session');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    } else {
        // Initialize DB on load to ensure Admin exists even if no session
        getStoredUsers();
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getStoredUsers();
    
    // Check if identifier matches email OR username
    const foundUser = users.find(u => 
        (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) && 
        u.password === password
    );

    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid username/email or password');
    }

    if (!foundUser.isVerified) {
      setIsLoading(false);
      setVerificationPendingEmail(foundUser.email);
      throw new Error('Account not verified. Please check your email.');
    }

    const { password: _, verificationCode: __, ...safeUser } = foundUser;
    setUser(safeUser);
    localStorage.setItem('arcade_session', JSON.stringify(safeUser));
    setIsLoading(false);
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const guestUser: User = {
      id: \`guest_\${Date.now()}\`,
      username: 'Guest Player',
      email: '',
      isVerified: true, // Guests are implicitly verified to play
      avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${Date.now()}\`,
      bio: 'Just passing through...',
      joinedAt: new Date().toISOString(),
      isGuest: true
    };

    setUser(guestUser);
    localStorage.setItem('arcade_session', JSON.stringify(guestUser));
    setIsLoading(false);
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getStoredUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      throw new Error('Email already exists');
    }

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        setIsLoading(false);
        throw new Error('Username already taken');
    }

    // Generate a mock 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, this would send an email. Here we log it.
    console.log(\`%c[Email Service] Verification code for \${email}: \${verificationCode}\`, "color: #4ade80; font-weight: bold; font-size: 14px;");
    
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      isVerified: false,
      verificationCode,
      joinedAt: new Date().toISOString(),
      avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${username}\`,
      bio: 'Ready to play!'
    };

    users.push(newUser);
    saveStoredUsers(users);
    setVerificationPendingEmail(email);
    setIsLoading(false);
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      setIsLoading(false);
      throw new Error('User not found');
    }

    if (users[userIndex].verificationCode === code) {
      users[userIndex].isVerified = true;
      users[userIndex].verificationCode = null; // Clear code
      saveStoredUsers(users);
      
      // Auto login
      const { password: _, ...safeUser } = users[userIndex];
      setUser(safeUser);
      localStorage.setItem('arcade_session', JSON.stringify(safeUser));
      
      setVerificationPendingEmail(null);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const cancelVerification = () => {
      setVerificationPendingEmail(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arcade_session');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('arcade_session', JSON.stringify(updatedUser));

    // Update DB only if not guest (guests are not in DB)
    if (!user.isGuest) {
        const users = getStoredUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        saveStoredUsers(users);
        }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      loginAsGuest,
      signup, 
      verifyEmail,
      cancelVerification,
      logout, 
      updateProfile,
      verificationPendingEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};`,

  'components/Header.tsx': `import React from 'react';
import { GameMode } from '../types';
import { useCoinSystem } from '../context/CoinContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  simple?: boolean; // For login/signup pages
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  isProfileActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode, simple = false, onProfileClick, onHomeClick, isProfileActive }) => {
  const { funCoins, realCoins, currencyMode, resetCoins } = useCoinSystem();
  const { user, logout } = useAuth();
  const isCasinoMode = mode === GameMode.Adult;

  const buttonClasses = "text-sm md:text-base border-none py-2 px-4 rounded-lg bg-gray-800 text-yellow-400 cursor-pointer shadow-md transition-colors duration-200";
  const activeButtonClasses = "bg-yellow-400 text-gray-800";

  if (simple) {
      return (
        <header className="flex justify-center items-center p-6 bg-gradient-to-r from-[#a87c4f] to-[#7e3c3c] shadow-lg border-b-2 border-yellow-400/20 w-full">
            <h1 className="text-3xl md:text-4xl tracking-wider text-yellow-400 [text-shadow:0_2px_8px_rgba(182,137,45,0.26),0_0_2px_#fff] font-bold">
            🎲 Game Arcade Hub
            </h1>
        </header>
      );
  }

  return (
    <header className="flex flex-col gap-4 p-4 md:p-6 bg-gradient-to-r from-[#a87c4f] to-[#7e3c3c] shadow-lg border-b-2 border-yellow-400/20 w-full">
      
      {/* Top Row: Title and User Controls */}
      <div className="flex flex-wrap justify-between items-center w-full gap-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onHomeClick}>
            <h1 className="text-2xl md:text-3xl tracking-wider text-yellow-400 [text-shadow:0_2px_8px_rgba(182,137,45,0.26),0_0_2px_#fff] font-bold">
            🎲 Game Arcade Hub
            </h1>
            <span className="hidden md:inline-block text-sm bg-black/20 text-white rounded-full px-3 py-1">
            {isCasinoMode ? 'Casino Mode (18+)' : 'Under 18 Mode'}
            </span>
        </div>

        {user && (
            <div className="flex items-center gap-3">
                <button 
                    onClick={onProfileClick}
                    className={\`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors \${isProfileActive ? 'bg-yellow-400 text-black' : 'bg-black/30 text-white hover:bg-black/40'}\`}
                >
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-white/50" />
                    <span className="font-semibold hidden sm:inline">{user.username}</span>
                </button>
                <button 
                    onClick={logout}
                    className="text-xs text-red-200 hover:text-red-100 hover:underline"
                >
                    Logout
                </button>
            </div>
        )}
      </div>

      {/* Bottom Row: Coins and Mode Switch (Only if not in profile view) */}
      {!isProfileActive && (
        <div className="flex flex-wrap justify-between items-center gap-4 w-full border-t border-white/10 pt-2">
            <div className="flex items-center gap-4">
                {isCasinoMode && (
                <div className="flex gap-2 text-sm md:text-base font-bold">
                    <div className={\`py-1 px-3 rounded-xl shadow-inner shadow-black/50 transition-colors \${currencyMode === 'fun' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-900/70 text-yellow-400/60'}\`}>
                    Fun: <span>{Math.floor(funCoins)}</span>
                    </div>
                    <div className={\`py-1 px-3 rounded-xl shadow-inner shadow-black/50 transition-colors \${currencyMode === 'real' ? 'bg-green-500 text-gray-900' : 'bg-gray-900/70 text-green-400/60'}\`}>
                    Real: <span>{Math.floor(realCoins)}</span>
                    </div>
                </div>
                )}

                {/* Reset Coins for Guest */}
                {user?.isGuest && (
                    <button
                        onClick={resetCoins}
                        className="text-xs bg-red-900/50 hover:bg-red-800 text-red-200 px-2 py-1 rounded border border-red-700/50 transition-colors shadow-sm"
                        title="Reset coin balance to default"
                    >
                        Reset Coins
                    </button>
                )}
            </div>

            <div className="flex gap-2 ml-auto">
                <button
                    onClick={() => setMode(GameMode.Under18)}
                    className={\`\${buttonClasses} \${!isCasinoMode ? activeButtonClasses : ''} py-1 px-3 text-xs\`}
                >
                    Under 18
                </button>
                <button
                    onClick={() => setMode(GameMode.Adult)}
                    className={\`\${buttonClasses} \${isCasinoMode ? activeButtonClasses : ''} py-1 px-3 text-xs\`}
                >
                    Casino (18+)
                </button>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;`,

  'components/Footer.tsx': `import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 text-center text-sm bg-gray-900 text-yellow-400/40 tracking-widest border-t-2 border-yellow-400/20 w-full">
      <div className="flex flex-col items-center gap-2">
        <p>
          Arcade Hub <span className="text-yellow-400/20 text-xs">v1.1.0 (Stable)</span> · Made by 5idescoder & Copilot
        </p>
        <a 
          href="https://github.com/5idescoder" 
          className="text-yellow-400/60 hover:text-yellow-400 hover:underline transition-colors flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          GitHub Repository
        </a>
      </div>
    </footer>
  );
};

export default Footer;`,

  'components/GameArea.tsx': `import React, { useState, useEffect, useRef } from 'react';
import { Game, GameMode, PlayMode } from '../types';
import { useCoinSystem } from '../context/CoinContext';
import PlayerNameInputs from './PlayerNameInputs';


const GameOptionsSelector: React.FC<{
  mode: GameMode;
  playMode: PlayMode;
  setPlayMode: (mode: PlayMode) => void;
}> = ({ mode, playMode, setPlayMode }) => {
  const { currencyMode, setCurrencyMode } = useCoinSystem();

  const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition-colors";
  
  if (mode === GameMode.Under18) {
    const activeClass = "bg-yellow-400 text-gray-900";
    const inactiveClass = "bg-gray-700 text-yellow-400 hover:bg-gray-600";
    return (
      <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg">
        <button onClick={() => setPlayMode('vsPlayer')} className={\`\${buttonClass} \${playMode === 'vsPlayer' ? activeClass : inactiveClass}\`}>
          VS Player
        </button>
        <button onClick={() => setPlayMode('vsComputer')} className={\`\${buttonClass} \${playMode === 'vsComputer' ? activeClass : inactiveClass}\`}>
          VS Computer
        </button>
      </div>
    );
  }
  
  if (mode === GameMode.Adult) {
     return (
      <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg">
        <button onClick={() => setCurrencyMode('fun')} className={\`\${buttonClass} \${currencyMode === 'fun' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'}\`}>
          Play with Fun Coins
        </button>
        <button onClick={() => setCurrencyMode('real')} className={\`\${buttonClass} \${currencyMode === 'real' ? 'bg-green-500 text-gray-900' : 'bg-gray-700 text-green-400 hover:bg-gray-600'}\`}>
          Play with Real Coins
        </button>
      </div>
    );
  }

  return null;
}


interface GameAreaProps {
  games: Game[];
  selectedGame: Game;
  onSelectGame: (game: Game) => void;
  mode: GameMode;
}

// Removed 'worm' from this list so it can support vsComputer mode properly
const TWO_PLAYER_GAMES = ['connect4', 'mancala'];

const GameArea: React.FC<GameAreaProps> = ({ games, selectedGame, onSelectGame, mode }) => {
  const [feedback, setFeedback] = useState('');
  const [playMode, setPlayMode] = useState<PlayMode>('vsPlayer');
  const [playerNames, setPlayerNames] = useState({ player1: 'Player 1', player2: 'Player 2' });
  const { currencyMode } = useCoinSystem();

  const gameProps = { game: selectedGame, playMode, currencyMode, mode, playerNames };
  const [activeGameProps, setActiveGameProps] = useState(gameProps);
  const [previousGameProps, setPreviousGameProps] = useState<typeof gameProps | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  
  const isTwoPlayerGame = mode === GameMode.Under18 && TWO_PLAYER_GAMES.includes(selectedGame.id);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    const newKey = selectedGame.id + (mode === GameMode.Under18 ? playMode : currencyMode);
    const oldKey = activeGameProps.game.id + (activeGameProps.mode === GameMode.Under18 ? activeGameProps.playMode : activeGameProps.currencyMode);

    if (newKey !== oldKey) {
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        setPreviousGameProps(activeGameProps);
        setActiveGameProps({ game: selectedGame, playMode, currencyMode, mode, playerNames });

        transitionTimeoutRef.current = window.setTimeout(() => {
            setPreviousGameProps(null);
            transitionTimeoutRef.current = null;
        }, 300); // Animation duration
    } else {
        setActiveGameProps({ game: selectedGame, playMode, currencyMode, mode, playerNames });
    }
  }, [selectedGame, playMode, currencyMode, mode, playerNames]);

  useEffect(() => {
    return () => {
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }
    };
  }, []);

  const handleSelectGame = (game: Game) => {
    onSelectGame(game);
    setFeedback('');
  };
  
  // Added 'fishing' to the wide layout condition
  const gameAreaSizeClass = (activeGameProps.game.id === 'mancala' || activeGameProps.game.id === 'worm' || activeGameProps.game.id === 'fishing') ? 'max-w-7xl' : 'max-w-4xl';

  const themeClasses = (() => {
    if (mode === GameMode.Adult) {
        return currencyMode === 'fun'
            ? 'bg-[#2c2419]/80 shadow-[0_8px_40px_rgba(255,215,0,0.2),0_2px_8px_rgba(210,160,45,0.2)]' // Gold/Brown tint
            : 'bg-[#192c1d]/80 shadow-[0_8px_40px_rgba(100,255,120,0.2),0_2px_8px_rgba(45,182,60,0.2)]'; // Green tint
    } else { // GameMode.Under18
        return playMode === 'vsPlayer'
            ? 'bg-[#191e2c]/80 shadow-[0_8px_40px_rgba(255,215,0,0.26),0_2px_8px_rgba(182,137,45,0.26)]' // Original blue tint
            : 'bg-[#1e192c]/80 shadow-[0_8px_40px_rgba(220,180,255,0.2),0_2px_8px_rgba(160,137,182,0.2)]'; // Purple tint
    }
  })();
  
  const ActiveGameComponent = activeGameProps.game.component;
  const PreviousGameComponent = previousGameProps?.game.component;

  return (
    <div className="flex flex-col items-center w-full px-4 py-6 md:py-8">
      {/* Game Navigation */}
      <nav className="flex justify-center gap-2 md:gap-4 mb-6 flex-wrap">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleSelectGame(game)}
            className={\`text-base md:text-lg bg-gray-800 text-yellow-400 border-none py-2 px-5 md:py-2.5 md:px-7 rounded-2xl cursor-pointer shadow-md shadow-yellow-400/20 transition-all duration-200 \${
              selectedGame.id === game.id
                ? 'bg-yellow-400 text-gray-800 shadow-lg shadow-yellow-400/40 scale-105'
                : 'hover:bg-yellow-400/80 hover:text-gray-800 hover:shadow-lg hover:shadow-yellow-400/40'
            }\`}
          >
            {game.label}
          </button>
        ))}
      </nav>
      
      {/* Game Options / Player Names */}
      <div className="mb-6 h-auto min-h-[40px] flex flex-col items-center justify-center gap-4">
        {isTwoPlayerGame ? (
          <PlayerNameInputs 
            playMode={playMode} 
            names={playerNames} 
            onNameChange={setPlayerNames}
          />
        ) : (
          <GameOptionsSelector 
            mode={mode} 
            playMode={playMode}
            setPlayMode={setPlayMode}
          />
        )}
      </div>
      
      {/* Game Canvas */}
      <div 
        className={\`w-full \${gameAreaSizeClass} min-h-[420px] rounded-3xl mb-4 overflow-hidden transition-colors duration-500 relative \${themeClasses}\`}
      >
        {PreviousGameComponent && previousGameProps && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center game-transition-out"
              style={{
                paddingBlock: 'var(--game-area-padding-y)',
                paddingInline: 'var(--game-area-padding-x)',
              }}
            >
                <PreviousGameComponent
                    key={previousGameProps.game.id + (previousGameProps.mode === GameMode.Under18 ? previousGameProps.playMode : previousGameProps.currencyMode)}
                    {...previousGameProps}
                />
            </div>
        )}

        <div 
          className={\`w-full h-full flex flex-col items-center justify-center \${previousGameProps ? 'game-transition-in' : ''}\`}
          style={{
            paddingBlock: 'var(--game-area-padding-y)',
            paddingInline: 'var(--game-area-padding-x)',
          }}
        >
            <ActiveGameComponent 
                key={activeGameProps.game.id + (activeGameProps.mode === GameMode.Under18 ? activeGameProps.playMode : activeGameProps.currencyMode)} 
                {...activeGameProps}
            />
        </div>
      </div>
    </div>
  );
};

export default GameArea;`,

  'components/ui/GlassButton.tsx': `import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={\`bg-white/10 hover:bg-yellow-400/20 focus:bg-yellow-400/20 rounded-xl text-yellow-400 hover:text-white focus:text-white py-2 px-6 font-bold border-none shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;`,

  'components/PlayerNameInputs.tsx': `import React from 'react';
import { PlayMode } from '../types';

interface PlayerNameInputsProps {
  playMode: PlayMode;
  names: { player1: string; player2: string };
  onNameChange: React.Dispatch<React.SetStateAction<{ player1: string; player2: string }>>;
}

const PlayerNameInputs: React.FC<PlayerNameInputsProps> = ({ playMode, names, onNameChange }) => {

  const handleNameChange = (player: 'player1' | 'player2', newName: string) => {
    onNameChange(prev => ({ ...prev, [player]: newName }));
  };
  
  const opponentName = playMode === 'vsPlayer' ? 'Player 2' : 'Computer';

  return (
    <div className="leather-board rounded-lg p-3 w-full max-w-lg">
      <h3 className="text-center text-xl mb-2">Player Setup</h3>
      <div className="flex justify-around items-center gap-4">
        <div className="flex-1 flex flex-col items-center">
          <label htmlFor="player1-name" className="font-semibold text-sm mb-1">Player 1 (X)</label>
          <input
            id="player1-name"
            type="text"
            value={names.player1}
            onChange={(e) => handleNameChange('player1', e.target.value)}
            className="w-full text-center rounded p-1 text-base"
          />
        </div>
        <div className="text-2xl font-bold">VS</div>
        <div className="flex-1 flex flex-col items-center">
          <label htmlFor="player2-name" className="font-semibold text-sm mb-1">{opponentName} (O)</label>
          {playMode === 'vsPlayer' ? (
            <input
              id="player2-name"
              type="text"
              value={names.player2}
              onChange={(e) => handleNameChange('player2', e.target.value)}
              className="w-full text-center rounded p-1 text-base"
            />
          ) : (
            <div className="w-full text-center rounded p-1 text-base bg-black/30 h-[34px] flex items-center justify-center">
              Computer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerNameInputs;`,

  'components/auth/LoginPage.tsx': `import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassButton from '../ui/GlassButton';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const { login, loginAsGuest } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
      try {
          await loginAsGuest();
      } catch (e) {
          setError("Failed to enter as guest");
      }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <div className="bg-gray-900/80 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Player Login</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Username or Email</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="Username or email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <GlassButton type="submit" className="mt-2 w-full py-3 !bg-yellow-500 hover:!bg-yellow-400 text-gray-900">
            ENTER ARCADE
          </GlassButton>
        </form>

        <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="px-2 bg-[#151b24] text-sm text-gray-500">OR</span>
            </div>
        </div>

        <button 
            onClick={handleGuestLogin}
            className="w-full py-3 rounded-xl border-2 border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 hover:bg-gray-800/50 transition-all font-semibold"
        >
            Play as Guest
        </button>

        <div className="mt-6 text-center text-gray-400 text-sm">
          New Challenger?{' '}
          <button onClick={onSwitchToSignup} className="text-yellow-400 hover:underline font-bold">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;`,

  'components/auth/SignupPage.tsx': `import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassButton from '../ui/GlassButton';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onSignupSuccess }) => {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
    }

    try {
      await signup(username, email, password);
      onSignupSuccess(email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <div className="bg-gray-900/80 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2 text-center">Join the Arcade</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Create your profile to track high scores and coins.</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="ArcadeKing"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="player@arcade.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <GlassButton type="submit" className="mt-2 w-full py-3 !bg-blue-600 hover:!bg-blue-500">
            SIGN UP
          </GlassButton>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have a profile?{' '}
          <button onClick={onSwitchToLogin} className="text-yellow-400 hover:underline font-bold">
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;`,

  'components/auth/VerificationPage.tsx': `import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassButton from '../ui/GlassButton';

interface VerificationPageProps {
  email: string;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ email }) => {
  const { verifyEmail, cancelVerification } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  useEffect(() => {
      // Debug helper to find the code in local storage for display
      const users = JSON.parse(localStorage.getItem('arcade_users') || '[]');
      const found = users.find((u: any) => u.email === email);
      if (found && found.verificationCode) {
          setDebugCode(found.verificationCode);
      }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const isValid = await verifyEmail(email, code);
      if (!isValid) {
        setError('Invalid verification code. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (success) {
     return (
         <div className="flex flex-col items-center justify-center min-h-[50vh]">
             <div className="bg-green-500/20 border border-green-500/50 p-8 rounded-2xl text-center animate-pop-in">
                 <div className="text-6xl mb-4">✅</div>
                 <h2 className="text-3xl font-bold text-white mb-2">Verified!</h2>
                 <p className="text-green-200">Redirecting you to the arcade floor...</p>
             </div>
         </div>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <div className="bg-gray-900/80 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm relative">
        {/* Back Button */}
        <button
            onClick={cancelVerification}
            className="absolute top-4 left-4 text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold"
        >
            ← Back
        </button>

        <h2 className="text-2xl font-bold text-yellow-400 mb-2 text-center mt-4">Verify Email</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          We sent a code to <span className="text-white font-semibold">{email}</span>.
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1 text-center">6-Digit Code</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-yellow-400 transition-colors font-mono"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <GlassButton type="submit" className="mt-2 w-full py-3 !bg-green-600 hover:!bg-green-500">
            VERIFY ACCOUNT
          </GlassButton>
        </form>

        {/* Debug Code Display */}
        {debugCode && (
            <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-gray-700 text-center animate-slide-in">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Development Mode</div>
                <div className="text-gray-400 text-sm">Your verification code is:</div>
                <div className="text-xl font-mono text-yellow-400 font-bold tracking-widest mt-1">{debugCode}</div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;`,

  'components/profile/ProfilePage.tsx': `import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCoinSystem } from '../../context/CoinContext';
import GlassButton from '../ui/GlassButton';

const ProfilePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, updateProfile } = useAuth();
  const { funCoins, realCoins, transactions } = useCoinSystem();
  
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'dev'>('overview');

  // Dev/Git State
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState(['main', 'dev', 'staging', 'feature/ui-update']);
  const [newBranchName, setNewBranchName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // 'branch', 'commit', 'pull', 'create_repo'

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ bio });
    setIsEditing(false);
  };

  // Simulated Git Actions
  const handleCreateBranch = () => {
      if(!newBranchName.trim()) return;
      setLoadingAction('branch');
      setTimeout(() => {
          const name = newBranchName.trim().replace(/\\s+/g, '-').toLowerCase();
          setBranches(prev => [...prev, name]);
          setCurrentBranch(name);
          setNewBranchName('');
          setLoadingAction(null);
      }, 800);
  };

  const handleCommitAndPush = () => {
      if(!commitMessage.trim()) return;
      setLoadingAction('commit');
      setTimeout(() => {
          setLoadingAction(null);
          setCommitMessage('');
          alert(\`[\${currentBranch}] Changes committed and pushed successfully!\`);
      }, 1500);
  };

  const handlePull = () => {
      setLoadingAction('pull');
      setTimeout(() => {
          setLoadingAction(null);
          alert(\`Fast-forwarded \${currentBranch} from origin/\${currentBranch}.\`);
      }, 2000);
  };

  const handleCreateRepo = () => {
      setLoadingAction('create_repo');
      setTimeout(() => {
          setLoadingAction(null);
          alert("Repository '5idecoders-arcade' created successfully on GitHub!");
      }, 2000);
  };

  const handleOpenRepo = () => {
      window.open('https://github.com/5idescoder/arcade-hub', '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-slide-in">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <GlassButton onClick={onBack} className="text-sm px-4 self-start md:self-auto">← Back to Games</GlassButton>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 bg-gray-900/50 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={\`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap \${activeTab === 'overview' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={\`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap \${activeTab === 'history' ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
                >
                    History
                </button>
                <button 
                    onClick={() => setActiveTab('dev')}
                    className={\`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap \${activeTab === 'dev' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
                >
                    Git Control
                </button>
            </div>
        </div>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm h-fit shadow-xl">
                    <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-yellow-400 mb-4 overflow-hidden shadow-lg shadow-yellow-400/20">
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
                    <div className="text-gray-400 text-xs mb-4 flex items-center justify-center gap-2">
                         {user.isVerified ? (
                             <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 flex items-center gap-1">
                                 ✓ Verified
                             </span>
                         ) : (
                             <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">Unverified</span>
                         )}
                         <span className="text-gray-600">•</span>
                         <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="w-full bg-black/30 rounded-xl p-3 mb-4">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <textarea 
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)}
                                    className="bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white w-full focus:border-yellow-400 outline-none"
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-2 rounded font-bold">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded font-bold">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="group relative">
                                <p className="text-gray-300 text-sm italic">"{bio || "No bio yet."}"</p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="absolute top-0 right-0 text-xs text-gray-500 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats & Balances */}
                <div className="md:col-span-2 flex flex-col gap-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {/* Fun Balance */}
                         <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🪙</div>
                             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Fun Coins Balance</h3>
                             <div className="text-4xl font-black text-yellow-400">{Math.floor(funCoins).toLocaleString()} <span className="text-lg">FC</span></div>
                         </div>
                         
                         {/* Real Balance */}
                         <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💵</div>
                             <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Real Coins Balance</h3>
                             <div className="text-4xl font-black text-green-400">{Math.floor(realCoins).toLocaleString()} <span className="text-lg">RC</span></div>
                         </div>
                     </div>

                     {/* Recent Activity Preview */}
                     <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 flex-1">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                             <span>Recent Activity</span>
                         </h3>
                         <div className="space-y-2">
                             {transactions.length > 0 ? (
                                 transactions.slice(0, 3).map(tx => (
                                    <div key={tx.id} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-200">{tx.reason}</span>
                                            <span className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                                        </div>
                                        <span className={\`font-mono font-bold \${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}\`}>
                                            {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                        </span>
                                    </div>
                                 ))
                             ) : (
                                 <div className="text-center text-gray-500 py-8">No transactions yet. Play some games!</div>
                             )}
                         </div>
                         {transactions.length > 3 && (
                             <button 
                                onClick={() => setActiveTab('history')}
                                className="w-full mt-4 text-sm text-gray-400 hover:text-white hover:underline text-center"
                             >
                                 View All Activity
                             </button>
                         )}
                     </div>
                </div>
            </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
                                <th className="p-3">Time</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 text-right">Amount</th>
                                <th className="p-3 text-right">Currency</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {transactions.length > 0 ? transactions.map(tx => (
                                <tr key={tx.id} className="border-b border-gray-800 hover:bg-white/5">
                                    <td className="p-3 text-gray-400">{new Date(tx.timestamp).toLocaleString()}</td>
                                    <td className="p-3">
                                        <span className={\`px-2 py-1 rounded text-xs font-bold uppercase \${tx.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}\`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-3 font-medium text-gray-200">{tx.reason}</td>
                                    <td className={\`p-3 text-right font-mono font-bold \${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}\`}>
                                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                    </td>
                                    <td className="p-3 text-right text-gray-500 uppercase">{tx.currency === 'fun' ? 'Fun' : 'Real'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* DEV / GIT TAB */}
        {activeTab === 'dev' && (
            <div className="grid md:grid-cols-3 gap-6">
                {/* Repo Info */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 md:col-span-3 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black text-2xl">
                            <svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">5idescoder/arcade-hub</h2>
                            <p className="text-gray-400 text-sm">Public Repository • TypeScript • React</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-md text-xs text-gray-300">
                             <span className="w-2 h-2 rounded-full bg-green-400"></span>
                             {currentBranch}
                        </div>
                        <button 
                            onClick={handleCreateRepo}
                            disabled={loadingAction === 'create_repo'}
                            className="px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-md text-sm font-bold transition-colors disabled:opacity-50"
                        >
                            {loadingAction === 'create_repo' ? 'Creating...' : 'Create Repo'}
                        </button>
                        <button onClick={handleOpenRepo} className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md text-sm font-bold transition-colors">
                            View on GitHub
                        </button>
                    </div>
                </div>

                {/* Branch Management */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Branch Management</h3>
                    
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Current Branch</label>
                        <select 
                            value={currentBranch} 
                            onChange={(e) => setCurrentBranch(e.target.value)}
                            className="w-full mt-1 bg-[#21262d] border border-[#30363d] text-white rounded p-2 outline-none focus:border-blue-500"
                        >
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div className="pt-2">
                        <label className="text-xs text-gray-400 uppercase font-bold">Create New Branch</label>
                        <div className="flex gap-2 mt-1">
                            <input 
                                type="text" 
                                value={newBranchName}
                                onChange={(e) => setNewBranchName(e.target.value)}
                                placeholder="feature/new-game"
                                className="flex-1 bg-[#21262d] border border-[#30363d] text-white rounded p-2 outline-none focus:border-blue-500 text-sm"
                            />
                            <button 
                                onClick={handleCreateBranch}
                                disabled={!newBranchName || loadingAction === 'branch'}
                                className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white px-3 rounded font-bold disabled:opacity-50"
                            >
                                {loadingAction === 'branch' ? '...' : '+'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-[#30363d]">
                        <button 
                            onClick={handlePull} 
                            disabled={loadingAction === 'pull'}
                            className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white py-2 rounded font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <span>⬇</span> Pull Origin
                        </button>
                    </div>
                </div>

                {/* Commit & Push */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 md:col-span-2 flex flex-col gap-4">
                    <h3 className="text-white font-bold border-b border-[#30363d] pb-2">Commit Changes</h3>
                    
                    <div className="flex-1 bg-[#161b22] rounded border border-[#30363d] p-4 font-mono text-xs text-gray-400 overflow-y-auto max-h-[150px]">
                        <p><span className="text-yellow-400">M</span> components/profile/ProfilePage.tsx</p>
                        <p><span className="text-green-400">A</span> assets/images/avatar_v2.png</p>
                        <p><span className="text-yellow-400">M</span> styles/globals.css</p>
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            placeholder="Commit message..."
                            className="flex-1 bg-[#21262d] border border-[#30363d] text-white rounded p-2 outline-none focus:border-blue-500 text-sm"
                        />
                        <button 
                            onClick={handleCommitAndPush}
                            disabled={!commitMessage || loadingAction === 'commit'}
                            className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2 rounded font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                        >
                            {loadingAction === 'commit' ? 'Pushing...' : 'Commit & Push'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfilePage;`,
};

// 3. Write Files
Object.entries(files).forEach(([name, content]) => {
  const filePath = path.join(process.cwd(), name);
  fs.writeFileSync(filePath, content);
  console.log(`Created file: ${name}`);
});

console.log('Setup complete! Run "npm install" then "npm run dev