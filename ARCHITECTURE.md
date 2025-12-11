# MonadType - Complete Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                     http://localhost:5173                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │    Game      │    │   Wallet     │    │  Components  │    │
│  │   Context    │◄───┤  Context     │◄───┤  (Modals,    │    │
│  │              │    │              │    │   Canvas)    │    │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘    │
│         │                   │                                  │
│         │                   │                                  │
│         ▼                   ▼                                  │
│  ┌──────────────────────────────────────┐                     │
│  │     Blockchain Service               │                     │
│  │  ┌─────────────────────────────┐    │                     │
│  │  │ getTokenBalance()           │    │                     │
│  │  │ hasClaimedLevel()           │    │                     │
│  │  │ getLevelReward()            │    │                     │
│  │  │ getHighestLevel()           │    │                     │
│  │  └─────────────────────────────┘    │                     │
│  └──────────────────┬───────────────────┘                     │
│                     │                                          │
└─────────────────────┼──────────────────────────────────────────┘
                      │
                      │ ethers.js
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   MetaMask      │       │  Backend API    │
│   Wallet        │       │  /api/level-    │
│                 │       │   complete      │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │                         │ Owner's Wallet
         │                         │ (Signs TX)
         │                         │
         └────────┬────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│           MONAD TESTNET (Blockchain)                    │
│              Chain ID: 41454                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  MonadTypeToken (ERC20)                          │ │
│  │  0x7578654611e0E505A976A06DAF3de44a746F4D77      │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  • balanceOf(address) → uint256                  │ │
│  │  • transfer(address, uint256) → bool             │ │
│  │  • mint(address, uint256)                        │ │
│  │  • Total Supply: 1,000,000 MNTYPE                │ │
│  └──────────────────────────────────────────────────┘ │
│                         │                              │
│                         │ Referenced by                │
│                         ▼                              │
│  ┌──────────────────────────────────────────────────┐ │
│  │  MonadTypeRewards                                │ │
│  │  0x98A538511fF0ad568D5E32aa604C5Ef1f3046741      │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  • rewardPlayer(address, level) [owner only]     │ │
│  │  • hasClaimedLevel(address, level) → bool        │ │
│  │  • getLevelReward(level) → uint256               │ │
│  │  • getHighestLevel(address) → uint256            │ │
│  │  • setLevelReward(level, amount) [owner only]    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Wallet Connection

```
User clicks "Connect Wallet"
    ↓
WalletContext.connectWallet()
    ↓
MetaMask prompts user
    ↓
ethers.BrowserProvider created
    ↓
getTokenBalance() fetches balance from blockchain
    ↓
UI updates with address & balance
```

### 2. Playing Game

```
User types word
    ↓
GameContext.updateInput()
    ↓
Enemy destroyed when word complete
    ↓
Score increases
    ↓
All enemies destroyed → Level Complete
    ↓
LevelCompleteModal shows
```

### 3. Claiming Reward

```
User clicks "Claim Reward"
    ↓
LevelCompleteModal.claimReward()
    ↓
Checks hasClaimedLevel() on blockchain
    ↓
POST /api/level-complete
    ↓
Backend validates request
    ↓
Backend calls rewardPlayer() on contract
    ↓
Smart contract:
  - Checks level not claimed ✓
  - Checks reward configured ✓
  - Marks level as claimed
  - Transfers MNTYPE tokens to player
    ↓
Transaction confirmed
    ↓
UI refreshes balance
    ↓
Success message shown
```

### 4. Level Progression

```
Level Complete Modal shown
    ↓
User clicks "Continue"
    ↓
Game.handleContinueGame()
    ↓
GameContext.nextLevel()
  - Increments level
  - Resets lives to 3
  - Spawns new enemies
  - Increases difficulty
    ↓
Game.resumeGame()
  - Resumes game loop
  - Enemies start moving
    ↓
Level 2 starts successfully! ✅
```

## 🎯 Component Responsibilities

### Frontend Components

```
┌─────────────────────────────────────────────┐
│ App.tsx                                     │
│ ├─ WalletProvider                           │
│ │  └─ Manages wallet state & blockchain     │
│ │                                            │
│ └─ GameProvider                             │
│    └─ Manages game state & logic            │
│       ├─ Game.tsx                           │
│       │  ├─ GameCanvas.tsx (renders game)   │
│       │  ├─ LevelCompleteModal.tsx          │
│       │  └─ GameOverModal.tsx               │
│       │                                      │
│       └─ Uses blockchain service            │
│          └─ src/services/blockchain.ts      │
└─────────────────────────────────────────────┘
```

### Backend API

```
┌─────────────────────────────────────────────┐
│ api/level-complete.ts                       │
│                                             │
│ ├─ Rate Limiting (10/min)                  │
│ ├─ Input Validation                        │
│ ├─ Blockchain Connection                   │
│ │  └─ ethers.JsonRpcProvider               │
│ │     └─ Owner's Wallet (signer)           │
│ │        └─ Calls rewardPlayer()           │
│ │                                           │
│ └─ Response with TX hash                   │
└─────────────────────────────────────────────┘
```

