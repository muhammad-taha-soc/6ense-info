// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.NEXT_PUBLIC_SERVER_URL": JSON.stringify(
        env.NEXT_PUBLIC_SERVER_URL
      ),
      "process.env.NEXT_PUBLIC_WALLETCONNECT_APPID": JSON.stringify(
        env.NEXT_PUBLIC_WALLETCONNECT_APPID
      ),
      "process.env.NEXT_PUBLIC_PARTNER_ID": JSON.stringify(
        env.NEXT_PUBLIC_PARTNER_ID
      ),
      "process.env.NEXT_PUBLIC_PKEY": JSON.stringify(env.NEXT_PUBLIC_PKEY),
      "process.env.NEXT_PUBLIC_WALLET_ADDRESS": JSON.stringify(
        env.NEXT_PUBLIC_WALLET_ADDRESS
      ),
      "process.env.NEXT_PUBLIC_CONTRACT_ADDRESS": JSON.stringify(
        env.NEXT_PUBLIC_CONTRACT_ADDRESS
      ),
    },
    plugins: [react()],
  };
});
