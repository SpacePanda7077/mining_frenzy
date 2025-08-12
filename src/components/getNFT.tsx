import { useEffect, useState } from "react";
import {
    contract_address,
    tokenAddress,
    Daimond_Miner_ABI,
    nftAddress,
    nftABI,
} from "../web3Manager/web3Manager";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi";
import { readContract } from "viem/actions";
import { erc721Abi } from "viem";
import { EventBus } from "../game/EventBus";

interface TokenProp {
    onBalanceChange: (amount: number) => void;
}

function GetNftAmount({ onBalanceChange }: TokenProp) {
    const { address } = useAccount();
    const [hasEmmited, setHasEmmited] = useState(false);
    const [Uri, setUri] = useState("");

    function mintNft(uri: string) {}

    useEffect(() => {
        if (hasEmmited) {
            mintNft(Uri);
            EventBus.removeListener("mint");
            setHasEmmited(false);
        }
    }, [hasEmmited]);

    EventBus.once("mint", (uri: string) => {
        setUri(uri);
        setHasEmmited(true);
    });

    return <></>;
}
export default GetNftAmount;

