import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId
// eslint-disable-next-line no-undef
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_APPID;

// 2. Set chains
const eth = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const bsc = {
  chainId: 56,
  name: "Binance Smart Chain",
  currency: "BNB",
  explorerUrl: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.binance.org/",
};

// 3. Create a metadata object
const metadata = {
  name: "6ense",
  description: "6ense",
  url: "https://6ense.info", // origin must match your domain & subdomain
  icons: [],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [eth, bsc],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function WalletComponent() {
  return (
    <>
      <w3m-button />
    </>
  );
}

export default WalletComponent;
