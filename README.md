# Mininig Frenzy

A Web3-enhanced 2D mining game built with Phaser and React — powered by the **Honeycomb Protocol** on Solana for streamlined on-chain gameplay.

---

## 🚀 Overview

Diamond Miner combines classic mining mechanics with blockchain interaction. Unearth treasures and record your progress using **Honeycomb Protocol**, which provides:

-   Streamlined Web3 integration
-   Efficient on-chain state compression
-   Rich game-focused APIs for Solana-based games

---

## ✨ Core Features

-   **Game & UI**: Phaser 3 game engine embedded in a React app.
-   **Honeycomb Integration**:
    -   Resource tracking (e.g., mined diamonds)
    -   Character & asset management
    -   Mission systems and on-chain rewards
-   **Optimized Web3**: Honeycomb’s compression architecture drastically reduces on-chain storage costs.
-   **Modular Design**: Easy to expand with leaderboards, NFTs, crafting systems, and more.

---

## 🛠 Tech Stack

-   **Frontend**: React
-   **Game Engine**: Phaser 3
-   **Blockchain Layer**: Solana via Honeycomb Protocol SDK
-   **Build Tools**: Vite & TypeScript
-   **Styling**: CSS Modules
-   **Honeycomb Modules**: Edge Toolkit, Resource Manager, Missions, Character Manager

---

## 📂 Project Structure

src/
├── main.tsx # React entry point
├── PhaserGame.tsx # Phaser embedded in React
├── honeycomb/
│ ├── edge.ts # Edge Toolkit initialization
│ ├── resources.ts # Resource Manager integration
│ ├── missions.ts # Mission system logic
│ └── characters.ts # Character Manager logic
├── game/ # Phaser scenes and game logic
└── EventBus.ts # React ↔ Phaser communication bridge

public/assets/ # Static game assets (images, audio, etc.)

yaml
Copy
Edit

---

## 🖥 Getting Started

1. **Clone the repo & install dependencies:**
    ```bash
    git clone https://github.com/your-username/diamond-miner.git
    cd diamond-miner
    npm install
    Configure Honeycomb Protocol
    Obtain your Honeycomb API key and set environment variables in a .env file:
    ```

env
Copy
Edit
HONEYCOMB_API_KEY=your_api_key_here
HONEYCOMB_NETWORK=devnet
Run in development mode:

bash
Copy
Edit
npm run dev
Build for production:

bash
Copy
Edit
npm run build
🐝 Honeycomb Protocol Highlights
Edge Toolkit: Simplifies Solana smart contract interactions.

Resource Manager: Handles in-game asset creation, mining, crafting.

Character Manager: Mint or manage characters, NFTs, and player profiles.

Missions & Staking: Create missions, reward players, and build engagement with on-chain tracking.

Compression Layer: Efficient on-chain data storage, reducing costs and improving performance.

📚 Docs: https://docs.honeycombprotocol.com

🔮 Future Roadmap
⛏️ Procedural Mine Generation – Endless mine maps

🏆 On-Chain Leaderboards – Transparent score tracking

💎 NFT Rewards – Mint diamonds or tools as NFTs

🤝 Multiplayer – Shared mines and PvP mining

🎯 Expanded Missions – Complex goals with rewards
