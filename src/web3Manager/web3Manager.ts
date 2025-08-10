export const contract_address = "0x1705bB552E432D1fd1Cf18102c2e54D0CaF0344c";
export const tokenAddress = "0x743d45BB0926a1EaCD97a06d8e7e92BEe2f7632b";

export const Daimond_Miner_ABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "id",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "stakeAmount",
                type: "uint256",
            },
        ],
        name: "LobbyCreated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "id",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "point",
                type: "uint256",
            },
        ],
        name: "ClaimLobbyReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "id",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "_stakeAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "multiplier",
                type: "uint256",
            },
        ],
        name: "CreateLobby",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "reciever",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "getDiamondToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "getDiamondTokenQuote",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "getLeaderBoard",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPoints",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "players",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token",
        outputs: [
            {
                internalType: "contract IERC20",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

