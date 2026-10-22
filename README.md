# Read DAC (RDAC) 🛡️🚀

<p align="center">
  <img src="/public/assets/rdac_logo.jpg" alt="Read DAC Logo" width="120" style="border-radius: 24px;" />
</p>

<p align="center">
  <strong>Fast, 100% Read-Only Portfolio Explorer for DAC Interstellar Mainnet (Chain ID: 21892)</strong><br />
  <em>An open-source, community-driven on-chain wallet explorer.</em>
</p>

<p align="center">
  <a href="https://github.com/Readdac/Read-Dac"><img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github" alt="GitHub Repo" /></a>
  <a href="https://x.com/rdacfun"><img src="https://img.shields.io/badge/Twitter-@rdacfun-000000?logo=x" alt="Twitter" /></a>
  <a href="https://dacscan.io"><img src="https://img.shields.io/badge/Network-DAC_Mainnet_(21892)-amber" alt="Network" /></a>
  <img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg" alt="License" />
</p>

---

## 🌟 About Read DAC

**Read DAC (RDAC)** is an **open-source community initiative** built specifically for the **DAC Interstellar Mainnet** ecosystem. RDAC allows any user to inspect wallet balances and badge holdings in real time with zero security risks:

- **100% Read-Only**: Completely non-custodial. No wallet connections, private keys, approvals, or signatures are ever requested.
- **Community-Built & Open Source**: An independent public good created for and by the DAC community (not an official DAC foundation application).
- **Direct Live EVM RPC**: Queries the blockchain directly through `https://rpc.dachain.tech` without centralized middleman backends.
- **Native Currency & Badges**: Real-time on-chain balance queries for native **DACC** and key collections: **DAC Interstellar Achievement (DIA)**, **Interstellar Weekly Badge (IWB)**, and **QBadges1 (QB1)**.
- **Deep Linking**: Direct URL routing by wallet address (`/{walletAddress}`).
- **Light & Dark Themes**: Modern interface with light mode enabled by default and a seamless dark mode switch.
- **1-Click MetaMask Setup**: Adds DAC Interstellar Mainnet parameters automatically to your Web3 wallet.

---

## 🔗 Project Links

- **GitHub Repository**: [https://github.com/Readdac/Read-Dac](https://github.com/Readdac/Read-Dac)
- **Project Twitter (X)**: [@rdacfun](https://x.com/rdacfun)

---

## 🌌 DAC Interstellar Mainnet Parameters

| Parameter | Value |
| :--- | :--- |
| **Network Name** | DAC Interstellar Mainnet |
| **Default RPC URL** | `https://rpc.dachain.tech` |
| **Chain ID** | `21892` (Hex: `0x5584`) |
| **Currency Symbol** | `DACC` |
| **Block Explorer** | [https://dacscan.io](https://dacscan.io) |
| **DAC Website** | [https://dachain.tech/](https://dachain.tech/) |

---

## 🏆 Tracked Collections

1. **DAC Interstellar Achievement (DIA)**
   - **Contract Address**: `0x1c0b6DFA5168968570094Da9c3551005b11B625B`
   - **Type**: ERC-721 Soulbound Achievement
   - **Explorer**: [DacScan Token View](https://dacscan.io/token/0x1c0b6DFA5168968570094Da9c3551005b11B625B)
   - **Artwork**: `/assets/dia.png`

2. **Interstellar Weekly Badge (IWB)**
   - **Contract Address**: `0xB49644e8d8CE036663562f4Fd8ac4054f90EE497`
   - **Type**: ERC-721 Weekly Badge
   - **Explorer**: [DacScan Token View](https://dacscan.io/token/0xB49644e8d8CE036663562f4Fd8ac4054f90EE497)
   - **Artwork**: `/assets/week.png`

3. **QBadges1 (QB1)**
   - **Contract Address**: `0xc1aaF210a1E4114c90D00716Aed03c861F3998f2`
   - **Type**: DRC-721 Quest Badge
   - **Explorer**: [DacScan Token View](https://dacscan.io/token/0xc1aaF210a1E4114c90D00716Aed03c861F3998f2)
   - **Artwork**: `/assets/qb1.png`

---

## ⚙️ How to Add More Contracts

All network settings and tracked collections are modularly configured in:

📁 `src/config/dacChain.ts`

To track an additional token or badge collection, append a new object to `TRACKED_CONTRACTS`:

```typescript
export const TRACKED_CONTRACTS: TrackedContract[] = [
  // ... existing tokens
  {
    id: 'my-new-badge',
    name: 'My New DAC Badge',
    symbol: 'MND',
    contractAddress: '0x...', // Contract address on DAC Mainnet
    standard: 'ERC-721',      // Or 'ERC-20'
    decimals: 18,             // (Optional, for ERC-20)
    explorerUrl: 'https://dacscan.io/token/0x...',
    image: '/assets/new_badge.png',
    category: 'Community Badges',
    badgeLabel: 'Special Badge',
    description: 'Description of the new badge or reward.',
  },
];
```

The application will immediately start querying and displaying the new collection's balances for all inspected addresses.

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Readdac/Read-Dac.git
   cd Read-Dac
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## 🌐 Deploying to Vercel

1. Push your code to the GitHub repository: `https://github.com/Readdac/Read-Dac`.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select the `Read-Dac` repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

> The included `vercel.json` provides automatic SPA route rewrite rules so direct URLs like `/0x8655Df35818F348EA4e371A613e73677d816f589` resolve directly without 404 errors.

---

## 🔒 Security & Disclaimer

- **Read-Only**: Read DAC never requests wallet connection, transaction signatures, or private keys.
- **Unofficial Community Project**: Read DAC is an open-source tool developed by community enthusiasts for the DAC ecosystem, and is not an official release or financial product of DAC Network or any official entity.

---

## 📜 License

Distributed under the Apache-2.0 License. Open source for the DAC Community.
