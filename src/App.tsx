import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext.tsx";
import { GameProvider } from "./contexts/GameContext.tsx";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import StatsScreen from "./screens/StatsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ShopScreen from "./screens/ShopScreen";
import NotFoundScreen from "./screens/NotFoundScreen";

const App: React.FC = () => {
  return (
    <WalletProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </WalletProvider>
  );
};

export default App;
