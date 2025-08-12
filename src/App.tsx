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
import GetTokenAddress from "./components/getToken";
import GetDMNToken from "./components/getDMNToken";
import "./App.css";
import GetNftAmount from "./components/getNFT";

function App() {
    const { address } = useAccount();
    console.log(address);

    const { writeContract: writeApprove, data: approvehash } =
        useWriteContract();
    const { writeContract: writeCreateLobby, data: createLobbyhash } =
        useWriteContract();
    const { writeContract: writeClaim, data: claimhash } = useWriteContract();

    const { data: approvereceipt, isSuccess: ApproveComfirmed } =
        useWaitForTransactionReceipt({ hash: approvehash });
    const { data: CreateLobbyreceipt, isSuccess: CreateLobbyComfirmed } =
        useWaitForTransactionReceipt({ hash: createLobbyhash });

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [hasEmmited, setHasEmmited] = useState(false);
    const [claimEmmited, setClaimEmmited] = useState(false);
    const [dmnToken, setDmnToken] = useState("");
    const [lobbyId, setLobbyId] = useState("");
    const [nftAmount, setNFTAmount] = useState(0);

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
        writeApprove({
            abi: erc20Abi,
            address: dmnToken as `0x${string}`,
            functionName: "approve",
            args: [contract_address, parseEther("21")],
        });
    }
    function claim_Reward(id: string) {
        writeClaim({
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
        if (ApproveComfirmed) {
            writeCreateLobby({
                abi: Daimond_Miner_ABI,
                address: contract_address,
                functionName: "CreateLobby",
                args: [lobbyId, parseEther("20"), parseUnits("2", 0)],
            });
        }
    }, [ApproveComfirmed]);
    useEffect(() => {
        if (CreateLobbyComfirmed) {
            EventBus.emit("lobbyComfirmed");
        }
    }, [CreateLobbyComfirmed]);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div className="getDMNBtn">
                <GetTokenAddress onTokenChange={setDmnToken}></GetTokenAddress>
                <GetDMNToken></GetDMNToken>
                <GetNftAmount onBalanceChange={setNFTAmount}></GetNftAmount>
            </div>
        </div>
    );
}

export default App;

