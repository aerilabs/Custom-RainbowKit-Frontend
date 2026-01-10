# Custom RainbowKit Frontend

A **Web3 authentication frontend** built with TanStack Start, React, and RainbowKit. This application connects to a custom SIWE (Sign-In With Ethereum) backend for secure wallet-based authentication.

## 🔗 Backend Repository

This frontend connects to: [custom-rainbowkit-backend](https://github.com/aerilabs/custom-rainbowkit-backend.git)

## 🏗️ Architecture Overview

```
Frontend (TanStack Start + React)
    ↓
RainbowKit ConnectButton
    ↓
Authentication Adapter (src/lib/Adapter.tsx)
    ↓ HTTP Requests (axios)
Backend (Express.js on localhost:5000)
    ↓
SIWE (Sign-In With Ethereum) endpoints
```

## 🔐 Authentication Flow

### 1. **User Clicks ConnectButton**
- RainbowKit connects the user's wallet (MetaMask, Reown, etc.)

### 2. **Get Nonce** (`GET /siwe/nonce`)
- Frontend requests a unique nonce from the backend
- Backend generates and returns a nonce (prevents replay attacks)

### 3. **Create Message** (Client-side)
- Creates a standardized SIWE message with user's address, nonce, and chain ID
- This message will be signed by the user's wallet

### 4. **User Signs Message**
- User approves the signature request in their wallet
- Wallet signs the message with their private key

### 5. **Verify Signature** (`POST /siwe/verify`)
- Frontend sends the signed message to backend
- Backend cryptographically verifies the signature matches the address
- If valid, backend creates a session (using cookies)

### 6. **Sign Out** (`GET /siwe/logout`)
- When user disconnects, frontend notifies backend
- Backend destroys the session

## 🎯 Key Features

- ✅ **Cryptographically secure** - Uses wallet signatures
- ✅ **No passwords** - User's wallet is their identity
- ✅ **Session management** - Backend tracks authenticated users
- ✅ **Web3-native** - Standard SIWE protocol (EIP-4361)
- ✅ **Beautiful UI** - RainbowKit's polished wallet connection interface

## 📋 Prerequisites

Before running this application, you need:

1. **Reown Project ID**: Get one from [Reown](https://dashboard.reown.com/)
2. **Backend Server**: Clone and run the [backend repository](https://github.com/aerilabs/custom-rainbowkit-backend.git)

## ⚙️ Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

**Important**: In Vite/TanStack Start, environment variables must be prefixed with `VITE_` to be accessible on the client side.

## 🚀 Running the Application

### 1. Start the Backend (Required)

```bash
git clone https://github.com/aerilabs/custom-rainbowkit-backend.git
cd custom-rainbowkit-backend
pnpm install
pnpm dev  # Runs on localhost:5000
```

### 2. Start the Frontend

```bash
# In this project directory

```bash
pnpm install
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── components/
│   └── Header.tsx           # Navigation header with sidebar
├── lib/
│   ├── Adapter.tsx          # SIWE authentication adapter
│   └── Providers.tsx        # Wagmi, QueryClient, RainbowKit providers
├── routes/
│   ├── __root.tsx           # Root layout with providers
│   └── index.tsx            # Home page with ConnectButton
└── styles.css               # Global styles
```

### Key Files

- **`src/lib/Adapter.tsx`**: Implements the SIWE authentication flow
  - Connects to backend endpoints (`/siwe/nonce`, `/siwe/verify`, `/siwe/logout`)
  - Configured with `axios` base URL: `http://localhost:5000`
  - Enables credentials for session cookie management

- **`src/lib/Providers.tsx`**: Sets up Web3 providers
  - `WagmiProvider`: Ethereum connection management
  - `QueryClientProvider`: TanStack Query for data fetching
  - `RainbowKitProvider`: Wallet connection UI

- **`src/routes/__root.tsx`**: Root layout
  - Wraps entire app with providers
  - Includes Header component and Outlet for child routes

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
pnpm lint
pnpm format
pnpm check
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people',
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json() as Promise<{
      results: {
        name: string
      }[]
    }>
  },
  component: () => {
    const data = peopleRoute.useLoaderData()
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    )
  },
})
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ...

const queryClient = new QueryClient()

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
})
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from '@tanstack/react-query'

import './App.css'

function App() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      fetch('https://swapi.dev/api/people')
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  })

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

function App() {
  const count = useStore(countStore)
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  )
}

export default App
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store, Derived } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
doubledStore.mount()

function App() {
  const count = useStore(countStore)
  const doubledCount = useStore(doubledStore)

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  )
}

export default App
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

## 🔧 Configuration Details

### Wagmi Configuration

The Wagmi config in `src/lib/Providers.tsx` includes:

- **Chains**: Mainnet, Sepolia, Polygon, Optimism, Arbitrum, Base
- **SSR**: Enabled for server-side rendering support
- **Reown Project ID**: Required for Reown

### Axios Configuration

The authentication adapter uses axios with:

```typescript
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true
```

- **Base URL**: Points to the backend server
- **Credentials**: Enables cookie-based session management

## 🐛 Troubleshooting

### "Project ID is not defined" Error

Make sure you have set `VITE_WALLET_CONNECT_PROJECT_ID` in your `.env.local` file.

### "WagmiProviderNotFoundError"

This occurs if the `WagmiProvider` is not wrapping your components. This has been resolved by wrapping the app in `src/routes/__root.tsx`.

### Backend Connection Issues

- Ensure the backend is running on `localhost:5000`
- Check that `withCredentials: true` is set in axios config
- Verify CORS is properly configured on the backend

## 📚 Learn More

- [TanStack Documentation](https://tanstack.com/start/latest/docs/framework/react/overview)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Wagmi Documentation](https://wagmi.sh/)
- [SIWE Specification (EIP-4361)](https://eips.ethereum.org/EIPS/eip-4361)
- [Reown](https://dashboard.reown.com/)
