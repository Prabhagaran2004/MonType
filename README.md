# MonadType - Typing Shooter Game on Monad

A browser-based typing shooter game deployed on the Monad blockchain where players type falling words to destroy enemies and earn MNTYPE tokens.

## 🎮 Game Features

- **Typing Shooter Gameplay**: Type falling words to destroy enemies before they reach the bottom
- **Progressive Difficulty**: Levels increase enemy speed and word complexity
- **Token Rewards**: Earn MNTYPE tokens for completing levels
- **Web3 Integration**: Connect your wallet and track on-chain rewards
- **Leaderboard**: Compete for high scores and track progress

## 🏗️ Architecture

### Smart Contracts

- **MonadTypeToken**: ERC-20 token for rewards (MNTYPE)
- **MonadTypeRewards**: Manages level rewards and prevents double-claiming

### Wallet Address
- **0xff39452d7ED862Df2410116Dd653154DAa48555F**

### Frontend

- **React + TypeScript**: Modern web development with type safety
- **Canvas Game**: HTML5 canvas for smooth gameplay
- **TailwindCSS**: Beautiful and responsive UI
- **Web3 Integration**: MetaMask wallet connection and token balance display

### Backend

- **Express API**: Secure reward distribution
- **Rate Limiting**: Prevents abuse
- **Ethers.js**: Smart contract interactions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Bun (recommended for faster package management)
- MetaMask browser extension

### Installation

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd mon-hack
bun install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Compile smart contracts:

```bash
bun run compile
```

4. Deploy contracts to Monad testnet:

```bash
bun run deploy:testnet
```

5. Update contract addresses in your `.env` file after deployment.

6. Start the development servers:

```bash
# Terminal 1 - Frontend
bun run dev

# Terminal 2 - Backend
bun run server
```

7. Open your browser and navigate to `http://localhost:3000`

## 🎯 How to Play

1. **Connect Wallet**: Connect your MetaMask wallet to Monad Testnet
2. **Start Game**: Click "Start Game" to begin the typing challenge
3. **Type Words**: Type the complete words shown on falling enemies
4. **Destroy Enemies**: Complete words to destroy enemies and earn points
5. **Complete Levels**: Clear all enemies to complete the level
6. **Claim Rewards**: Claim your MNTYPE tokens after each level completion
7. **Progress**: Advance through increasingly difficult levels

## 🔧 Configuration

### Environment Variables

```bash
# Monad Network Configuration
MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_MAINNET_RPC_URL=https://rpc.monad.xyz

# Private key for deployment (NEVER commit real private keys)
PRIVATE_KEY=your_private_key_here

# Contract addresses (filled after deployment)
TOKEN_ADDRESS=0x...
REWARDS_ADDRESS=0x...

# Backend configuration
BACKEND_PORT=3001
```

### Smart Contract Deployment

#### Local Testing

```bash
bun run deploy:local
```

#### Monad Testnet

```bash
bun run deploy:testnet
```

#### Mainnet (when ready)

```bash
# Update hardhat.config.ts for mainnet configuration
bun run deploy:mainnet
```

## 📁 Project Structure

```
mon-hack/
├── contracts/                 # Solidity smart contracts
│   ├── MonadTypeToken.sol    # ERC-20 token contract
│   └── MonadTypeRewards.sol  # Rewards management contract
├── ignition/                  # Hardhat Ignition deployment modules
│   └── modules/
│       └── MonadTypeDeploy.ts
├── src/                      # React frontend
│   ├── components/           # React components
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── server/                   # Express backend API
│   └── index.ts             # API server
├── hardhat.config.ts        # Hardhat configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Project dependencies
```

## 🎮 Game Mechanics

### Scoring System

- **Base Points**: 10 points per character typed
- **Level Multiplier**: Points multiplied by current level
- **Bonus Points**: Longer words give more points

### Level Progression

- **Level 1**: 5 enemies, slow speed, 3-letter words
- **Level 2-5**: Progressive difficulty increase
- **Level 6+**: Maximum difficulty with complex words

### Lives System

- **Starting Lives**: 3 lives
- **Life Loss**: Enemy reaches bottom of screen
- **Game Over**: All lives lost

### Token Rewards

- **Level 1**: 10 MNTYPE
- **Level 2**: 20 MNTYPE
- **Level 3**: 30 MNTYPE
- **Level 4**: 50 MNTYPE
- **Level 5**: 100 MNTYPE

## 🛠️ Development

### Running Tests

```bash
# Smart contract tests
bun run hardhat test

# Frontend tests (if added)
bun test
```

### Building for Production

```bash
bun run build
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

## 🔐 Security Considerations

- **Rate Limiting**: Backend implements rate limiting to prevent abuse
- **Input Validation**: All API inputs are validated
- **Double Claim Prevention**: Smart contracts prevent claiming the same level twice
- **Private Key Security**: Never commit private keys to version control

## 🌐 Network Details

### Monad Testnet

- **Chain ID**: 41454 (0xA1BE)
- **RPC URL**: https://testnet-rpc.monad.xyz
- **Explorer**: https://explorer.testnet.monad.xyz
- **Native Token**: MON

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**MetaMask Network Error**

- Ensure you're connected to Monad Testnet
- Add the network manually if it doesn't auto-switch

**Contract Deployment Fails**

- Check your private key has sufficient testnet tokens
- Verify RPC URL is correct

**Backend API Errors**

- Ensure all environment variables are set
- Check contract addresses are correct

**Game Performance Issues**

- Ensure your browser supports HTML5 Canvas
- Try refreshing the page if game becomes unresponsive

### Getting Help

- Check the [Monad Documentation](https://docs.monad.xyz)
- Join the Monad Discord community
- Open an issue in this repository

---

**Built with ❤️ for the Monad ecosystem**
