import { useEffect, useMemo, useRef, useState } from "react";
import { RewardKind } from "@honeycomb-protocol/edge-client";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import {
    projectAddress,
    missionPoolAddress,
    admin,
    resourceAddress,
} from "./web3Manager/web3Manager";
import {
    ConnectionProvider,
    WalletContextState,
    WalletProvider,
    useWallet,
} from "@solana/wallet-adapter-react";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { client } from "./web3Manager/web3Manager";

import CreateProject from "./components/CreateProject";
import CreateUser from "./components/CreateUser";
import CreateAssemblerConfig from "./components/CreateAssemConfig";
import CreateResources from "./components/Resources";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import Inventory from "./components/Inventory";
import { EventBus } from "./game/EventBus";
import CreateCharacter from "./components/CreateCharacter";
import CreateSetup from "./components/CreateCharacter";
import { walletActions } from "viem";

function App() {
    const wallet = useWallet();
    const network = "https://rpc.test.honeycombprotocol.com";
    const endpoint = useMemo(() => network, [network]);
    const [character, setCharater] = useState("");
    const [tool, setTool] = useState("");
    const [key, setKey] = useState("");
    const [hasEmmited, setHasEmmited] = useState(false);

    EventBus.on("startGame", async () => {
        setHasEmmited(true);
    });
    EventBus.on("setKey", (key: string) => {
        setKey(key);
    });
    useEffect(() => {
        const enterGame = async () => {
            if (hasEmmited) {
                await enterMission(wallet);
                EventBus.emit("start", character);
                setHasEmmited(false);
            }
        };

        enterGame();
    }, [hasEmmited]);

    const wallets = useMemo(
        () => [
            // Manually define specific/custom wallets here
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        {key === "Setup" && (
                            <>
                                <CreateProject />
                                <CreateUser />
                                <CreateSetup />
                            </>
                        )}

                        <div className="connectButton">
                            <WalletMultiButton />
                        </div>

                        <PhaserGame ref={phaserRef} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
}

export default App;

async function enterMission(wallet: WalletContextState) {
    const {
        createCreateMissionTransaction: {
            missionAddress, // The address of the mission
            tx, // The transaction response, you'll need to sign and send this transaction
        },
    } = await client.createCreateMissionTransaction({
        data: {
            name: "Test mission",
            project: projectAddress.toString(),
            cost: {
                address: resourceAddress,
                amount: "100",
            },
            duration: "86400", // 1 day
            minXp: "0", // Minimum XP required to participate in the mission
            rewards: [
                {
                    kind: RewardKind.Xp,
                    max: "100",
                    min: "100",
                },
                {
                    kind: RewardKind.Resource,
                    max: "500",
                    min: "250",
                    resource: resourceAddress.toString(),
                },
            ],
            missionPool: missionPoolAddress.toString(),
            authority: admin.toString(),
            payer: admin,
        },
    });
    const txs = sendClientTransactions(client, wallet, tx);
}

