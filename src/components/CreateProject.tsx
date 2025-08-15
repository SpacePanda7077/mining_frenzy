import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { client, setProjectAddress } from "../web3Manager/web3Manager";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    admin,
    setMerkleTree,
    projectAddress,
} from "../web3Manager/web3Manager";
import { EventBus } from "../game/EventBus";

function CreateProject() {
    const wallet = useWallet();
    async function createProject() {
        const {
            createCreateProjectTransaction: {
                project: projectAddress, // This is the project address once it'll be created
                tx: txResponse, // This is the transaction response, you'll need to sign and send this transaction
            },
        } = await client.createCreateProjectTransaction({
            name: "Test Project", // Name of the project
            authority: wallet.publicKey?.toBase58().toString() as string, // Public key of the project authority, this authority has complete control over the project
            profileDataConfig: {
                achievements: [
                    // Specify an array of achievements that you want to be able to set on your users' profiles
                    "Pioneer",
                ],
                customDataFields: [
                    // Specify an array of custom data fields that you want to be able to set on your users' profiles
                    "NFTs owned",
                ],
            },
        });

        const tx = await sendClientTransactions(client, wallet, txResponse);
        console.log(tx);
        console.log(projectAddress);
        setProjectAddress(projectAddress);
        // const projectAddress = "FQT5fSdRqGpyoPShMUhSuQkDUaCYKqPQQHgk8do1dCae"
    }
    async function createProfileTree() {
        const {
            createCreateProfilesTreeTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        } = await client.createCreateProfilesTreeTransaction({
            payer: admin.toString(),
            project: projectAddress.toString(),
            treeConfig: {
                // Provide either the basic or advanced configuration, we recommend using the basic configuration if you don't know the exact values of maxDepth, maxBufferSize, and canopyDepth (the basic configuration will automatically configure these values for you)
                basic: {
                    numAssets: 100000, // The desired number of profiles this tree will be able to store
                },
                // Uncomment the following config if you want to configure your own profile tree (also comment out the above config)
                // advanced: {
                //   maxDepth: 20,
                //   maxBufferSize: 64,
                //   canopyDepth: 14,
                // }
            },
        });
        const tx = await sendClientTransactions(client, wallet, txResponse.tx);
        console.log(tx);
        console.log(projectAddress);
        setMerkleTree(txResponse.treeAddress);
        // const projectAddress = "FQT5fSdRqGpyoPShMUhSuQkDUaCYKqPQQHgk8do1dCae"
    }
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    top: "10%",
                }}
            >
                <button onClick={createProject}>CreateProject</button>
                <button onClick={createProfileTree}>create profile tree</button>
            </div>
        </>
    );
}
export default CreateProject;

