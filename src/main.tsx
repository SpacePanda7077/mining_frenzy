import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet, somniaTestnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";

const queryClient = new QueryClient();

const projectId = "5615cd38a4ea840da4a4c23b72a64d19";

const networks = [somniaTestnet];

const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
});

createAppKit({
    adapters: [wagmiAdapter],
    networks: [somniaTestnet],
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
    },
});

function AppKitProvider({ children }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
export default function ConnectButton() {
    return <appkit-button />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AppKitProvider>
            <ConnectButton></ConnectButton>
            <App />
        </AppKitProvider>
    </React.StrictMode>
);

