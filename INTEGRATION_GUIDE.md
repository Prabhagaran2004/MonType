# MonadType - Blockchain Integration Setup Guide

## 🎮 What I Integrated

I've fully integrated your MonadType game with the blockchain smart contracts deployed on Monad Testnet. Here's what was done:

### ✅ Completed Integrations

1. **Contract Configuration** (`src/config/contracts.ts`)

   - Added your deployed contract addresses
   - Token: `0x7578654611e0E505A976A06DAF3de44a746F4D77`
   - Rewards: `0x98A538511fF0ad568D5E32aa604C5Ef1f3046741`
   - Created ABIs for contract interactions

2. **Blockchain Service** (`src/services/blockchain.ts`)

   - `getTokenBalance()` - Fetch player's MNTYPE token balance
   - `hasClaimedLevel()` - Check if player claimed a level reward
   - `getLevelReward()` - Get reward amount for each level
   - `getHighestLevel()` - Track player's highest level reached
   - `getPlayerStats()` - Comprehensive player statistics

3. **WalletContext Updates**

   - Real-time token balance fetching from blockchain
   - Automatic balance refresh after claiming rewards
   - Connected to your deployed ERC20 token contract

4. **LevelCompleteModal Enhancements**

   - Fetches actual reward amounts from blockchain
   - Checks if level was already claimed (prevents double-claiming)
   - Shows loading state while fetching data
   - Automatic token balance update after successful claim

5. **Level Progression Bug Fix**

   - Fixed: Game now properly resumes when clicking "Continue"
   - Fixed: Level 1 → Level 2 transition works correctly
   - Game automatically spawns new enemies for next level

6. **API Endpoint** (`api/level-complete.ts`)
   - Updated with your contract addresses
   - Calls `rewardPlayer()` on the smart contract
   - Validates claims and prevents duplicates
   - Rate limiting for security

---

## 🚀 How to Setup

### Step 1: Environment Variables

Create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your private key:

```env
PRIVATE_KEY=your_wallet_private_key_here
```

**⚠️ IMPORTANT:** This should be the private key of the wallet that deployed the contracts (the owner wallet).

### Step 2: Transfer Tokens to Rewards Contract

Before players can claim rewards, you need to fund the Rewards contract with tokens:

1. Go to Remix: https://remix.ethereum.org
2. Connect to Monad Testnet
3. Open your MonadTypeToken contract: `0x7578654611e0E505A976A06DAF3de44a746F4D77`
4. Call `transfer` with:
   - `to`: `0x98A538511fF0ad568D5E32aa604C5Ef1f3046741` (Rewards contract)
   - `amount`: `100000000000000000000000` (100,000 tokens = 100,000 \* 10^18)

### Step 3: Set Level Rewards

Configure rewards for each level in the Rewards contract:

1. Go to Remix with MonadTypeRewards: `0x98A538511fF0ad568D5E32aa604C5Ef1f3046741`
2. Call `setLevelReward` for each level:

```
Level 1: setLevelReward(1, 10000000000000000000)   // 10 MNTYPE
Level 2: setLevelReward(2, 20000000000000000000)   // 20 MNTYPE
Level 3: setLevelReward(3, 30000000000000000000)   // 30 MNTYPE
Level 4: setLevelReward(4, 50000000000000000000)   // 50 MNTYPE
Level 5: setLevelReward(5, 100000000000000000000)  // 100 MNTYPE
```

