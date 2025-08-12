import { useEffect, useState } from "react";
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
import { readContract, writeContract } from "viem/actions";
import { erc20Abi, parseEther } from "viem";
import GetTokenAddress from "./getToken";
import "../App.css";

function GetDMNToken() {
    const [dmnTokenAddress, setDmnTokenAddress] = useState("");
    const {
        data: hash,
        isPending,
        isSuccess,
        writeContractAsync,
    } = useWriteContract();

    const {
        data: receipt,
        isPending: isComfirming,
        isSuccess: isComfirmed,
    } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isComfirmed) {
            console.log("comfirmed");
        }
    }, [isComfirmed]);

    function getToken() {
        writeContractAsync({
            abi: Daimond_Miner_ABI,
            address: contract_address,
            functionName: "getDiamondToken",
            args: [parseEther("0.1")],
            value: parseEther("0.1"),
        });
    }

    return (
        <>
            <GetTokenAddress
                onTokenChange={setDmnTokenAddress}
            ></GetTokenAddress>
            {dmnTokenAddress && (
                <div className="getDMNBtn">
                    <button onClick={getToken}>get Diamond Token</button>
                </div>
            )}
        </>
    );
}
export default GetDMNToken;

