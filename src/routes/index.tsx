import { ConnectButton } from '@rainbow-me/rainbowkit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex items-center justify-center h-screen">
      <ConnectButton
        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
        chainStatus="full"
        showBalance={{ smallScreen: false, largeScreen: true }}
      />
    </main>
  )
}
