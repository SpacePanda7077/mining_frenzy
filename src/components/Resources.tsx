import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { useWallet } from "@solana/wallet-adapter-react";
import { client, admin } from "../web3Manager/web3Manager";
import { ResourceStorageEnum } from "@honeycomb-protocol/edge-client";
import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
    useEffect,
    useState,
} from "react";
import { EdgeClient } from "@honeycomb-protocol/edge-client/client/types";
import "../App.css";
import { recoverTypedDataAddress } from "viem";
import { EventBus } from "../game/EventBus";
import CreateAssemblerConfig from "./CreateAssemConfig";

function CreateResources() {
    const resources = [
        {
            name: "common_pickAxe",
            image: "E2p4AEb5AM65eocbNRypJRitX4tT93YJyKAwutmabmBg",
        },
        {
            name: "rare_pickAxe",
            image: "8xjkpHjsgwAUmt8Ujo3KGXNWHAjqkmrUntqpQDaK3VUL",
        },
        {
            name: "epic_pickAxe",
            image: "EJCgcP5Lgp452pSnSToZuPbeYfcMCtr3U5p9CGaFrh8P",
        },
        {
            name: "legendary_pickAxe",
            image: "7Egkzk19Fxm7dRnucySKu4NAfrjaKWswJJi66poHC78r",
        },
        {
            name: "coal",
            image: "9nvpr8QV1iK9UhM8MCZUHACGYsdZtQhjp33VSAGGS94m",
        },
        {
            name: "jade",
            image: "DfsNFtjLrnYeD53oVJe2tVqBCVS1uBt6GmzCNa8RwJ3W",
        },
        {
            name: "gold",
            image: "6TpdkNbRqYLeyavr3oi7N2Go7hoz28Fx9Gyo8hrMENfC",
        },
        {
            name: "daimond",
            image: "5NWc2ZvBbACWxtqaDPmvsZnfG1k2YrNGvfapLnH5fFcA",
        },
    ];
    const consumables = [
        {
            name: "coal",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/coal.png",
            address: "9nvpr8QV1iK9UhM8MCZUHACGYsdZtQhjp33VSAGGS94m",
            amount: "0",
        },
        {
            name: "jade",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/jade.png",
            address: "DfsNFtjLrnYeD53oVJe2tVqBCVS1uBt6GmzCNa8RwJ3W",
            amount: "0",
        },
        {
            name: "gold",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/gold.png",
            address: "6TpdkNbRqYLeyavr3oi7N2Go7hoz28Fx9Gyo8hrMENfC",
            amount: "0",
        },
        {
            name: "daimond",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/daimond.png",
            address: "5NWc2ZvBbACWxtqaDPmvsZnfG1k2YrNGvfapLnH5fFcA",
            amount: "0",
        },
    ];
    const tools = [
        {
            name: "common_pickAxe",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/common.png",
            address: "E2p4AEb5AM65eocbNRypJRitX4tT93YJyKAwutmabmBg",
            owned: "mint",
        },
        {
            name: "rare_pickAxe",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/rare.png",
            address: "8xjkpHjsgwAUmt8Ujo3KGXNWHAjqkmrUntqpQDaK3VUL",
            owned: "mint",
        },
        {
            name: "epic_pickAxe",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/epic.png",
            address: "EJCgcP5Lgp452pSnSToZuPbeYfcMCtr3U5p9CGaFrh8P",
            owned: "mint",
        },
        {
            name: "legendary_pickAxe",
            image: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeigiu7mpqowhy5l4vm6jglofv4rsf4aft4d5hyezkcxpo6vcwgofui/legendary.png",
            address: "7Egkzk19Fxm7dRnucySKu4NAfrjaKWswJJi66poHC78r",
            owned: "mint",
        },
    ];
    const [cons, setCons] = useState(consumables);
    const [gametools, setGameTools] = useState(tools);
    const [openShop, setOpenShop] = useState(false);
    const resourcesTrees = [
        {
            name: "common_pickAxe",
            image: "B7oyQHAxUw2N8oRRo2Lw9GyiMqXNo7dYAQ5w33ogDTH6",
        },
        {
            name: "rare_pickAxe",
            image: "4hdEpt6QYAYUpJ3DVuYK8kTEyhU1i81ySd93ZDa9G4g1",
        },
        {
            name: "epic_pickAxe",
            image: "2jWg1c8rZzBsGBH5o9rbPhfjTa74LHD7hm5Cfv9Ltxb1",
        },
        {
            name: "legendary_pickAxe",
            image: "AyUwyjjSjVoKS4zTNg27wXUSYYwPb62ZEp1Fd62j1pDq",
        },
        {
            name: "coal",
            image: "8qRbRNNGG1asKCKdyyRmdVdJzKskE4jJ3SEFqvvutFTh",
        },
        {
            name: "jade",
            image: "4GEnTXZ6AjoZLABRJYNsvHcM7ixnyN4gW7L3MNysFe8J",
        },
        {
            name: "gold",
            image: "3ndm4NnqHRjPgwhMaotbvdkFf4TtswscJDQSbHaHQsPX",
        },
        {
            name: "daimond",
            image: "BqNXotWmKFaeGDXHUqF1H33NtGRVkhourvHy9szqPHJ5",
        },
    ];
    const [dontHaveResource, setDontHaveResource] = useState(true);
    const [bal, setBal] = useState<any>(null);
    const wallet = useWallet();

    async function getConsBalance() {
        consumables.forEach(async (bal) => {
            const balance = await client.findResourcesBalance({
                addresses: [bal.address],
                wallets: [wallet.publicKey?.toBase58().toString() as string],
            });
            if (balance) {
                bal.amount = balance.resourcesBalance[0].amount;
                setCons(
                    cons.map((it) =>
                        it.name === bal.name
                            ? {
                                  ...it,
                                  amount: balance.resourcesBalance[0].amount,
                              }
                            : it
                    )
                );
            }
        });
    }
    async function getToolsBalance() {
        tools.forEach(async (bal) => {
            const balance = await client.findResourcesBalance({
                addresses: [bal.address],
                wallets: [wallet.publicKey?.toBase58().toString() as string],
            });
            if (balance) {
                if (bal.name === "common_pickAxe") {
                    if (Number(balance.resourcesBalance[0].amount) > 0) {
                        setDontHaveResource(false);
                    }
                }

                if (Number(balance.resourcesBalance[0].amount) > 0) {
                    setGameTools(
                        gametools.map((it) =>
                            it.name === bal.name
                                ? {
                                      ...it,
                                      owned: "owned",
                                  }
                                : it
                        )
                    );
                }
            }
        });
    }
    console.log(wallet.publicKey?.toBase58());
    EventBus.on("openshop", () => {
        setOpenShop(true);
    });

    useEffect(() => {
        if (wallet) {
            getConsBalance();
            getToolsBalance();
        }
    }, [wallet]);

    async function createResources() {
        const {
            createMintResourceTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        } = await client.createMintResourceTransaction({
            resource: resources[0].image.toString(), // Resource public key as a string
            amount: "1", // Amount of the resource to mint
            authority: admin, // Project authority's public key
            owner: wallet.publicKey?.toBase58().toString() as string, // The owner's public key, this wallet will receive the resource
        });

        const tx = await sendClientTransactions(client, wallet, txResponse);
        console.log(tx);
        console.log(txResponse);
    }
    return (
        <>
            <div className="consumable">
                <div className="consumables">
                    {cons.map((c) => (
                        <div
                            key={c.name}
                            style={{ display: "flex", gap: "10px" }}
                        >
                            <img src={c.image} alt="resource image" />
                            <p>{c.amount}</p>
                        </div>
                    ))}
                </div>
            </div>

            {openShop && (
                <div className="toolsCont">
                    <div style={{ display: "flex", gap: "50px" }}>
                        <p>Tools</p>
                        <p>Characters</p>
                    </div>

                    <button
                        onClick={() => {
                            setOpenShop(false);
                        }}
                        style={{ position: "absolute", left: "100%" }}
                    >
                        X
                    </button>
                    <div className="tools">
                        {gametools.map(
                            (c: {
                                name: Key | null | undefined;
                                image: string | undefined;
                                owned:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | ReactElement<
                                          unknown,
                                          string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | Promise<
                                          | string
                                          | number
                                          | bigint
                                          | boolean
                                          | ReactPortal
                                          | ReactElement<
                                                unknown,
                                                | string
                                                | JSXElementConstructor<any>
                                            >
                                          | Iterable<ReactNode>
                                          | null
                                          | undefined
                                      >
                                    | null
                                    | undefined;
                            }) => (
                                <div
                                    key={c.name}
                                    style={{
                                        width: "70%",
                                        borderRadius: "10px",
                                        backgroundColor:
                                            c.owned === "owned"
                                                ? "green"
                                                : "rgba(29, 27, 27, 0.603)",

                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}
                                >
                                    <img
                                        style={{ width: "20%", height: "50%" }}
                                        src={c.image}
                                        alt="resource image"
                                    />
                                    <p>{c.owned}</p>
                                </div>
                            )
                        )}
                    </div>
                    {dontHaveResource && (
                        <button
                            style={{
                                position: "inherit",
                                left: "50%",
                                top: "80%",
                                transform: "translate(-50%, -50%)",
                                height: "30px",
                            }}
                            onClick={createResources}
                        >
                            Create Resources
                        </button>
                    )}
                    <div
                        style={{
                            position: "inherit",
                            left: "50%",
                            top: "100%",
                            transform: "translate(-50%, -50%)",
                            height: "30px",
                        }}
                    ></div>
                </div>
            )}
        </>
    );
}
export default CreateResources;