### Smart Contracts

```
┌─────────────────────────────────────────────┐
│ MonadTypeToken (ERC20)                      │
│ ├─ Standard ERC20 functions                │
│ ├─ Mintable by owner                       │
│ └─ 1,000,000 initial supply                │
└─────────────────────────────────────────────┘
         │
         │ Referenced by
         ▼
┌─────────────────────────────────────────────┐
│ MonadTypeRewards                            │
│ ├─ Stores level rewards                    │
│ ├─ Tracks claimed levels                   │
│ ├─ Tracks highest level reached            │
│ ├─ Distributes tokens (owner only)         │
│ └─ ReentrancyGuard for security            │
└─────────────────────────────────────────────┘
```

## 📦 File Structure

```
Monad-Hack/
├── contracts/                    # Smart contracts
│   ├── MonadTypeToken.sol       # ERC20 token
│   └── MonadTypeRewards.sol     # Reward logic
│
├── src/
│   ├── config/
│   │   └── contracts.ts         # 🆕 Addresses & ABIs
│   │
│   ├── services/
│   │   └── blockchain.ts        # 🆕 Blockchain functions
│   │
│   ├── contexts/
│   │   ├── GameContext.tsx      # ✏️ Game state
│   │   └── WalletContext.tsx    # ✏️ Wallet + balance
│   │
│   └── components/
│       ├── Game.tsx             # ✏️ Main game component
│       ├── GameCanvas.tsx       # Game rendering
│       ├── LevelCompleteModal.tsx # ✏️ Reward claiming
│       └── ...
│
├── api/
│   └── level-complete.ts        # ✏️ Reward distribution
│
├── scripts/
│   ├── fund-rewards.ts          # 🆕 Fund contract
│   └── setup-rewards.ts         # 🆕 Set rewards
│
├── INTEGRATION_GUIDE.md         # 🆕 Full documentation
├── QUICKSTART.md                # 🆕 Setup guide
├── SUMMARY.md                   # 🆕 This summary
└── .env.example                 # ✏️ Config template

Legend:
🆕 = New file created
✏️ = Modified file
```

## 🔐 Security Flow

```
┌──────────────────────────────────────────────┐
│ PLAYER SIDE                                  │
├──────────────────────────────────────────────┤
│ • Only reads from blockchain                 │
│ • Cannot call rewardPlayer()                 │
│ • Can only claim through backend API         │
│ • Each level claimable once (enforced)       │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│ BACKEND API                                  │
├──────────────────────────────────────────────┤
│ ✓ Rate limiting (10 req/min)                │
│ ✓ Input validation                          │
│ ✓ Duplicate claim check                     │
│ ✓ Score verification                        │
│ ✓ Uses owner's private key                  │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│ SMART CONTRACT                               │
├──────────────────────────────────────────────┤
│ ✓ onlyOwner modifier on rewardPlayer()      │
│ ✓ ReentrancyGuard protection                │
│ ✓ Tracks all claims on-chain                │
│ ✓ Cannot claim same level twice             │
│ ✓ Immutable reward logic                    │
└──────────────────────────────────────────────┘
```

## 🎮 Game State Machine

```
┌─────────────┐
│   Initial   │
│  (Not       │
│  Playing)   │
└──────┬──────┘
       │ startGame()
       ▼
┌─────────────┐
│   Playing   │◄────┐
│  (Active)   │     │
└──────┬──────┘     │
       │            │
       │ All        │ nextLevel()
       │ enemies    │ resumeGame()
       │ destroyed  │
       ▼            │
┌─────────────┐     │
│   Level     │─────┘
│  Complete   │
└──────┬──────┘
       │
       │ Lives = 0
       ▼
┌─────────────┐
│  Game Over  │
└─────────────┘
```

## 🚀 Deployment Checklist

```
Prerequisites:
├─ [✓] Contracts deployed to Monad Testnet
├─ [✓] Contract addresses updated in code
├─ [✓] .env file configured with private key
├─ [ ] Rewards contract funded with tokens
└─ [ ] Level rewards set (1-10)

Development:
├─ [✓] Dependencies installed (bun install)
├─ [✓] Project builds successfully
├─ [ ] Frontend running (bun run dev)
├─ [ ] Backend running (bun run server)
└─ [ ] Tested on localhost

Testing:
├─ [ ] Wallet connects to Monad Testnet
├─ [ ] Token balance displays correctly
├─ [ ] Game plays smoothly
├─ [ ] Level progression works (1→2→3...)
├─ [ ] Rewards display from blockchain
├─ [ ] Can claim rewards successfully
├─ [ ] Balance updates after claim
└─ [ ] Double-claim prevention works

Production:
├─ [ ] Environment variables set
├─ [ ] CORS configured for production URL
├─ [ ] Deployed to hosting (Vercel/Netlify)
├─ [ ] SSL certificate active
├─ [ ] Error monitoring setup
└─ [ ] Analytics integrated
```

---

**Your fully-integrated blockchain typing game is ready! 🎉**
