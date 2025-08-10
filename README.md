# 💎 Diamond Miner
### *A Web3-Powered Phaser + React Game on Somnia Testnet*

---

## 🎯 Overview
Diamond Miner is a **blockchain-enabled 2D game** where players explore mines, collect diamonds, and interact with **on-chain assets**.  
Built with **Phaser 3** for immersive gameplay and **React** for smooth UI, the game integrates **Web3 features** using the **Somnia Testnet** — enabling provable in-game ownership and blockchain-driven mechanics.

---

## 🚀 Key Features
- ⚡ **Modern Tech Stack** — Phaser 3.90.0 + React 19.0.0 + Vite 6.3.1 + TypeScript 5.7.2.
- 🔄 **Hot Reload Development** — Instant feedback during development.
- 🌐 **Web3 Integration** — Connect wallets, verify ownership, and record game events on **Somnia Testnet**.
- 🔌 **React ↔ Phaser Bridge** — EventBus system for UI-to-game communication.
- 📦 **Production Ready** — Optimized builds with `npm run build`.
- 🪶 **Lightweight Boilerplate** — Minimal setup; just start coding gameplay.

---

## 🕹️ Gameplay Flow
1. **Connect Wallet** — Players link their Somnia Testnet wallet to the game.
2. **Mine Diamonds** — Navigate the mine, avoid hazards, and collect gems.
3. **On-Chain Records** — Diamond scores, achievements, or in-game NFTs can be recorded on Somnia Testnet.
4. **Leaderboards & Rewards** — Players compete for top rankings and on-chain rewards.

---

## 🔗 Web3 & Somnia Testnet
- **Wallet Support** — Interacts with Somnia-compatible wallets.
- **Testnet Transactions** — Game actions can trigger blockchain events.
- **Ownership Proof** — Players can verify their in-game achievements via the blockchain.
- **Future NFT Integration** — Potential to mint collected diamonds or special items as NFTs.

---

## 🛠️ Tech Stack
- **Frontend Framework**: React
- **Game Engine**: Phaser 3
- **Blockchain**: Somnia Testnet
- **Bundler/Dev Server**: Vite
- **Language**: TypeScript
- **Styling**: CSS Modules

---

## 📂 Project Structure
src/
├─ main.tsx # React entry point
├─ PhaserGame.tsx # Initializes Phaser within React
├─ game/ # Game scenes and logic
├─ game/scenes/ # Individual Phaser scenes
└─ EventBus.ts # Event bridge between React & Phaser
public/assets/ # Game assets (images, audio, etc.)

yaml
Copy
Edit

---

## ⚡ Getting Started
```bash
# Clone the repo
git clone https://github.com/SpacePanda7077/Daimond_Miner.git
cd Daimond_Miner

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build
🎯 Future Roadmap
⛏️ Procedural Mine Generation — Infinite mining worlds.

🤝 Multiplayer — Real-time mining competitions.

🏆 Blockchain Leaderboards — On-chain player rankings.

🎵 Immersive Sound Design — Thematic music & SFX.

🎨 Polished Art Assets — Rich visuals to enhance the mining theme.

🪙 NFT Rewards — Mint diamonds as collectible NFTs.

📜 License
MIT License — free to use, modify, and share.

