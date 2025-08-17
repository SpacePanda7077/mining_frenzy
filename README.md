# Mininig Frenzy

A Web3-enhanced 2D mining game built with Phaser and React — powered by the **Honeycomb Protocol** on Solana for streamlined on-chain gameplay.

---

## 🚀 Overview

Diamond Miner combines classic mining mechanics with blockchain interaction. Unearth treasures and record your progress using **Honeycomb Protocol**, which provides:

-   Streamlined Web3 integration
-   Efficient on-chain state compression
-   Rich game-focused APIs for Solana-based games

---

## Instructions

-   clone Repo
-   run "npm install" to install all dependencies
-   run "npm run dev" to run the game
-   go thourgh the setuo page
-   press play to enter the game

## How to play

-   press WASD to move and Dig
-   find valueable items while digging before the timer runs out(it uses mission for every cave you mine)
-   when this the mining is over you can mint found resources and use it to upgrade your character or tools for digging

## How it works 
- Character : honey comb protocol help by using character as the main player of the game,each character has it secial dungeon they can mine(common_character- common-dungeon ... etc)
- Resources : There are two types of resources in the game (Tools and consumables)
 - Tools: this are tool you use for for digging and they are of different rarities.
 - Consumables: these are resources that you get while mining such as coal, jade, gold, diamonds
- Reciepe : the reciepe is used for crafting new tools
- Mission: is used in game to enter a dungeon which last 3 mins and to replenish the characters oxygen (idle-reward)


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


