
const fs = require('fs');
const path = require('path');

// Ensure src directories exist
const dirs = [
  'src',
  'src/components',
  'src/components/auth',
  'src/components/dev',
  'src/components/games',
  'src/components/profile',
  'src/components/ui',
  'src/context',
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const files = {
  'package.json': JSON.stringify({
    "name": "arcade-hub",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "lucide-react": "^0.344.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.64",
      "@types/react-dom": "^18.2.21",
      "@vitejs/plugin-react": "^4.2.1",
      "typescript": "^5.2.2",
      "vite": "^5.1.6",
      "autoprefixer": "^10.4.18",
      "postcss": "^8.4.35",
      "tailwindcss": "^3.4.1"
    }
  }, null, 2),

  'vite.config.ts': `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
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
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
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
      /* Base font size for responsive rem units */
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
      
      /* Additional styles from original file maintained implicitly via Tailwind or inline styles in components */
      
      /* Scrollbar hiding for clean UI */
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  </head>
  <body>
    <div id="root" class="w-full"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'src/main.tsx': `import React from 'react';
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

  'src/types.ts': `import React from 'react';

export enum GameMode {
  Under18 = 'under18',
  Adult = 'adult',
}

export interface Game {
  id: string;
  label: string;
  component: React.ComponentType<any>;
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

  'src/constants.tsx': `import { Game } from './types';
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
import SpinWheelGame from './components/games/SpinWheelGame';
import RPSCardGame from './components/games/RPSCardGame';
import CoinPusherGame from './components/games/CoinPusherGame';
import TicTacToeGame from './components/games/TicTacToeGame';

export const ADULT_GAMES: Game[] = [
    { id: 'crash', label: 'Crash', component: CrashGame },
    { id: 'blackjack', label: 'Blackjack', component: BlackjackGame },
    { id: 'poker', label: 'Hold\\'em', component: TexasHoldemGame },
    { id: 'keno', label: 'Keno', component: KenoGame },
    { id: 'plinko', label: 'Plinko', component: PlinkoGame },
    { id: 'slots', label: 'Slots', component: SlotsGame },
    { id: 'fishing', label: 'Ocean Hunter', component: FishingGame },
    { id: 'wheel', label: 'Spin Wheel', component: SpinWheelGame },
    { id: 'pusher', label: 'Coin Pusher', component: CoinPusherGame },
];

export const UNDER18_GAMES: Game[] = [
    { id: 'worm', label: 'Worm.io', component: WormGame },
    { id: 'connect4', label: 'Connect Four', component: ConnectFourGame },
    { id: 'rubikscube', label: "Rubik's Cube", component: RubiksCubeGame },
    { id: 'mancala', label: 'Mancala', component: MancalaGame },
    { id: 'tictactoe', label: 'Tic Tac Toe', component: TicTacToeGame },
    { id: 'rps', label: 'Memory Match', component: RPSCardGame },
];`,

  'src/App.tsx': `import React, { useState } from 'react';
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
  const [selectedGame, setSelectedGame] = useState<Game>(UNDER18_GAMES[0]);
  
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [showProfile, setShowProfile] = useState(false);

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
                        onSignupSuccess={() => {}}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
  }

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
};

// Write files to disk
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  // Ensure directory exists for file
  const dirname = path.dirname(fullPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log(`Created: ${filePath}`);
});

console.log('\\nProject created successfully!');
console.log('Run "npm install" then "npm run dev" to start.');
