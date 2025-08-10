import { useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import {
    contract_address,
    tokenAddress,
    Daimond_Miner_ABI,
} from "./web3Manager/web3Manager";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi";
import { EventBus } from "./game/EventBus";
import { erc20Abi, parseEther, parseUnits } from "viem";

function App() {
    const { address } = useAccount();
    console.log(address);

    const {
        data: hash,
        isPending,
        error,
        isSuccess,
        writeContract,
    } = useWriteContract();

    const {
        data: receipt,
        isPending: isComfirming,
        isSuccess: isComfirmed,
    } = useWaitForTransactionReceipt({ hash });

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [hasEmmited, setHasEmmited] = useState(false);
    const [claimEmmited, setClaimEmmited] = useState(false);
    const [lobbyId, setLobbyId] = useState("");
    EventBus.on("enterGame", (id: string) => {
        console.log("enter");
        setLobbyId(id);
        setHasEmmited(true);
    });
    EventBus.on("claim", (id: string) => {
        console.log("claim");
        setClaimEmmited(true);
    });
    function joinGame(id: string) {
        writeContract({
            abi: erc20Abi,
            address: tokenAddress,
            functionName: "approve",
            args: [contract_address, parseEther("21")],
        });
        writeContract({
            abi: Daimond_Miner_ABI,
            address: contract_address,
            functionName: "CreateLobby",
            args: [id, parseEther("20"), parseUnits("2", 1)],
        });
    }
    function claim_Reward(id: string) {
        writeContract({
            abi: Daimond_Miner_ABI,
            address: contract_address,
            functionName: "ClaimLobbyReward",
            args: [id, parseEther("20")],
        });
    }

    useEffect(() => {
        if (hasEmmited) {
            console.log("ive emmted");
            joinGame(lobbyId);
            EventBus.removeListener("enterGame");
            setHasEmmited(false);
        }
    }, [hasEmmited]);
    useEffect(() => {
        if (claimEmmited) {
            console.log("ive emmted claim");
            claim_Reward(lobbyId);
        }
    }, [claimEmmited]);

    useEffect(() => {
        if (isComfirmed) {
            console.log(receipt);
            EventBus.emit("lobbyComfirmed");
        }
    }, [isComfirmed]);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div></div>
        </div>
    );
}

export default App;

