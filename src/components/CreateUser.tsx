import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import {
    client,
    admin,
    projectAddress,
    merkleTreeAddress,
} from "../web3Manager/web3Manager";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

function CreateUser() {
    const wallet = useWallet();
    const [nothasProfile, setNotHasProfile] = useState(true);

    const merkleTreeaddress = merkleTreeAddress;

    const [inputValue, setInputValue] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        console.log("Input value:", inputValue);
        createUser();
        // Use inputValue as needed, e.g., for Solana transactions
    };

    async function FindProfile() {
        const profilesArray = await client
            .findProfiles({
                projects: [merkleTreeaddress], // String array of project addresses
            })
            .then(({ profile }) => {
                if (profile.length > 0) {
                    setNotHasProfile(false);
                }
            });
    }
    FindProfile();
    async function createUser() {
        const name = document.getElementById("inputName");
        const {
            createNewUserWithProfileTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
        } = await client.createNewUserWithProfileTransaction({
            project: projectAddress,
            wallet: wallet.publicKey?.toBase58().toString() as string,
            payer: wallet.publicKey?.toBase58().toString() as string,
            profileIdentity: "Main",
            userInfo: {
                name: inputValue,
                bio: "mining frenzy Player",
                pfp: "https://lh3.googleusercontent.com/-Jsm7S8BHy4nOzrw2f5AryUgp9Fym2buUOkkxgNplGCddTkiKBXPLRytTMXBXwGcHuRr06EvJStmkHj-9JeTfmHsnT0prHg5Mhg",
            },
        });
        const tx = await sendClientTransactions(client, wallet, txResponse);
        console.log(tx);
        console.log(txResponse);

        // const merkleTreeaddress = "77yFJSvuKQrB4MNvGCtBdpgrDgXC9Ss8xznFMocPAb4Y"
        // projectAddress = "FQT5fSdRqGpyoPShMUhSuQkDUaCYKqPQQHgk8do1dCae"
    }
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    top: "20%",
                }}
            >
                {nothasProfile && (
                    <>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            placeholder="your username"
                        />
                        <button onClick={handleSubmit}>CreateProfile</button>
                    </>
                )}
            </div>
        </>
    );
}
export default CreateUser;

