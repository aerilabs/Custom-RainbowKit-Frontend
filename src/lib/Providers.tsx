import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

interface ProviderProps {
  children: React.ReactNode
}

const projectID = process.env.WALLET_CONNECT_PROJECT_ID
if (!projectID) throw new Error('Project ID is not defined!')

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: projectID, // ensures that the environment variable is always available
  chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

const Providers = ({ children }: ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
