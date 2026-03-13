# 🤝 Contributing to ONEbox

Thank you for your interest in contributing to ONEbox! We welcome contributions from developers of all skill levels. This guide will help you get started with contributing to the OneChain Development Portal.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [sambitsargam@gmail.com](mailto:sambitsargam@gmail.com).

### Our Pledge

- **Be respectful** and inclusive to all community members
- **Be collaborative** and help others learn and grow
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and those learning

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- **Node.js** 18.0 or later
- **pnpm** (preferred package manager)
- **Git** for version control
- **OneChain Wallet** for testing
- Basic knowledge of **TypeScript** and **React**

### Areas for Contribution

We welcome contributions in these areas:

- 🐛 **Bug fixes** - Help us fix issues and improve stability
- ✨ **New features** - Add new functionality to enhance the portal
- 📚 **Documentation** - Improve docs, guides, and code comments
- 🎨 **UI/UX improvements** - Enhance user interface and experience
- 🧪 **PTB presets** - Add new transaction templates
- 🔧 **Developer tools** - Build utilities for OneChain developers
- 🌐 **Internationalization** - Add support for more languages
- ⚡ **Performance** - Optimize code and improve loading times

## 💻 Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ONEbox.git
cd ONEbox

# Add the original repository as upstream
git remote add upstream https://github.com/sambitsargam/ONEbox.git
```

### 2. Install Dependencies

```bash
# Install dependencies using pnpm
pnpm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# NEXT_PUBLIC_ONECHAIN_NETWORK=testnet
# NEXT_PUBLIC_ONECHAIN_RPC_URL=https://rpc-testnet.onelabs.cc
```

### 4. Start Development Server

```bash
# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

### 5. Verify Setup

- ✅ Connect a OneChain wallet
- ✅ Request test tokens from faucet
- ✅ Run a PTB simulation
- ✅ Check transaction history

## 🛠 Contributing Guidelines

### Branch Naming Convention

Use descriptive branch names with prefixes:

```bash
# Feature branches
git checkout -b feature/add-new-ptb-preset
git checkout -b feature/improve-transaction-ui

# Bug fix branches
git checkout -b fix/wallet-connection-issue
git checkout -b fix/faucet-rate-limiting

# Documentation branches
git checkout -b docs/update-setup-guide
git checkout -b docs/add-api-examples

# Refactoring branches
git checkout -b refactor/transaction-api
git checkout -b refactor/component-structure
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
feat(ptb): add new multi-signature transaction preset
fix(wallet): resolve connection timeout issue
docs(readme): update installation instructions
refactor(api): simplify transaction history queries
```

## 🔄 Pull Request Process

### 1. Before Creating a PR

- ✅ **Check existing issues** - Make sure your PR addresses an existing issue or create one
- ✅ **Update your fork** - Sync with upstream before starting work
- ✅ **Create feature branch** - Don't work directly on main
- ✅ **Test thoroughly** - Verify your changes work as expected

### 2. Creating the Pull Request

```bash
# Make sure your changes are committed
git add .
git commit -m "feat(ptb): add advanced gas optimization preset"

# Push to your fork
git push origin feature/add-gas-optimization-preset

# Create PR on GitHub with:
# - Clear title describing the change
# - Detailed description of what was changed and why
# - Screenshots/GIFs for UI changes
# - Testing instructions
# - Link to related issues
```

### 3. PR Template

When creating a PR, please include:

```markdown
## 📝 Description
Brief description of changes made.

## 🔗 Related Issues
Fixes #123
Closes #456

## 🧪 Testing
- [ ] Tested on Chrome/Firefox/Safari
- [ ] Tested wallet connection
- [ ] Tested PTB simulation
- [ ] Tested transaction history

## 📸 Screenshots
[Add screenshots for UI changes]

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

### 4. Review Process

- **Automated checks** will run (linting, type checking, build)
- **Manual review** by maintainers
- **Address feedback** promptly and respectfully
- **Iterate** until approved

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** and README
3. **Try latest version** to see if issue is resolved

### Issue Types

#### 🐛 Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots/error messages
- Wallet type and version

#### ✨ Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if any)
- Mockups or examples

#### 📚 Documentation Issues

Include:
- Which documentation needs improvement
- What's unclear or missing
- Suggested improvements

## 🎯 Coding Standards

### TypeScript Guidelines

```typescript
// Use explicit types
interface TransactionData {
  digest: string
  sender: string
  timestamp: number
}

