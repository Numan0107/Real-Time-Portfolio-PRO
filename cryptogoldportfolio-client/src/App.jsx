import { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Portfolio from './components/Portfolio';

const AssetCard = ({ symbol, price, prevPrice, isDarkMode }) => {
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (price > prevPrice) setFlash("up");
    else if (price < prevPrice) setFlash("down");
    
    const timer = setTimeout(() => setFlash(""), 400); 
    return () => clearTimeout(timer);
  }, [price, prevPrice]);

  const getBgColor = () => {
    if (flash === "up") return isDarkMode ? "#064e3b" : "#dcfce7";
    if (flash === "down") return isDarkMode ? "#7f1d1d" : "#fee2e2";
    return isDarkMode ? "#1e293b" : "white";
  };

  const textColor = isDarkMode ? "#f8fafc" : "#111827";
  const borderColor = isDarkMode ? "#334155" : "#ddd";
  const transition = flash ? "none" : "background-color 0.5s ease";

  return (
    <div style={{ 
      border: `1px solid ${borderColor}`, padding: '20px', borderRadius: '8px', 
      minWidth: '150px', backgroundColor: getBgColor(), transition: transition, color: textColor 
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.8 }}>{symbol}</h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${price?.toFixed(2) || 0}</div>
    </div>
  );
};

function App() {
  const [prices, setPrices] = useState({ bitcoin: 0, ethereum: 0, gramGold: 0 });
  const [prevPrices, setPrevPrices] = useState({ bitcoin: 0, ethereum: 0, gramGold: 0 });
  const [chartData, setChartData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const basePricesRef = useRef(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5162/portfoliohub")
      .withAutomaticReconnect()
      .build();

    connection.start().catch(err => console.error("Connection error:", err));

    connection.on("ReceivePriceUpdate", (data) => {
      const newBtc = Number(data.bitcoin || data.Bitcoin || 0);
      const newEth = Number(data.ethereum || data.Ethereum || 0);
      const newGold = Number(data.gramGold || data.GramGold || 0);

      if (!basePricesRef.current && newBtc > 0 && newEth > 0 && newGold > 0) {
        basePricesRef.current = { btc: newBtc, eth: newEth, gold: newGold };
      }

      setPrices(current => {
        setPrevPrices(current);
        return {
          bitcoin: newBtc,
          ethereum: newEth,
          gramGold: newGold
        };
      });

      const now = new Date();
      const timeString = now.toLocaleTimeString() + "." + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
      
      if (basePricesRef.current) {
        const base = basePricesRef.current;
        const btcPct = Number((((newBtc - base.btc) / base.btc) * 100).toFixed(2));
        const ethPct = Number((((newEth - base.eth) / base.eth) * 100).toFixed(2));
        const goldPct = Number((((newGold - base.gold) / base.gold) * 100).toFixed(2));

        setChartData(prev => {
          const newData = [...prev, { time: timeString, BTC: btcPct, ETH: ethPct, GOLD: goldPct, rawBtc: newBtc, rawEth: newEth, rawGold: newGold }];
          if (newData.length > 20) newData.shift();
          return newData;
        });
      }
    });

    return () => connection.stop();
  }, []);

  const themeStyle = {
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'system-ui',
    transition: 'background 0.3s ease, color 0.3s ease'
  };

  const cardStyle = {
    background: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#ddd'}`,
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  };

  return (
    <div style={themeStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Real-Time Portfolio PRO</h2>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: `1px solid ${isDarkMode ? '#475569' : '#ccc'}`,
              background: isDarkMode ? '#334155' : '#e2e8f0',
              color: isDarkMode ? '#f8fafc' : '#0f172a',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <AssetCard symbol="BTCUSDT" price={prices.bitcoin} prevPrice={prevPrices.bitcoin} isDarkMode={isDarkMode} />
          <AssetCard symbol="XAUUSD" price={prices.gramGold} prevPrice={prevPrices.gramGold} isDarkMode={isDarkMode} />
          <AssetCard symbol="ETHUSDT" price={prices.ethereum} prevPrice={prevPrices.ethereum} isDarkMode={isDarkMode} />
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Live Market Chart (% Change)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke={isDarkMode ? '#94a3b8' : '#666'} />
                <YAxis domain={['auto', 'auto']} unit="%" stroke={isDarkMode ? '#94a3b8' : '#666'} />
                <Tooltip 
                  contentStyle={{ 
                    background: isDarkMode ? '#1e293b' : '#fff', 
                    borderColor: isDarkMode ? '#334155' : '#ccc',
                    color: isDarkMode ? '#f8fafc' : '#000' 
                  }} 
                  formatter={(value, name, props) => {
                    const raw = name === 'BTC' ? props.payload.rawBtc : name === 'ETH' ? props.payload.rawEth : props.payload.rawGold;
                    return [`${value}% ($${raw?.toFixed(2)})`, name];
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="BTC" stroke="#ef4444" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ETH" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="GOLD" stroke="#facc15" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Portfolio prices={prices} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default App;