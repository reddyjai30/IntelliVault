import 'dotenv/config'; // modern way to load .env in ES modules
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import contractJson from '../contracts/artifacts/contracts/IntelliVaultStaker.sol/IntelliVaultStaker.json' assert { type: "json" };
import walletRoute from './routes/wallet.js';

const app = express();
app.use(cors());
app.use(express.json());

// API route to get wallet balance
app.use('/wallet', walletRoute);

// Setup provider, wallet and contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractJson.abi,
  wallet
);

// POST /execute → calls contract based on parsed intents (array of actions)
app.post('/execute', async (req, res) => {
  const { intents } = req.body;

  if (!Array.isArray(intents)) {
    return res.status(400).json({
      status: 'invalid',
      message: 'Expected an array of intents like [{ action, token, amount }]',
    });
  }

  const summary = [];

  for (const intent of intents) {
    const { action, token, amount, to } = intent;

    try {
      if (action === 'stake' && token === 'BDAG') {
        const tx = await contract.stake({
          value: ethers.parseEther(amount.toString()),
        });
        await tx.wait();
        summary.push({ status: 'success', action, txHash: tx.hash });
      }

      else if (action === 'transfer' && token === 'BDAG') {
        if (!to) {
          summary.push({ status: 'failed', action, error: 'Missing recipient address (to)' });
          continue;
        }

        console.log("Contract Address:", contract.target);
        
        const tx = await contract.transferBDAG(
          ethers.getAddress(to),
          ethers.parseEther(amount.toString())
        );
        await tx.wait();
        summary.push({ status: 'success', action, txHash: tx.hash });
      }

      else {
        summary.push({
          status: 'invalid',
          action,
          message: 'Unsupported action or token',
        });
      }
    } catch (err) {
      console.error(`${action} error:`, err);
      summary.push({ status: 'failed', action, error: err.message });
    }
  }

  res.json({ summary });
});

// GET /gas-estimate
app.get('/gas-estimate', async (req, res) => {
  try {
    const feeData = await provider.getFeeData(); // Correct method in ethers v6
    const gasPrice = feeData.gasPrice;

    // Example gas estimate for sending 0.01 ETH to self
    const estimate = await wallet.estimateGas({
      to: wallet.address,
      value: ethers.parseEther("0.01"),
    });

    const estimatedFee = gasPrice * estimate;
    const estimatedFeeInEth = ethers.formatEther(estimatedFee);

    res.json({
      gasPrice: ethers.formatUnits(gasPrice, 'gwei') + ' Gwei',
      estimatedGas: estimate.toString(),
      estimatedFee: estimatedFeeInEth + ' ETH',
    });
  } catch (error) {
    console.error('Gas estimate error:', error);
    res.status(500).json({ error: 'Failed to estimate gas' });
  }
});

// POST /revert
app.post('/revert', async (req, res) => {
  try {
    const { recipient, amount } = req.body;

    if (!recipient || !amount) {
      return res.status(400).json({ status: 'fail', message: 'Missing recipient or amount' });
    }

    const tx = await wallet.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amount.toString()),
    });

    await tx.wait();

    res.json({ status: 'success', txHash: tx.hash });
  } catch (err) {
    console.error('Revert error:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

app.listen(5003, () => {
  console.log('✅ Contract Agent running at http://localhost:5003');
});