// Use proper naming conventions
const fetchTransactionHistory = async (address: string): Promise<TransactionData[]> => {
  // Implementation
}

// Use meaningful variable names
const isWalletConnected = !!currentAccount
const hasInsufficientBalance = balance < requiredAmount
```

### React Best Practices

```tsx
// Use functional components with hooks
export const WalletSection: React.FC = () => {
  const { currentAccount } = useCurrentAccount()
  
  // Early returns for cleaner code
  if (!currentAccount) {
    return <ConnectWalletPrompt />
  }
  
  return (
    <div className="wallet-section">
      {/* Component content */}
    </div>
  )
}

// Use proper prop types
interface ButtonProps {
  variant: 'primary' | 'secondary'
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}
```

### Styling Guidelines

```tsx
// Use Tailwind CSS classes
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Connect Wallet
</button>

// Use CSS variables for consistency
<div className="bg-background text-foreground border border-border">
  Content
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test wallet-section.test.tsx

# Generate coverage report
pnpm test:coverage
```

### Writing Tests

```typescript
// Component tests
import { render, screen } from '@testing-library/react'
import { WalletSection } from '@/components/wallet-section'

describe('WalletSection', () => {
  it('should render connect button when no wallet connected', () => {
    render(<WalletSection />)
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })
})

// API tests
import { fetchTransactionHistory } from '@/lib/transaction-api'

describe('fetchTransactionHistory', () => {
  it('should return transaction data for valid address', async () => {
    const result = await fetchTransactionHistory('0x123...')
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })
})
```

### Manual Testing Checklist

Before submitting:

- [ ] **Wallet connection** works across different wallets
- [ ] **PTB simulation** executes without errors
- [ ] **Transaction history** loads and displays correctly
- [ ] **Faucet requests** complete successfully
- [ ] **Responsive design** works on mobile/tablet/desktop
- [ ] **Dark/light mode** switches properly
- [ ] **Error handling** shows appropriate messages

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Fetches comprehensive transaction history for a given address
 * @param address - OneChain address to query
 * @param network - Network type (testnet/mainnet)
 * @returns Promise<TransactionHistoryResponse>
 */
export async function fetchTransactionHistory(
  address: string,
  network: NetworkType = "testnet"
): Promise<TransactionHistoryResponse> {
  // Implementation
}
```

### README Updates

When adding features:
- Update feature list
- Add configuration examples
- Include usage instructions
- Update screenshots

### Inline Comments

```typescript
// Query multiple endpoints to get comprehensive transaction history
const queries = [
  { filter: { FromAddress: address }, type: "sent" },
  { filter: { ToAddress: address }, type: "received" },
  // Additional queries...
]
```

## 🌟 Recognition

Contributors will be recognized in:

- 📝 **CONTRIBUTORS.md** file
- 🎉 **Release notes** for significant contributions
- 🐦 **Social media** shoutouts
- 🏆 **Special badges** for major contributions

## 💬 Community

### Getting Help

- 📞 **GitHub Discussions** - Ask questions and share ideas
- 🐛 **GitHub Issues** - Report bugs and request features
- 📧 **Email** - Direct contact for sensitive matters

### Communication Guidelines

- **Be respectful** and constructive
- **Provide context** when asking questions
- **Share solutions** that might help others
- **Welcome newcomers** and help them learn

## 🎯 Development Roadmap

### Current Priorities

1. **Enhanced PTB Templates** - More preset types
2. **Advanced Analytics** - Transaction analysis tools
3. **Multi-Network Support** - Mainnet integration
4. **Developer APIs** - Public API endpoints
5. **Mobile App** - React Native version

### Long-term Goals

- **Plugin System** - Extensible architecture
- **Smart Contract IDE** - Integrated development environment
- **NFT Tools** - NFT minting and management
- **DeFi Integration** - DEX and lending protocols

## 📞 Contact

- **Maintainer**: Sambit Sargam ([@sambitsargam](https://github.com/sambitsargam))
- **Email**: sambitsargam@gmail.com
- **Issues**: [GitHub Issues](https://github.com/sambitsargam/ONEbox/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sambitsargam/ONEbox/discussions)

---

Thank you for contributing to ONEbox! Together, we're building the best development portal for the OneChain ecosystem. 🚀

**Happy coding!** 💻✨
