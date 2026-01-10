import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { authenticationAdapter } from './Adapter'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

interface ProviderProps {
  children: React.ReactNode
}

const projectID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
if (!projectID) throw new Error('Project ID is not defined!')

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: projectID, // ensures that the environment variable is always available
  chains: [mainnet, sepolia, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

const Providers = ({ children }: ProviderProps) => {
  const [authStatus, setAuthStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading')

  useEffect(() => {
    axios
      .get('/siwe/me')
      .then(() => setAuthStatus('authenticated'))
      .catch(() => setAuthStatus('unauthenticated'))
  }, [])
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={authStatus}
        >
          <RainbowKitProvider initialChain={1} modalSize="compact">
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
