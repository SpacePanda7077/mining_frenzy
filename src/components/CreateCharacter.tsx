import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import {
    CreateCreateCharacterModelTransactionDocument,
    MintAsKind,
    ResourceStorageEnum,
    RewardKind,
} from "@honeycomb-protocol/edge-client";
import {
    client,
    admin,
    projectAddress,
    setAssemblerConfigAddress,
    AssemblerConfigAddress,
    setModelAddress,
    modelAddress,
    setTreeAddress,
    setMissionPoolAddress,
    setResourceAddress,
    resourceAddress,
    missionPoolAddress,
    setMissionAddress,
} from "../web3Manager/web3Manager";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { EventBus } from "../game/EventBus";

function CreateSetup() {
    const wallet = useWallet();
    async function createCharacterConfig() {
        const config = await client.createCreateAssemblerConfigTransaction({
            project: projectAddress.toString(),
            authority: wallet.publicKey?.toBase58().toString() as string,

            treeConfig: {
                // This tree is used to store character traits and their necessary information
                // Provide either the basic or advanced configuration, we recommend using the basic configuration if you don't know the exact values of maxDepth, maxBufferSize, and canopyDepth (the basic configuration will automatically configure these values for you)
                basic: {
                    numAssets: 100000, // The desired number of character information this tree will be able to store
                },
                // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
                // advanced: {
                //   maxDepth: 20, // Max depth of the tree
                //   maxBufferSize: 64, // Max buffer size of the tree
                //   canopyDepth: 14, // Canopy depth of the tree
                // },
            },
            ticker: "unique-string-id", // Provide a unique ticker for the config (the ticker ID only needs to be unique within the project)
            order: ["Skin"], // Optional, provide the character traits here; the order matters, in the example order, the background image will be applied and then the skin, expression, clothes, armor, weapon, and shield (if you need your character's expression to appear over the skin, the skin needs to come first in the order)
        });

        const tx = await sendClientTransactions(
            client,
            wallet,
            config.createCreateAssemblerConfigTransaction.tx
        );
        console.log(tx);
        setAssemblerConfigAddress(
            config.createCreateAssemblerConfigTransaction.assemblerConfig
        );

        // const projectAddress = "FQT5fSdRqGpyoPShMUhSuQkDUaCYKqPQQHgk8do1dCae"
    }
    async function addTraits() {
        const trait = await client.createAddCharacterTraitsTransactions({
            traits: [
                // Example traits given below, the labels have to match what you've declared in the assembler config
                {
                    name: "common_john",
                    uri: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeifkha56e4udq4m7n3l2hybz4ubfrkmlrpi7mgxas2ppmpmy52gqqa/common_john.png",
                    layer: "Skin",
                },
                {
                    name: "rare_john",
                    uri: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeifkha56e4udq4m7n3l2hybz4ubfrkmlrpi7mgxas2ppmpmy52gqqa/rare_john.png",
                    layer: "Skin",
                },
                {
                    name: "epic_john",
                    uri: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeifkha56e4udq4m7n3l2hybz4ubfrkmlrpi7mgxas2ppmpmy52gqqa/epic_john.png",
                    layer: "Skin",
                },
                {
                    name: "legendary_john",
                    uri: "https://plum-total-louse-876.mypinata.cloud/ipfs/bafybeifkha56e4udq4m7n3l2hybz4ubfrkmlrpi7mgxas2ppmpmy52gqqa/legendary_john.png",
                    layer: "Skin",
                },
            ],
            assemblerConfig: AssemblerConfigAddress.toString(),
            authority: admin.toString(),
        });

        const tx = await sendClientTransactions(
            client,
            wallet,
            trait.createAddCharacterTraitsTransactions
        );
    }
    async function createCharModel() {
        const model = await client.createCreateCharacterModelTransaction({
            project: projectAddress.toString(),
            authority: admin.toString(),
            mintAs: {
                // Optional, you can define the underlying protocol, default is MplCore
                kind: MintAsKind.MplCore,
                // Uncomment the following config if you are using MplBubblegum as the underlying protocol in kind
                // mplBubblegum: {
                //   maxDepth: 3,
                //   maxBufferSize: 8,
                // }
            },
            config: {
                kind: "Assembled",
                assemblerConfigInput: {
                    assemblerConfig: AssemblerConfigAddress.toString(),
                    collectionName: "Assembled NFT Collection",
                    name: "Assembled Character NFT 0",
                    symbol: "ACNFT",
                    description: "Creating this NFT with assembler",
                    sellerFeeBasisPoints: 0,
                    creators: [
                        {
                            address: admin.toString(),
                            share: 100,
                        },
                    ],
                },
            },
        });

        const tx = await sendClientTransactions(
            client,
            wallet,
            model.createCreateCharacterModelTransaction.tx
        );
        console.log(model.createCreateCharacterModelTransaction.characterModel);
        setModelAddress(
            model.createCreateCharacterModelTransaction.characterModel
        );
    }

    async function createCharcterTree() {
        console.log(modelAddress);
        const tree = await client.createCreateCharactersTreeTransaction({
            authority: admin.toString(),
            project: projectAddress.toString(),
            characterModel: modelAddress.toString(),

            treeConfig: {
                // Tree configuration, this affects how many characters this tree can store
                basic: {
                    numAssets: 100000,
                },
                // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
                // advanced: {
                //   maxDepth: 3,
                //   maxBufferSize: 8,
                //   canopyDepth: 3,
                // },
            },
        });

        const tx = await sendClientTransactions(
            client,
            wallet,
            tree.createCreateCharactersTreeTransaction.tx
        );
        setTreeAddress(tree.createCreateCharactersTreeTransaction.treeAddress);
    }
    async function createMissionPool() {
        const {
            createCreateMissionPoolTransaction: {
                missionPoolAddress, // The address of the mission pool
                tx, // The transaction response, you'll need to sign and send this transaction
            },
        } = await client.createCreateMissionPoolTransaction({
            data: {
                name: "Test Mission Pool",
                project: projectAddress.toString(),
                payer: wallet.publicKey?.toBase58().toString() as string,
                authority: admin.toString(),
                characterModel: modelAddress.toString(),
            },
        });

        const txs = await sendClientTransactions(client, wallet, tx);
        setMissionPoolAddress(missionPoolAddress);
    }
    async function mintCharacter() {
        console.log(modelAddress);
        const c = await client.createAssembleCharacterTransaction({
            project: projectAddress.toString(), // Project public key as a string
            assemblerConfig: AssemblerConfigAddress.toString(), // Assembler config address as a string
            characterModel: modelAddress.toString(), // Character model public key as a string

            attributes: [["Skin", "common_john"]],
            owner: wallet.publicKey?.toBase58().toString() as string,
            authority: admin,
        });

        const tx = await sendClientTransactions(
            client,
            wallet,
            c.createAssembleCharacterTransaction
        );
        console.log(modelAddress);
        EventBus.emit("Menu");
    }

    async function createMission() {
        const {
            createCreateMissionTransaction: {
                missionAddress, // The address of the mission
                tx, // The transaction response, you'll need to sign and send this transaction
            },
        } = await client.createCreateMissionTransaction({
            data: {
                authority: admin,
                cost: {
                    address: resourceAddress,
                    amount: "100",
                },
                duration: "180",
                minXp: "0",
                missionPool: missionPoolAddress,
                name: "easy cave",
                payer: wallet.publicKey?.toBase58().toString() as string,
                project: projectAddress,
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
            },
        });
        const txs = sendClientTransactions(client, wallet, tx);
        setMissionAddress(missionAddress);
    }

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: "30%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <button onClick={createCharacterConfig}>
                    CreateCharacterConfig
                </button>
                <button onClick={addTraits}>add character traits</button>
                <button onClick={createCharModel}>
                    create character model
                </button>
                <button onClick={createCharcterTree}>
                    create character Tree
                </button>

                <button
                    onClick={() => {
                        createResource(wallet);
                    }}
                >
                    create resource
                </button>
                <button
                    onClick={() => {
                        createResourceTree(wallet);
                    }}
                >
                    create resource tree
                </button>
                <button
                    onClick={() => {
                        mintResource(wallet);
                    }}
                >
                    mint resource
                </button>
                <button onClick={createMissionPool}>create Mission pool</button>
                <button onClick={createMission}>create Mission</button>
                <button onClick={mintCharacter}>mint character</button>
            </div>
        </>
    );
}
export default CreateSetup;

