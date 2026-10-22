import { useState } from 'react';

export default function Portfolio({ prices, isDarkMode }) {
  const [balance, setBalance] = useState(100000);
  const [assets, setAssets] = useState({ btc: 0, eth: 0, gold: 0 });
  const [history, setHistory] = useState([]);

  const handleBuy = (symbol, amount, price) => {
    const cost = amount * price;
    if (balance < cost) {
      alert("Insufficient balance!");
      return;
    }
    setBalance(prev => prev - cost);
    setAssets(prev => ({
      ...prev,
      [symbol]: prev[symbol] + amount
    }));
    setHistory(prev => [
      { id: Date.now(), type: 'BUY', symbol: symbol.toUpperCase(), amount, price, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const handleSell = (symbol, amount, price) => {
    if (assets[symbol] < amount) {
      alert("Insufficient asset amount!");
      return;
    }
    const revenue = amount * price;
    setBalance(prev => prev + revenue);
    setAssets(prev => ({
      ...prev,
      [symbol]: prev[symbol] - amount
    }));
    setHistory(prev => [
      { id: Date.now(), type: 'SELL', symbol: symbol.toUpperCase(), amount, price, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const portfolioValue = balance + (assets.btc * (prices.bitcoin || 0)) + (assets.eth * (prices.ethereum || 0)) + (assets.gold * (prices.gramGold || 0));
  const profitLoss = portfolioValue - 100000;
  const profitLossPercent = (profitLoss / 100000) * 100;

  const cardStyle = {
    background: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#ddd'}`,
    padding: '20px',
    borderRadius: '8px',
    color: isDarkMode ? '#f8fafc' : '#0f172a'
  };

  const buttonStyle = {
    padding: '8px 14px',
    borderRadius: '6px',
    border: `1px solid ${isDarkMode ? '#475569' : '#ccc'}`,
    background: isDarkMode ? '#334155' : '#f1f5f9',
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Portfolio & Trading</h3>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', fontSize: '16px', flexWrap: 'wrap' }}>
        <div><strong>Cash:</strong> ${balance.toFixed(2)}</div>
        <div><strong>Total Value:</strong> ${portfolioValue.toFixed(2)}</div>
        <div style={{ color: profitLoss >= 0 ? (isDarkMode ? '#4ade80' : 'green') : (isDarkMode ? '#f87171' : 'red') }}>
          <strong>P/L:</strong> ${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
        </div>
      </div>

      <div style={{ marginBottom: '20px', opacity: 0.9 }}>
        <strong>Assets:</strong> BTC: {assets.btc.toFixed(4)} | ETH: {assets.eth.toFixed(4)} | GOLD: {assets.gold.toFixed(4)}
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button style={buttonStyle} onClick={() => handleBuy('btc', 0.1, prices.bitcoin)}>Buy 0.1 BTC</button>
        <button style={buttonStyle} onClick={() => handleSell('btc', 0.1, prices.bitcoin)}>Sell 0.1 BTC</button>
        <button style={buttonStyle} onClick={() => handleBuy('eth', 1, prices.ethereum)}>Buy 1 ETH</button>
        <button style={buttonStyle} onClick={() => handleSell('eth', 1, prices.ethereum)}>Sell 1 ETH</button>
        <button style={buttonStyle} onClick={() => handleBuy('gold', 10, prices.gramGold)}>Buy 10 Gold</button>
        <button style={buttonStyle} onClick={() => handleSell('gold', 10, prices.gramGold)}>Sell 10 Gold</button>
      </div>

      <h4>Transaction History</h4>
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: `1px solid ${isDarkMode ? '#334155' : '#eee'}`, padding: '10px', borderRadius: '6px' }}>
        {history.length === 0 ? (
          <div style={{ opacity: 0.6 }}>No transactions yet.</div>
        ) : (
          history.map(tx => (
            <div key={tx.id} style={{ padding: '6px 0', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: tx.type === 'BUY' ? (isDarkMode ? '#4ade80' : 'green') : (isDarkMode ? '#f87171' : 'red'), fontWeight: 'bold' }}>
                {tx.type} {tx.amount} {tx.symbol}
              </span>
              <span>@ ${tx.price?.toFixed(2)}</span>
              <span style={{ opacity: 0.6, fontSize: '12px' }}>{tx.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}