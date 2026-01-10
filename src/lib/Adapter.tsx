import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit'
import { createSiweMessage } from 'viem/siwe'
// You can also install siwe and use:
// import { SiweMessage } from 'siwe'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const nonceResponse = await axios.get(`/siwe/nonce`)
    return nonceResponse.data.nonce
  },

  createMessage: ({ nonce, address, chainId }) => {
    return createSiweMessage({
      domain: 'localhost:5000',
      address,
      statement: 'Sign in with Ethereum to the application.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce,
      issuedAt: new Date(),
    }) // then add .prepareMessage() if using siwe package
  },

  verify: async ({ message, signature }) => {
    const verifyResponse = await axios.post(
      '/siwe/verify',
      { message, signature },
      { headers: { 'Content-Type': 'application/json' } },
    )
    if (!verifyResponse.data) {
      throw new Error('Failed to verify signature')
    }
    console.log('Verification response:', verifyResponse.data)

    return true
  },

  signOut: async () => {
    await axios.get('/siwe/logout')
  },
})
