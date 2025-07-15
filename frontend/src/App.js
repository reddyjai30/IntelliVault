// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [input, setInput] = useState('');
//   const [result, setResult] = useState('');
//   const [txLink, setTxLink] = useState('');
//   const [showPopup, setShowPopup] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [balance, setBalance] = useState('');
//   const [parsedIntents, setParsedIntents] = useState([]);
//   const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
//   const [initialGasFee, setInitialGasFee] = useState(null);
//   const [showGasPopup, setShowGasPopup] = useState(false);
//   const [loadingGas, setLoadingGas] = useState(false);
//   const [updatedGasFee, setUpdatedGasFee] = useState(null);
//   const [isListening, setIsListening] = useState(false);

//   const fetchBalance = async () => {
//     try {
//       const res = await axios.get('http://localhost:5003/wallet/balance');
//       setBalance(res.data.balance);
//     } catch (err) {
//       console.error('Failed to fetch balance:', err);
//     }
//   };

//   useEffect(() => {
//     fetchBalance();
//   }, []);

//   const fetchGasEstimate = async () => {
//     try {
//       const res = await axios.get('http://localhost:5003/gas-estimate');
//       setInitialGasFee(res.data.estimatedFee);
//       setShowGasPopup(true);
//     } catch (err) {
//       console.error('Failed to fetch gas estimate:', err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setResult('Fetching gas estimate...');
//     await fetchGasEstimate();
//   };

//   const handleProceedAfterGas = async () => {
//     setShowGasPopup(false);
//     setResult('Parsing intent...');

//     try {
//       const parseResponse = await axios.post('http://localhost:5002/parse-intent', {
//         message: input,
//       });

//       const intents = parseResponse.data.intents;
//       intents.forEach((i) => (i.token = i.token?.toUpperCase()));
//       setParsedIntents(intents);
//       setAwaitingConfirmation(true);
//       setResult(`💬 You're about to perform ${intents.length} action(s). Confirm to proceed.`);
//     } catch (err) {
//       setResult('🚨 Parsing failed');
//       console.error(err);
//     }
//   };

//   const handleWaitForGas = async () => {
//     setLoadingGas(true);
//     setUpdatedGasFee(null);

//     setTimeout(async () => {
//       try {
//         const res = await axios.get('http://localhost:5003/gas-estimate');
//         setUpdatedGasFee(res.data.estimatedFee);
//       } catch (err) {
//         console.error('Gas polling failed:', err);
//       } finally {
//         setLoadingGas(false);
//       }
//     }, 5000);
//   };

//   const handleConfirm = async () => {
//     setResult('Processing transactions...');
//     setAwaitingConfirmation(false);

//     try {
//       const executeResponse = await axios.post('http://localhost:5003/execute', {
//         intents: parsedIntents,
//       });

//       const txResults = executeResponse.data.summary;

//       const newHistory = txResults.map((res, i) => ({
//         message: input,
//         parsed: parsedIntents[i],
//         status: res.status,
//         txHash: res.txHash,
//         timestamp: new Date().toLocaleString(),
//       }));

//       setHistory((prev) => [...newHistory, ...prev].slice(0, 5));

//       const firstSuccess = txResults.find((tx) => tx.status === 'success');
//       if (firstSuccess?.txHash) {
//         setResult('✅ One or more transactions successful. Opening first one...');
//         setTxLink(`https://primordial.bdagscan.com/tx/${firstSuccess.txHash}`);
//         await fetchBalance();
//         setTimeout(() => setShowPopup(true), 3000);
//       } else {
//         setResult('⚠️ No successful transactions');
//       }
//     } catch (err) {
//       setResult('🚨 Execution failed');
//       console.error(err);
//     }
//   };

//   const handleCancel = () => {
//     setParsedIntents([]);
//     setAwaitingConfirmation(false);
//     setResult('❌ Transaction cancelled.');
//   };

