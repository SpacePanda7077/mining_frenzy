import { useEffect, useMemo, useRef, useState } from "react";
import { RewardKind } from "@honeycomb-protocol/edge-client";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import {
    projectAddress,
    missionPoolAddress,
    admin,
    resourceAddress,
    missionAddress,
    modelAddress,
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
                //await enterMission();
                EventBus.emit("start", character);
                setHasEmmited(false);
            }
        };

        enterGame();
    }, [hasEmmited]);
    async function enterMission() {
        console.log(modelAddress);
        const {
            createSendCharactersOnMissionTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        } = await client.createSendCharactersOnMissionTransaction({
            data: {
                mission: missionAddress.toString(),
                characterAddresses: [modelAddress],
                authority: admin,
            },
        });
        const tx = await sendClientTransactions(client, wallet, txResponse);
        console.log(tx);
    }

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