### Step 4: Run the Application

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# In another terminal, run the backend API (for reward claiming)
bun run server
```

---

## 🎯 How It Works

### Game Flow

1. **Player Connects Wallet**

   - MetaMask connects to Monad Testnet
   - App fetches their MNTYPE token balance from blockchain
   - Balance updates automatically

2. **Player Plays Game**

   - Type words to destroy enemies
   - Each enemy destroyed = points
   - Reach score of 50+ to qualify for rewards

3. **Level Complete**

   - Modal shows actual reward amount from blockchain
   - Checks if player already claimed this level
   - "Claim Reward" button calls backend API

4. **Claiming Rewards**

   - Backend validates the request
   - Calls `rewardPlayer()` on smart contract
   - Tokens are transferred to player's wallet
   - UI updates with new balance

5. **Next Level**
   - Click "Continue" to advance
   - Game properly resumes with new enemies
   - Lives reset to 3
   - Higher difficulty

### Smart Contract Functions Used

**MonadTypeToken (ERC20)**

- `balanceOf(address)` - Check player's token balance
- `transfer(address, uint256)` - Owner funds the Rewards contract

**MonadTypeRewards**

- `setLevelReward(uint256 level, uint256 amount)` - Owner sets rewards
- `rewardPlayer(address player, uint256 level)` - Owner gives rewards
- `hasClaimedLevel(address, uint256)` - Check if level claimed
- `getLevelReward(uint256)` - Get reward amount
- `getHighestLevel(address)` - Get player's progress

---

## 🔧 Key Files Modified

```
src/
├── config/
│   └── contracts.ts          ✨ NEW - Contract addresses & ABIs
├── services/
│   └── blockchain.ts         ✨ NEW - Blockchain interaction functions
├── contexts/
│   └── WalletContext.tsx     ✅ UPDATED - Real token balance
├── components/
│   ├── Game.tsx              ✅ UPDATED - Fixed level progression
│   └── LevelCompleteModal.tsx ✅ UPDATED - Blockchain reward claiming

api/
└── level-complete.ts          ✅ UPDATED - Contract integration

.env.example                   ✅ UPDATED - Your contract addresses
```

---

## 📊 Testing Checklist

- [ ] Connect wallet to Monad Testnet
- [ ] Token balance displays correctly
- [ ] Play game and complete Level 1
- [ ] Level complete modal shows reward amount
- [ ] Click "Claim Reward" (should call smart contract)
- [ ] Balance updates after successful claim
- [ ] Click "Continue" - Level 2 starts properly
- [ ] Try claiming same level again - should show "Already Claimed"

---

## 🐛 Common Issues & Solutions

### "Failed to claim reward"

- **Cause:** Private key not set in `.env`
- **Solution:** Add your owner wallet's private key to `.env`

### "No reward configured for this level"

- **Cause:** Haven't called `setLevelReward()` for that level
- **Solution:** Use Remix to set rewards (see Step 3)

### "Token transfer failed"

- **Cause:** Rewards contract has no tokens
- **Solution:** Transfer tokens to Rewards contract (see Step 2)

### "Already claimed"

- **Cause:** Player already claimed that level's reward
- **Solution:** This is correct! Each level can only be claimed once

### Level doesn't progress

- **Cause:** Was a bug, now fixed!
- **Solution:** The fix ensures `resumeGame()` is called after `nextLevel()`

---

## 🎮 Using Without Remix (Hardhat Alternative)

If you want to use Hardhat instead of Remix:

```bash
# Set level rewards via Hardhat
npx hardhat run scripts/setup-rewards.ts --network monad_testnet

# Transfer tokens to rewards contract
npx hardhat run scripts/fund-rewards.ts --network monad_testnet
```

---

## 📝 Next Steps

1. ✅ Set your private key in `.env`
2. ✅ Fund the Rewards contract with tokens
3. ✅ Set reward amounts for each level
4. ✅ Test the full game flow
5. 🚀 Deploy to production (Vercel/similar)

---

## 🔐 Security Notes

- **NEVER** commit your `.env` file
- Private key should only be in `.env` (not in code)
- Only the contract owner can call `rewardPlayer()`
- Rate limiting prevents spam (10 requests/minute)
- Each level can only be claimed once per player

---

## 🎉 Summary

Your MonadType game is now a **fully functional dApp** with:

- ✅ Real blockchain integration
- ✅ On-chain reward distribution
- ✅ Wallet connection & balance tracking
- ✅ Fixed level progression
- ✅ Secure reward claiming
- ✅ Prevention of double-claiming

Players can now earn real MNTYPE tokens by playing your game! 🎮💜
