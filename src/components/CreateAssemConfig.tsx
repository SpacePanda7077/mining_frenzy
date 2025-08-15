import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import {
    client,
    admin,
    projectAddress,
    AssemblerConfigAddress,
    modelAddress,
} from "../web3Manager/web3Manager";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { MintAsKind } from "@honeycomb-protocol/edge-client";
import { EventBus } from "../game/EventBus";
import { Interface } from "ethers";

interface Character {
    onCharacter(uri: string): void;
}

function CreateAssemblerConfig({ onCharacter }: Character) {
    const wallet = useWallet();
    const merkleTreeaddress = "77yFJSvuKQrB4MNvGCtBdpgrDgXC9Ss8xznFMocPAb4Y";
    const assemblerConfig = AssemblerConfigAddress;
    const chracterModelAddress = modelAddress;
    const [notHaveCharacter, setNotHaveCharacter] = useState(true);
    const [activeCharacter, setActiveCharacter] = useState("");
    let activeC: any = "";

    async function FindCharacter() {
        const character = await client.findCharacters({
            includeProof: true,
            trees: ["2bHfqn1LuKTxiseZBhSMUHH8JFxj4vUikqtT846rs6bP"],
            wallets: [wallet.publicKey?.toBase58().toString() as string], // Array of character model merkle tree public keys as a string
        });
        let char;
        if (character.character.length > 0) {
            setNotHaveCharacter(false);
            const c: any = character.character[0];
            const uri = c.source.params.uri;
            const res = await fetch(uri);
            const data = await res.json();
            console.log(data.image);
            setActiveCharacter(data.image);
            onCharacter(data.image);
            char = data.image;
        }
        return char;
    }

    useEffect(() => {
        const get = async () => {
            var c = await FindCharacter();
            console.log(c);
            onCharacter(c);
        };
        get();
    }, [FindCharacter]);

    // EventBus.on("startGame", () => {
    //     console.log(activeC);
    //     if (activeC === "") return;
    //     EventBus.emit("start", activeC);
    // });

    async function createAssmbler() {
        const config = await client.createAssembleCharacterTransaction({
            project: projectAddress.toString(), // Project public key as a string
            assemblerConfig: assemblerConfig.toString(), // Assembler config address as a string
            characterModel: chracterModelAddress.toString(), // Character model public key as a string
            attributes: [
                // Define the character's attributes here in string tuple format
                ["Skin", "common_john"],
            ],
            owner: wallet.publicKey?.toBase58().toString() as string,
            authority: admin,
            //payer: wallet.publicKey?.toBase58().toString() as string,
        });
        const tx = await sendClientTransactions(
            client,
            wallet,
            config.createAssembleCharacterTransaction
        ).catch();
        console.log(tx);
        console.log(config);

        // const merkleTreeaddress = "77yFJSvuKQrB4MNvGCtBdpgrDgXC9Ss8xznFMocPAb4Y"
        // projectAddress = "FQT5fSdRqGpyoPShMUhSuQkDUaCYKqPQQHgk8do1dCae"
        // const assemblerConfig = "GLqDyheLmMKiiPEVWGsfL1KJeRxNoAyPJQfS1kCaajqB"
        // assemblerConfigTree = "99vC9oJbRXxf4Jtwxrtp8v2Kpqwab24EjWXZ3ar7mGQH"
        // const chracterModelAddress = "JCV6Gj7huzGFPFEkCHD64jxCikhWt2Vmv6YwUeou4Q3c"
        // modelTree = "2bHfqn1LuKTxiseZBhSMUHH8JFxj4vUikqtT846rs6bP"
    }
    return (
        <>
            <div>
                {notHaveCharacter && (
                    <button onClick={createAssmbler}>CreateCharater</button>
                )}
            </div>
        </>
    );
}

export default CreateAssemblerConfig;

