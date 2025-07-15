# 🧠 IntelliVault — Voice-Driven Smart Contract Wallet (BlockDAG Powered) ✅

Welcome to **IntelliVault**, a voice-enabled, AI-powered Web3 wallet built on the **BlockDAG Primordial Testnet**. Our mission is to redefine how users interact with blockchain by allowing **natural language and voice commands** to directly trigger **secure on-chain actions**.

> ✅ "Stake 1 BDAG" → Executed  
> ✅ "Transfer 0.5 BDAG to 0xABC..." → Done  
> ✅ "Revert the last transaction" → Reversal triggered  
> ✅ Conversational, Secure, Gasless feel UX

---

## 🚀 Why IntelliVault?

Most Web3 wallets require users to:

- Understand complex UIs & gas estimations ❌  
- Copy-paste long wallet addresses ❌  
- Read smart contract ABIs ❌  

**With IntelliVault**, users simply **talk or type** their intent: “First stake 1 BDAG, then transfer 0.2 to 0xABC…, and then revert”

And we handle the rest — from parsing the command to executing the smart contract.

---

## 💡 Features at a Glance

✅ **Voice + Text Input**: Users speak or type commands like “Send 1 BDAG”  
✅ **Intent Parsing (OpenAI GPT)**: Converts speech into structured transaction logic  
✅ **Multi-Intent Memory**: Executes a queue of multiple commands in order  
✅ **Reversible Transactions**: Fully working `revert` feature that undoes last transfer  
✅ **Secure Transaction Confirmation**: Every action requires user confirmation  
✅ **Live Wallet Balance Fetch**: See balances update before and after tx  
✅ **Deployed on BlockDAG Testnet**: Full support for Primordial testnet RPC  
✅ **UI Polishing**: Clean, chat-based interface with status feedback  
✅ **Explorer Integration**: Clickable Tx links → Open full-screen in-app modal  

---

## 🧪 How It Works (Architecture)
┌────────────┐
│   User     │
└────┬───────┘
↓
🎙️ Speak / Type → 🧠 NLP via OpenAI → 🔄 Parsed Intent
↓
🧾 Confirmation via Chat UI
↓
🛠️ ethers.js → ⛓️ Smart Contract Execution
↓
✅ Result + TxHash + Balance Update

---

## 📦 Built With

- ⚡ **Hardhat** – Contract development & deployment  
- 🎙️ **OpenAI GPT** – Natural language to intent parsing  
- 🧠 **Node.js (Express)** – Backend orchestration  
- 🛡️ **Ethers.js** – Blockchain interaction  
- 💻 **React.js** – Clean frontend chat interface  
- 🔗 **BlockDAG Primordial Testnet** – Smart contract deployed  
- 🧪 **Custom Smart Contracts** – Stake, Transfer, Revert  

---

## 📄 Smart Contract Info

- ✅ **Contract Address**: `0xC8939c678152545E56a47B5E602DA0908Ba51807`  
- ✅ **Deployed to**: [BlockDAG Primordial Testnet](https://primordial.bdagscan.com)  
- ✅ **Source Verified**: ✔️

---

## 🎥 Demo Video

👉 [Watch on YouTube (2-min Walkthrough)](https://youtu.be/your-demo-link-here)

---

## 📸 Screenshots

| Voice Input | Confirmation Chat | Tx Success |
|-------------|-------------------|------------|
| ![input](./assets/input.png) | ![confirm](./assets/confirm.png) | ![done](./assets/success.png) |

---

## 📚 How to Run Locally

```bash```
git clone https://github.com/reddyjai30/IntelliVault.git
cd IntelliVault

# 1. Install dependencies
npm install

# 2. Set up your .env
cp ai-agent/.env.example ai-agent/.env
# Add your OpenAI key & RPC

# 3. Compile & deploy contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network blockdag

# 4. Start backend
cd contract-agent
npm start

# 5. Start frontend
cd ../frontend
npm start

🔐 Security & Privacy
	•	All private keys and API keys are handled via .env
	•	Voice data is not stored anywhere
	•	Revert transactions are signed only by the original initiator

📝 License

MIT © 2025 IntelliVault Team

📬 Contact

Built with ❤️ by Team IntelliVault
GitHub | BlockDAG Testnet