async function createResource(wallet: WalletContextState) {
    const {
        createCreateNewResourceTransaction: {
            resource: resourceAddress, // This is the resource address once it'll be created
            tx: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        },
    } = await client.createCreateNewResourceTransaction({
        project: projectAddress,
        authority: admin.toString(),
        params: {
            name: "Gold", // Name of the resource
            decimals: 6, // Number of decimal places the resource can be divided into
            symbol: "GOLD", // Symbol of the resource
            uri: "https://example.com", // URI of the resource
            storage: ResourceStorageEnum.AccountState, // Type of the resource, can be either AccountState (uncompressed/unwrapped) or LedgerState (compressed/wrapped)
            tags: ["Sword"], // Optional, tags for the resource; tags act as metadata to help you keep track of game stats
        },
    });

    const tx = await sendClientTransactions(client, wallet, txResponse);

    setResourceAddress(resourceAddress);
}
async function createResourceTree(wallet: WalletContextState) {
    const {
        createCreateNewResourceTreeTransaction: {
            treeAddress: merkleTreeAddress, // This is the merkle tree address once it'll be created
            tx: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        },
    } = await client.createCreateNewResourceTreeTransaction({
        project: projectAddress.toString(),
        authority: admin.toString(),
        resource: resourceAddress.toString(),
        treeConfig: {
            // Provide either the basic or advanced configuration, we recommend using the basic configuration if you don't know the exact values of maxDepth, maxBufferSize, and canopyDepth (the basic configuration will automatically configure these values for you)
            basic: {
                numAssets: 100000, // The desired number of resources this tree will be able to store
            },
            // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
            // advanced: {
            //   maxDepth: 20,
            //   maxBufferSize: 64,
            //   canopyDepth: 14,
            // }
        },
    });

    const tx = await sendClientTransactions(client, wallet, txResponse);
}

async function mintResource(wallet: WalletContextState) {
    const {
        createMintResourceTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
    } = await client.createMintResourceTransaction({
        resource: resourceAddress.toString(), // Resource public key as a string
        amount: "50000", // Amount of the resource to mint
        authority: admin.toString(), // Project authority's public key
        owner: wallet.publicKey?.toBase58().toString() as string, // The owner's public key, this wallet will receive the resource
    });

    const tx = await sendClientTransactions(client, wallet, txResponse);
}

