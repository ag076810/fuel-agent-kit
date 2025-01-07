# Fuel Agent Kit (Alpha)

[English](#english) | [中文](#chinese)

<a name="english"></a>

## English

An AI agent toolkit for the Fuel blockchain that helps you easily perform various blockchain operations.

### Key Features

- 🤖 Natural Language AI Interaction
- 💰 Token Transfers
- 💼 Balance Queries
- 🔍 Asset ID Support
- 🌐 Network Selection Support

### Installation

```bash
npm install fuel-agent-kit fuels
```

### Prerequisites

You will need:

1. A Fuel wallet private key
2. One of the following AI API keys:
   - OpenAI API Key
   - Google Gemini API Key
   - Anthropic API Key

### Network Configuration

Create a `.env` file and add:

```
# Network settings
FUEL_NETWORK=testnet  # Options: testnet, ignition
FUEL_TESTNET_RPC=https://testnet.fuel.network/v1/graphql
FUEL_IGNITION_RPC=https://mainnet.fuel.network/v1/graphql

# API Keys
OPENAI_API_KEY=your_openai_api_key
FUEL_WALLET_PRIVATE_KEY=your_wallet_private_key
```

### Basic Configuration

```typescript
import { FuelAgent } from 'fuel-agent-kit';

const agent = new FuelAgent({
  model: 'gpt-4-mini', // AI model to use
  openaiApiKey: process.env.OPENAI_API_KEY, // AI API key
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY, // Wallet private key
});
```

### Usage Examples

#### 1. Token Transfer

```typescript
// Using function call
await agent.transfer({
  to: '0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
  amount: '0.1',
  symbol: 'USDC',
});

// Or using natural language
await agent.execute(
  'Send 0.1 USDC to 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
);
```

#### 2. Transfer Using Asset ID

```typescript
await agent.transferByAssetId({
  to: '0x6e8Ba05f0D2c8F229d9214255dfC5dC8432e00702acfA00156f1f7aA4EBB4c81',
  amount: '0.1',
  assetId: '0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee',
  decimals: 9,
});
```

#### 3. Balance Query

```typescript
// Using symbol
await agent.getOwnBalance({
  symbol: 'ETH',
});

// Using asset ID
await agent.getOwnBalanceByAssetId({
  assetId: '0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee',
  decimals: 9,
});

// Or using natural language
await agent.execute('Check my ETH balance');
```

### Development Guide

1. Clone the repository

```bash
git clone https://github.com/your-username/fuel-agent-kit.git
cd fuel-agent-kit
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file and add:

```
# Network settings
FUEL_NETWORK=testnet  # Options: testnet, ignition
FUEL_TESTNET_RPC=https://testnet.fuel.network/v1/graphql
FUEL_IGNITION_RPC=https://mainnet.fuel.network/v1/graphql

# API Keys
OPENAI_API_KEY=your_openai_api_key
FUEL_WALLET_PRIVATE_KEY=your_wallet_private_key
```

4. Build the project

```bash
npm run build
```

### Testing

Add test files to the `test` directory and run:

```bash
npm test
```

### Notes

- This is an Alpha version, please use with caution
- Test with small amounts before making large transactions
- Keep your private keys and API keys secure
- Make sure to select the correct network for your operations

---

<a name="chinese"></a>

## 中文

這是一個用於 Fuel 區塊鏈的 AI 代理工具包，可以幫助您輕鬆地執行各種區塊鏈操作。

### 主要功能

- 🤖 AI 自然語言交互
- 💰 代幣轉賬
- 💼 餘額查詢
- 🔍 資產 ID 支持
- 🌐 網路選擇支持

### 安裝

```bash
npm install fuel-agent-kit fuels
```

### 必要條件

您需要準備：

1. Fuel 錢包私鑰
2. 以下任一 AI API 密鑰：
   - OpenAI API Key
   - Google Gemini API Key
   - Anthropic API Key

### 網路配置

創建 `.env` 文件並添加：

```
# 網路設置
FUEL_NETWORK=testnet  # 可選值: testnet, ignition
FUEL_TESTNET_RPC=https://testnet.fuel.network/v1/graphql
FUEL_IGNITION_RPC=https://mainnet.fuel.network/v1/graphql

# API 密鑰
OPENAI_API_KEY=your_openai_api_key
FUEL_WALLET_PRIVATE_KEY=your_wallet_private_key
```

### 基本配置

```typescript
import { FuelAgent } from 'fuel-agent-kit';

const agent = new FuelAgent({
  model: 'gpt-4-mini', // 使用的 AI 模型
  openaiApiKey: process.env.OPENAI_API_KEY, // AI API 密鑰
  walletPrivateKey: process.env.FUEL_WALLET_PRIVATE_KEY, // 錢包私鑰
});
```

### 使用示例

#### 1. 代幣轉賬

```typescript
// 使用函數調用
await agent.transfer({
  to: '0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
  amount: '0.1',
  symbol: 'USDC',
});

// 或使用自然語言
await agent.execute(
  '轉 0.1 個 USDC 到 0x8F8afB12402C9a4bD9678Bec363E51360142f8443FB171655eEd55dB298828D1',
);
```

#### 2. 使用資產 ID 轉賬

```typescript
await agent.transferByAssetId({
  to: '0x6e8Ba05f0D2c8F229d9214255dfC5dC8432e00702acfA00156f1f7aA4EBB4c81',
  amount: '0.1',
  assetId: '0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee',
  decimals: 9,
});
```

#### 3. 餘額查詢

```typescript
// 使用代幣符號
await agent.getOwnBalance({
  symbol: 'ETH',
});

// 使用資產 ID
await agent.getOwnBalanceByAssetId({
  assetId: '0xd9835efc97796abc977acbd51e1a033deb8bac954910a0b936dc82341cc8d8ee',
  decimals: 9,
});

// 或使用自然語言
await agent.execute('查詢我的 ETH 餘額');
```

### 開發指南

1. 克隆倉庫

```bash
git clone https://github.com/your-username/fuel-agent-kit.git
cd fuel-agent-kit
```

2. 安裝依賴

```bash
npm install
```

3. 設置環境變量
   創建 `.env` 文件並添加：

```
# 網路設置
FUEL_NETWORK=testnet  # 可選值: testnet, ignition
FUEL_TESTNET_RPC=https://testnet.fuel.network/v1/graphql
FUEL_IGNITION_RPC=https://mainnet.fuel.network/v1/graphql

# API 密鑰
OPENAI_API_KEY=your_openai_api_key
FUEL_WALLET_PRIVATE_KEY=your_wallet_private_key
```

4. 構建項目

```bash
npm run build
```

### 測試

添加測試文件到 `test` 目錄，然後運行：

```bash
npm test
```

### 注意事項

- 這是一個 Alpha 版本，請謹慎使用
- 在進行大額交易前，建議先使用小額進行測試
- 請妥善保管您的私鑰和 API 密鑰
- 請確保選擇了正確的網路進行操作

## 貢獻指南

歡迎提交 Pull Request 或創建 Issue。

## 許可證

MIT
