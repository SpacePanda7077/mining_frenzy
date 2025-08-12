import { useEffect } from "react";
import {
    contract_address,
    tokenAddress,
    Daimond_Miner_ABI,
} from "../web3Manager/web3Manager";
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract,
} from "wagmi";
interface TokenProp {
    onTokenChange: (address: string) => void;
}

function GetTokenAddress({ onTokenChange }: TokenProp) {
    const {
        data: hash,
        isPending,
        error,
        isSuccess,
    } = useReadContract({
        abi: Daimond_Miner_ABI,
        address: contract_address,
        functionName: "token",
    });

    useEffect(() => {
        if (isSuccess) {
            onTokenChange(hash as string);
        }
    }, [isSuccess]);
    return <></>;
}
export default GetTokenAddress;

