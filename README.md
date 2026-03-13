# 🚀 ONEbox - OneChain Development Portal

<div align="center">
  
[![OneChain](https://img.shields.io/badge/OneChain-Testnet-blue?style=for-the-badge)](https://doc-testnet.onelabs.cc)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

*The ultimate development toolkit for OneChain blockchain*

[🌐 Live Demo](https://onebox-app.vercel.app/) 
</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🧪 PTB Presets](#-ptb-presets)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [🧪 Testing](#-testing)
- [📊 Performance](#-performance)
- [🔒 Security](#-security)
- [📚 Resources](#-resources)
- [📝 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## 🎯 What is ONEbox?

ONEbox is a comprehensive development portal designed specifically for OneChain blockchain developers. It provides an all-in-one toolkit that simplifies the development, testing, and deployment process for OneChain applications.

### 🎪 Why ONEbox?

- **🚀 Faster Development**: Pre-built components and templates accelerate your development cycle
- **� AI-Powered Assistance**: ChatGPT-powered AI assistant for instant OneChain development help
- **�🧪 Risk-Free Testing**: Simulate transactions before spending real gas fees
- **📊 Complete Visibility**: Track all your transactions with detailed analytics
- **🔧 Developer-First**: Built by developers, for developers, with real-world use cases in mind
- **🌐 Production Ready**: From prototype to production with the same tools

### 🎭 Who is it for?

- **New Developers** getting started with OneChain
- **Experienced Developers** building complex dApps
- **Teams** collaborating on OneChain projects
- **Educators** teaching blockchain development
- **Researchers** exploring OneChain capabilities

## ✨ Features

> ONEbox provides everything you need to develop, test, and deploy on OneChain blockchain

### 🔗 **Wallet Integration**
- **Seamless Connection**: Connect OneChain wallets with one click
- **Multi-Wallet Support**: Compatible with all OneChain wallet providers
- **Account Management**: Switch between accounts effortlessly
- **Real-time Status**: Live connection status and account information

### � **AI Assistant**
- **ChatGPT Integration**: Powered by OpenAI's ChatGPT for intelligent responses
- **OneChain Expertise**: Comprehensive knowledge of OneChain development
- **Code Examples**: Get working code snippets and implementation guides
- **24/7 Support**: Available anytime for development questions
- **Context-Aware**: Understands Move programming, PTBs, wallet integration, and more

### �🧪 **PTB Simulator**
- **10+ Presets**: Pre-built transaction templates for common operations
- **Dry-Run Testing**: Test transactions without executing them
- **Gas Estimation**: Accurate gas cost predictions
- **Debug Tools**: Comprehensive transaction analysis
- **Smart Validation**: Input validation and error prevention

### 💰 **Testnet Faucet**
- **Instant Tokens**: Get OCT test tokens in seconds
- **Rate Limiting**: Built-in spam protection
- **Multi-Amount**: Choose from different token amounts
- **Balance Integration**: Automatic balance updates

### 📊 **Transaction History**
- **Comprehensive Tracking**: All transaction types (sent/received/interactions)
- **Smart Categorization**: Automatic transaction type detection
- **Explorer Integration**: Direct links to OneChain explorer
- **Real-time Updates**: Live transaction monitoring
- **Advanced Filtering**: Filter by type, date, and amount

### ⚡ **Balance Management**
- **Multi-Token Support**: Track OCT and other tokens
- **Real-time Updates**: Live balance synchronization
- **Historical Data**: Balance change tracking
- **Visual Charts**: Balance trends and analytics

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **pnpm** (recommended) or npm/yarn
- **OneChain Wallet** (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sambitsargam/ONEbox.git
   cd ONEbox
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🛠 Tech Stack

> Built with modern technologies for optimal performance and developer experience

### **Frontend Framework**
- **Next.js 14.2.16** - React framework with App Router for server-side rendering and optimal performance
- **TypeScript 5** - Type-safe development with enhanced developer experience
- **React 18** - Modern React with concurrent features and improved performance

### **Styling & UI**
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **Radix UI** - Accessible, unstyled component primitives for building design systems
- **Lucide React** - Beautiful, customizable icon library
- **next-themes** - Dark/light mode support with system preference detection

### **OneChain Integration**
- **@onelabs/dapp-kit** - Official OneChain wallet and transaction utilities
- **@mysten/sui** - Core Sui/OneChain SDK for blockchain interactions
- **@tanstack/react-query** - Powerful data fetching and caching solution

### **Development Tools**
- **ESLint** - Code linting for consistent code quality
- **Prettier** - Automatic code formatting
- **PostCSS** - CSS processing and optimization
- **TypeScript** - Static type checking and IntelliSense

## 📁 Project Structure

```
ONEbox/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── chat/                    # AI Chat feature
│   │   └── page.tsx            # Chat interface
│   └── api/                     # API routes
│       └── chat/               # OpenAI integration
│           └── route.ts        # Chat API endpoint
├── components/                   # React components
│   ├── ui/                      # UI primitives (Radix + Tailwind)
│   ├── balance-section.tsx      # Balance management
│   ├── chat-section.tsx         # Chat component (legacy)
│   ├── faucet-section.tsx       # Testnet faucet
│   ├── ptb-section.tsx          # PTB simulator
│   ├── transaction-section.tsx  # Transaction history
│   ├── wallet-section.tsx       # Wallet connection
│   └── providers.tsx            # Context providers
├── hooks/                        # Custom React hooks
├── lib/                         # Utility libraries
│   ├── chat-ai.ts              # AI chat integration
│   ├── faucet-api.ts           # Faucet integration
│   ├── onechain-config.ts      # OneChain configuration
│   ├── ptb-presets.ts          # PTB templates
│   ├── transaction-api.ts      # Transaction queries
│   └── utils.ts                # Helper functions
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OneChain Network Configuration
NEXT_PUBLIC_ONECHAIN_NETWORK=testnet
NEXT_PUBLIC_ONECHAIN_RPC_URL=https://rpc-testnet.onelabs.cc
NEXT_PUBLIC_ONECHAIN_EXPLORER_URL=https://onescan.cc

# OpenAI Configuration (for AI Chat feature)
OPENAI_API_KEY=your_openai_api_key_here

# Faucet Configuration (optional)
NEXT_PUBLIC_FAUCET_URL=https://faucet-testnet.onelabs.cc
```

### OneChain Network Setup

The app is pre-configured for OneChain testnet. To modify network settings:

```typescript
// lib/onechain-config.ts
export const ONECHAIN_NETWORKS = {
  testnet: {
    url: "https://rpc-testnet.onelabs.cc",
    name: "OneChain Testnet",
    explorerUrl: "https://onescan.cc"
  }
  // Add other networks as needed
}
```

## 🧪 PTB Presets

ONEbox includes 10+ pre-built PTB templates:

1. **OCT Transfer** - Simple token transfers
2. **Multi-Recipient** - Batch transfers to multiple addresses
3. **Coin Operations** - Advanced coin management
4. **Batch Operations** - Multiple operations in one transaction
5. **Gas Efficient** - Optimized for low gas usage
6. **Large Amount** - High-value transaction testing
7. **Contract Interaction** - Smart contract calls
8. **Complex Workflow** - Multi-step transaction logic
9. **Full Developer Demo** - Comprehensive example
10. **Custom Template** - Build your own

Each preset includes:
- ✅ Pre-configured transaction logic
- ✅ Input validation
- ✅ Gas estimation
- ✅ Error handling
- ✅ Documentation

##  Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables**
3. **Deploy automatically**

```bash
pnpm build
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

```bash
pnpm build
pnpm export
```

## 🤝 Contributing

We welcome contributions from developers of all skill levels! ONEbox is built by the community, for the community.

### 🚀 Quick Contributing Guide

1. **🍴 Fork the repository** on GitHub
2. **🌟 Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **💻 Make your changes** and test thoroughly
4. **📝 Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **🚀 Push to the branch** (`git push origin feature/amazing-feature`)
6. **🎯 Open a Pull Request** with a clear description

### 📚 Detailed Guidelines

For comprehensive contributing guidelines, development setup, coding standards, and more, please see our **[CONTRIBUTING.md](CONTRIBUTING.md)** file.

### 🎯 Areas We Need Help With

- 🐛 **Bug fixes** - Help us squash bugs and improve stability
- ✨ **New PTB presets** - Add more transaction templates
- 📚 **Documentation** - Improve guides and examples  
- 🎨 **UI/UX improvements** - Enhance user experience
- 🌐 **Internationalization** - Add support for more languages
- ⚡ **Performance optimizations** - Make ONEbox even faster

### 💬 Get Involved

- 📞 **[GitHub Discussions](https://github.com/sambitsargam/ONEbox/discussions)** - Ask questions and share ideas
- 🐛 **[Issues](https://github.com/sambitsargam/ONEbox/issues)** - Report bugs and request features
- 📧 **[Email](mailto:sambitsargam@gmail.com)** - Direct contact for maintainers

## 🧪 Testing

### Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

### Test Structure

```
tests/
├── components/          # Component tests
├── lib/                # Utility tests
├── e2e/                # End-to-end tests
└── setup.ts            # Test configuration
```

## 📊 Performance

### Lighthouse Scores

- 🟢 **Performance**: 95+
- 🟢 **Accessibility**: 100
- 🟢 **Best Practices**: 100
- 🟢 **SEO**: 100

### Optimization Features

- ⚡ **Next.js App Router** - Optimized routing
- 🎨 **CSS-in-JS** - Zero runtime CSS
- 📦 **Bundle Splitting** - Efficient code splitting
- 🖼️ **Image Optimization** - Next.js Image component
- 🔄 **Caching** - React Query + SWR patterns

## 🔒 Security

### Best Practices

- 🛡️ **Input Validation** - All user inputs validated
- 🔐 **Wallet Security** - Never store private keys
- 🚫 **XSS Protection** - Content Security Policy
- 🌐 **HTTPS Only** - Secure connections required
- 🔍 **Dependency Scanning** - Regular security audits

## ❓ Frequently Asked Questions

### **Q: Do I need real OCT tokens to use ONEbox?**
A: No! ONEbox works with OneChain testnet and provides a built-in faucet for free test tokens. You can develop and test without spending real money.

### **Q: Can I use ONEbox with my existing OneChain project?**
A: Absolutely! ONEbox is designed to integrate with existing projects. You can use individual components or the entire toolkit.

### **Q: What wallets are supported?**
A: ONEbox supports all OneChain-compatible wallets through the @onelabs/dapp-kit integration.

### **Q: Is ONEbox ready for production use?**
A: Yes! While primarily designed for development, ONEbox can be used to interact with OneChain mainnet when configured properly.

### **Q: How do I add custom PTB presets?**
A: You can add custom presets by modifying the `lib/ptb-presets.ts` file. See our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

### **Q: Can I contribute new features?**
A: We'd love your contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and feel free to open issues for feature requests.

## 📚 Resources

### OneChain Documentation
- [OneChain Developer Docs](https://doc-testnet.onelabs.cc)
- [TypeScript SDK](https://doc-testnet.onelabs.cc/typescript)
- [Wallet Integration](https://doc-testnet.onelabs.cc/wallet)

### Community
- [OneChain Discord](https://discord.gg/onechain)
- [GitHub Discussions](https://github.com/sambitsargam/ONEbox/discussions)
- [Twitter](https://twitter.com/onechain)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OneChain Team** - For the amazing blockchain platform

<div align="center">

**Built with ❤️ for the OneChain community**

[⭐ Star this repo](https://github.com/sambitsargam/ONEbox) • [🐛 Report Bug](https://github.com/sambitsargam/ONEbox/issues) • [💡 Request Feature](https://github.com/sambitsargam/ONEbox/issues)

</div>
