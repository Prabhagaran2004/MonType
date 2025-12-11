# 🚀 Quick Start Guide - MonadType dApp

## ⚡ Fastest Way to Get Started

### 1️⃣ Clone & Install (Done ✅)

You already have the project! Just make sure dependencies are installed:

```bash
bun install
```

### 2️⃣ Setup Environment (2 minutes)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your private key
# (The wallet that deployed the contracts)
```

### 3️⃣ Fund & Configure Contracts (Choose One)

#### Option A: Using Remix (Easiest for beginners)

1. **Transfer Tokens to Rewards Contract**

   - Open Remix: https://remix.ethereum.org
   - Connect to Monad Testnet
   - Load Token: `0x7578654611e0E505A976A06DAF3de44a746F4D77`
   - Call: `transfer("0x98A538511fF0ad568D5E32aa604C5Ef1f3046741", "100000000000000000000000")`

2. **Set Level Rewards**
   - Load Rewards: `0x98A538511fF0ad568D5E32aa604C5Ef1f3046741`
   - Call multiple times:
   ```
   setLevelReward(1, 10000000000000000000)   // Level 1: 10 tokens
   setLevelReward(2, 20000000000000000000)   // Level 2: 20 tokens
   setLevelReward(3, 30000000000000000000)   // Level 3: 30 tokens
   setLevelReward(4, 50000000000000000000)   // Level 4: 50 tokens
   setLevelReward(5, 100000000000000000000)  // Level 5: 100 tokens
   ```

#### Option B: Using Hardhat Scripts (Faster)

```bash
# Fund the rewards contract with tokens
npx hardhat run scripts/fund-rewards.ts --network monad_testnet

# Set up level rewards
npx hardhat run scripts/setup-rewards.ts --network monad_testnet
```

### 4️⃣ Run the Application

```bash
# Terminal 1: Start frontend
bun run dev

# Terminal 2: Start backend (for reward claiming)
bun run server
```

Open: http://localhost:5173

### 5️⃣ Test It Out!

1. Click "Connect Wallet" → Connect to Monad Testnet
2. Click "Start Game"
3. Type the words to destroy enemies
4. Complete Level 1 (get 50+ score)
5. Click "Claim Reward" → Tokens sent to your wallet! 🎉
6. Click "Continue" → Level 2 starts!

---

## 🎮 How to Play

- **Type the word** you see on each enemy
- **Backspace** to correct mistakes
- **ESC** to pause
- Each word = points
- Don't let enemies reach the bottom!

---

## 📋 Verification Checklist

After setup, verify everything works:

- [ ] Website loads at http://localhost:5173
- [ ] Can connect wallet to Monad Testnet
- [ ] Token balance shows correctly (after funding)
- [ ] Can start game
- [ ] Enemies spawn and move
- [ ] Typing destroys enemies
- [ ] Level 1 completes
- [ ] Level complete modal shows reward amount
- [ ] Can claim reward (check wallet after)
- [ ] Can continue to Level 2
- [ ] Balance updates after claim

---

## 🎯 Architecture Overview

```
Frontend (React + Vite)
    ↓
Wallet Connection (ethers.js)
    ↓
Smart Contracts (Monad Testnet)
    ├─ MonadTypeToken (ERC20)
    └─ MonadTypeRewards (Game Logic)
    ↓
Backend API (Bun/Node)
    └─ Calls rewardPlayer()
```

---

## 📦 What's Included

### Smart Contracts

- ✅ `MonadTypeToken` - ERC20 token (MNTYPE)
- ✅ `MonadTypeRewards` - Reward distribution & tracking

### Frontend

- ✅ Game engine with typing mechanics
- ✅ Wallet connection (MetaMask)
- ✅ Real-time balance updates
- ✅ Level progression system
- ✅ Reward claiming UI

### Backend

- ✅ API endpoint for reward distribution
- ✅ Rate limiting & security
- ✅ Transaction handling

### Scripts

- ✅ Automated contract setup
- ✅ Token funding helpers
- ✅ Deployment tools

---

## 🛠️ Useful Commands

```bash
# Development
bun run dev              # Start frontend dev server
bun run server           # Start backend API
bun run build            # Build for production

# Smart Contracts
npx hardhat compile      # Compile contracts
npx hardhat run scripts/setup-rewards.ts --network monad_testnet
npx hardhat run scripts/fund-rewards.ts --network monad_testnet

# Deployment
bun run deploy:testnet   # Deploy contracts to Monad Testnet
```

---

## 📝 Important Notes

### Contract Addresses (Already Deployed)

- **Token:** `0x7578654611e0E505A976A06DAF3de44a746F4D77`
- **Rewards:** `0x98A538511fF0ad568D5E32aa604C5Ef1f3046741`

### Default Configuration

- Network: Monad Testnet (Chain ID: 41454)
- RPC: https://testnet-rpc.monad.xyz
- Min Score to Claim: 50 points
- Lives per Level: 3

### Security

- Private key only in `.env` (never commit!)
- Rate limit: 10 claims per minute
- Each level claimable once per player
- Only owner can distribute rewards

---

## 🚨 Troubleshooting

**"Can't connect wallet"**

- Make sure MetaMask is installed
- Switch to Monad Testnet
- Try refreshing the page

**"Claim button disabled"**

- Need 50+ score to claim
- Check if level already claimed

**"Transaction failed"**

- Ensure you set level rewards (Step 3)
- Ensure rewards contract has tokens
- Check you have MON for gas

**"Level won't progress"**

- Fixed! Make sure you pulled latest code
- Click "Continue" after level complete

---

## 📚 Further Reading

- Full integration details: `INTEGRATION_GUIDE.md`
- Contract documentation: `contracts/` folder
- API reference: `api/level-complete.ts`

---

## 🎉 You're Ready!

Your fully-functional blockchain typing game is ready to play!

**Next Steps:**

1. Test locally ✅
2. Deploy to Vercel/Netlify 🚀
3. Share with players 🎮
4. Earn real tokens! 💰

Need help? Check `INTEGRATION_GUIDE.md` for detailed explanations.