//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onstart = () => setIsListening(true);
//     recognition.onend = () => setIsListening(false);

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInput(transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setIsListening(false);
//     };

//     recognition.start();
//   };

//   return (
//     <div className="App">
//       <h2>IntelliVault 💼</h2>
//       <p>💰 Wallet Balance: {balance} BDAG</p>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="e.g. Stake 1 BDAG, then transfer 0.2"
//         />
//         <button type="submit">Submit</button>
//         <button type="button" className="mic-btn" onClick={startListening}>
//           🎤
//         </button>
//         {isListening && <span className="listening-indicator">🎧 Listening...</span>}
//       </form>

//       {showGasPopup && (
//         <div className="popup-overlay">
//           <div className="popup-box">
//             <h3>⛽ Estimated Gas Fee</h3>
//             <p className="gas-value">{updatedGasFee ?? initialGasFee} BDAG</p>
//             <p>💭 Would you like to wait for a lower fee or proceed?</p>

//             {loadingGas ? (
//               <div className="loading-section">
//                 <div className="spinner"></div>
//                 <p>Checking latest gas price...</p>
//               </div>
//             ) : (
//               <div className="button-row">
//                 <button className="wait-btn" onClick={handleWaitForGas}>⏳ Wait</button>
//                 <button className="proceed-btn" onClick={handleProceedAfterGas}>🚀 Proceed</button>
//                 <button className="cancel-btn" onClick={() => setShowGasPopup(false)}>❌ Cancel</button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {awaitingConfirmation && (
//         <div style={{ marginTop: '10px' }}>
//           <div>
//             <p>🔐 You are about to perform:</p>
//             <ul>
//               {parsedIntents.map((intent, index) => (
//                 <li key={index}>
//                   ➤ {intent.action} {intent.amount} {intent.token}
//                 </li>
//               ))}
//             </ul>
//             <p>Confirm?</p>
//           </div>
//           <button onClick={handleConfirm}>✅ Yes, Execute</button>{' '}
//           <button onClick={handleCancel}>❌ Cancel</button>
//         </div>
//       )}

//       <p>Status: {result}</p>

//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-fullscreen">
//             <button onClick={() => setShowPopup(false)}>✖ Close</button>
//             <iframe
//               src={txLink.replace('?chain=UTXO', '?chain=EVM')}
//               title="Transaction Explorer"
//               width="100%"
//               height="100%"
//               style={{ border: 'none' }}
//             />
//           </div>
//         </div>
//       )}

//       <h3>🧾 Recent Transactions</h3>
//       <ul style={{ maxHeight: '300px', overflowY: 'auto', padding: '0 20px' }}>
//         {history.map((item, index) => (
//           <li
//             key={index}
//             style={{
//               marginBottom: '10px',
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '8px',
//               backgroundColor: '#f9f9f9',
//               textAlign: 'left',
//             }}
//           >
//             <div><strong>🗣 Message:</strong> {item.message}</div>
//             <div><strong>🧠 Parsed:</strong> {JSON.stringify(item.parsed)}</div>
//             <div><strong>📅 Time:</strong> {item.timestamp}</div>
//             <div><strong>📍 Status:</strong> {item.status}</div>
//             {item.txHash && (
//               <div>
//                 <strong>🔗 Tx:</strong>{' '}
//                 <a
//                   href={`https://primordial.bdagscan.com/tx/${item.txHash}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   View on BlockDAG Explorer
//                 </a>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [txLink, setTxLink] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState('');
  const [parsedIntents, setParsedIntents] = useState([]);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [initialGasFee, setInitialGasFee] = useState(null);
  const [showGasPopup, setShowGasPopup] = useState(false);
  const [loadingGas, setLoadingGas] = useState(false);
  const [updatedGasFee, setUpdatedGasFee] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get('http://localhost:5003/wallet/balance');
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const fetchGasEstimate = async () => {
    try {
      const res = await axios.get('http://localhost:5003/gas-estimate');
      setInitialGasFee(res.data.estimatedFee);
      setShowGasPopup(true);
    } catch (err) {
      console.error('Failed to fetch gas estimate:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('Fetching gas estimate...');
    await fetchGasEstimate();
  };

  const handleProceedAfterGas = async () => {
    setShowGasPopup(false);
    setResult('Parsing intent...');

    try {
      const parseResponse = await axios.post('http://localhost:5002/parse-intent', {
        message: input,
      });

      const intents = parseResponse.data.intents;
      intents.forEach((i) => (i.token = i.token?.toUpperCase()));
      setParsedIntents(intents);
      setAwaitingConfirmation(true);
      setResult(`💬 You're about to perform ${intents.length} action(s). Confirm to proceed.`);
    } catch (err) {
      setResult('🚨 Parsing failed');
      console.error(err);
    }
  };

  const handleWaitForGas = async () => {
    setLoadingGas(true);
    setUpdatedGasFee(null);

    setTimeout(async () => {
      try {
        const res = await axios.get('http://localhost:5003/gas-estimate');
        setUpdatedGasFee(res.data.estimatedFee);
      } catch (err) {
        console.error('Gas polling failed:', err);
      } finally {
        setLoadingGas(false);
      }
    }, 5000);
  };

  const handleConfirm = async () => {
    setResult('Processing transactions...');
    setAwaitingConfirmation(false);

    try {
      const executeResponse = await axios.post('http://localhost:5003/execute', {
        intents: parsedIntents,
      });

      const txResults = executeResponse.data.summary;

      const newHistory = txResults.map((res, i) => ({
        message: input,
        parsed: parsedIntents[i],
        status: res.status,
        txHash: res.txHash,
        timestamp: new Date().toLocaleString(),
      }));

      setHistory((prev) => [...newHistory, ...prev].slice(0, 5));

      const firstSuccess = txResults.find((tx) => tx.status === 'success');
      if (firstSuccess?.txHash) {
        setResult('✅ One or more transactions successful. Opening first one...');
        setTxLink(`https://primordial.bdagscan.com/tx/${firstSuccess.txHash}`);
        await fetchBalance();
        setTimeout(() => setShowPopup(true), 3000);
      } else {
        setResult('⚠️ No successful transactions');
      }
    } catch (err) {
      setResult('🚨 Execution failed');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setParsedIntents([]);
    setAwaitingConfirmation(false);
    setResult('❌ Transaction cancelled.');
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleRevertTransaction = async (item) => {
    const recipient = item.parsed?.to;
    const amount = item.parsed?.amount;

    if (!recipient || !amount) {
      alert("❌ Missing recipient or amount. Cannot revert.");
      return;
    }

    const confirmed = window.confirm(
      `↩ Are you sure you want to revert ${amount} BDAG to ${recipient}?`
    );
    if (!confirmed) return;

    try {
      const res = await axios.post('http://localhost:5003/revert', {
        recipient,
        amount,
      });

      if (res.data.status === 'success') {
        alert(`✅ Reverted! Tx Hash: ${res.data.txHash}`);
        setTxLink(`https://primordial.bdagscan.com/tx/${res.data.txHash}`);
        setShowPopup(true);
        await fetchBalance();
      } else {
        alert(`⚠️ Revert failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error("🚨 Revert error:", err);
      alert("Something went wrong while reverting the transaction.");
    }
  };

  return (
    <div className="App">
      <h2>IntelliVault 💼</h2>
      <p>💰 Wallet Balance: {balance} BDAG</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Stake 1 BDAG, then transfer 0.2"
        />
        <button type="submit">Submit</button>
        <button type="button" className="mic-btn" onClick={startListening}>🎤</button>
        {isListening && <span className="listening-indicator">🎧 Listening...</span>}
      </form>

      {/* Gas Popup */}
      {showGasPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>⛽ Estimated Gas Fee</h3>
            <p className="gas-value">{updatedGasFee ?? initialGasFee} BDAG</p>
            <p>💭 Would you like to wait for a lower fee or proceed?</p>

            {loadingGas ? (
              <div className="loading-section">
                <div className="spinner"></div>
                <p>Checking latest gas price...</p>
              </div>
            ) : (
              <div className="button-row">
                <button className="wait-btn" onClick={handleWaitForGas}>⏳ Wait</button>
                <button className="proceed-btn" onClick={handleProceedAfterGas}>🚀 Proceed</button>
                <button className="cancel-btn" onClick={() => setShowGasPopup(false)}>❌ Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {awaitingConfirmation && (
        <div style={{ marginTop: '10px' }}>
          <p>🔐 You are about to perform:</p>
          <ul>
            {parsedIntents.map((intent, index) => (
              <li key={index}>➤ {intent.action} {intent.amount} {intent.token}</li>
            ))}
          </ul>
          <p>Confirm?</p>
          <button onClick={handleConfirm}>✅ Yes, Execute</button>{' '}
          <button onClick={handleCancel}>❌ Cancel</button>
        </div>
      )}

      <p>Status: {result}</p>

      {/* Transaction Explorer */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-fullscreen">
            <button onClick={() => setShowPopup(false)}>✖ Close</button>
            <iframe
              src={txLink.replace('?chain=UTXO', '?chain=EVM')}
              title="Transaction Explorer"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )}

      <h3>🧾 Recent Transactions</h3>
      <ul style={{ maxHeight: '300px', overflowY: 'auto', padding: '0 20px' }}>
        {history.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              textAlign: 'left',
            }}
          >
            <div><strong>🗣 Message:</strong> {item.message}</div>
            <div><strong>🧠 Parsed:</strong> {JSON.stringify(item.parsed)}</div>
            <div><strong>📅 Time:</strong> {item.timestamp}</div>
            <div><strong>📍 Status:</strong> {item.status}</div>
            {item.txHash && (
              <div>
                <strong>🔗 Tx:</strong>{' '}
                <a
                  href={`https://primordial.bdagscan.com/tx/${item.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on BlockDAG Explorer
                </a>
              </div>
            )}
            {item.status === 'success' && item.parsed?.action === 'transfer' && item.parsed?.to && (
              <button
              className="revert-btn"
                style={{
                  marginTop: '10px',
                  backgroundColor: '#ffd966',
                  padding: '6px 10px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => handleRevertTransaction(item)}
              >
                ↩ Revert
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;