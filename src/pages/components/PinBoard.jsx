import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// 🔹 Initial stock data with starting price
const INITIAL_STOCKS = [
  { "name": "Suzlon Energy", "startPrice": 210 },
  { "name": "ITC", "startPrice": 441.4 },
  { "name": "Yes Bank", "startPrice": 18.25 },
  { "name": "Hindustan Aeronotics ltd.", "startPrice": 234 },
  { "name": "Adani Power", "startPrice": 515.5 },
  { "name": "RVNL", "startPrice": 411 },
  { "name": "Mahindra & Mahindra ltd.", "startPrice": 2799 },
  { "name": "Union Bank of India", "startPrice": 107.22 },
  { "name": "DLF", "startPrice": 692.8 },
  { "name": "Reliance Industries", "startPrice": 1244.45 },
  { "name": "Indian Oil Corporation", "startPrice": 128.61 },
  { "name": "Elcid Investments", "startPrice": 132833.5 },
  { "name": "Steel Authority of India ltd.", "startPrice": 109.05 },
  { "name": "Cipla", "startPrice": 1425 },
  { "name": "Sun Pharmaceutical Industries", "startPrice": 1818 },
  { "name": "L&T", "startPrice": 3458.2 },
  { "name": "Adani Ports and Special Economic Zone", "startPrice": 1094.15 },
  { "name": "Ambuja Cements", "startPrice": 551.8 },
  { "name": "JSW Steel", "startPrice": 932.45 },
  { "name": "Mazdock", "startPrice": 2299.55 },
  { "name": "Ola Electric", "startPrice": 71.34 },
  { "name": "BPCL", "startPrice": 111468.05 },
  { "name": "Devyani International", "startPrice": 171.22 },
  { "name": "Vodafone Idea", "startPrice": 9.46 },
  { "name": "Barflex Polyfilms Ltd", "startPrice": 69.2 },
  { "name": "Bank Of Maharashtra", "startPrice": 49.56 },
  { "name": "Mahasagar Travels", "startPrice": 7.48 },
  { "name": "INDIGO", "startPrice": 4293.6 },
  { "name": "Surana Telecom & Power", "startPrice": 21.38 }
];

const PinBoard = () => {
  const [selectedCryptos, setSelectedCryptos] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedCryptos")) || INITIAL_STOCKS.map(s => s.name);
  });
  const [newCryptos, setNewCryptos] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistoryData, setPriceHistoryData] = useState(() => {
    return JSON.parse(localStorage.getItem("priceHistory")) || {};
  });

  const sheetUrl = "";// Add your Google Sheet URL here

  const fetchData = async () => {
    try {
      const res = await fetch(sheetUrl);
      const text = await res.text();
      const json = JSON.parse(text.substring(47).slice(0, -2));

      const now = new Date().getTime();
      const rows = json.table.rows.map((row) => {
        const cells = row.c.map((cell) => cell?.v || "N/A");
        const name = cells[0];
        const latestPrice = parseFloat(cells[1]);

        if (isNaN(latestPrice)) return null;

        const initialStock = INITIAL_STOCKS.find(stock => stock.name === name);
        const startPrice = initialStock ? initialStock.startPrice : latestPrice;

        let history = priceHistoryData[name] || [{ time: now, price: startPrice }];
        if (history.length === 0 || history[history.length - 1].price !== latestPrice) {
          history.push({ time: now, price: latestPrice });
          if (history.length > 10) history.shift();
        }

        const change = startPrice !== 0 ? (((latestPrice - startPrice) / startPrice) * 100).toFixed(2) : "0.00";

        return {
          name,
          price: latestPrice,
          startPrice,
          change,
          updated: now,
          priceHistory: history,
        };
      }).filter(Boolean);

      setCryptoData(rows);
      setPriceHistoryData((prev) => {
        const updatedHistory = { ...prev };
        rows.forEach((crypto) => {
          updatedHistory[crypto.name] = crypto.priceHistory;
        });
        localStorage.setItem("priceHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });

      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Retrying...");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Update every 5 sec
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
  }, [selectedCryptos]);

  const addCryptos = () => {
    setSelectedCryptos([...new Set([...selectedCryptos, ...newCryptos])]);
    setNewCryptos([]);
    setDropdownOpen(false);
  };

  const removeCrypto = (crypto) => {
    setSelectedCryptos(selectedCryptos.filter((item) => item !== crypto));
  };

  const formatTimeAgo = (timestamp) => {
    const secondsAgo = Math.floor((new Date().getTime() - timestamp) / 1000);
    if (secondsAgo < 60) return `${secondsAgo} sec ago`;
    return `${Math.floor(secondsAgo / 60)} min ago`;
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-[30%] bg-[#0B091A] p-6">
      <h2 className="text-4xl font-bold text-center mb-4 text-[#E1DFEC] DMSans">PinBoard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {cryptoData
          .filter((crypto) => selectedCryptos.includes(crypto.name))
          .map((crypto, index) => (
            <div key={index} className="relative flex items-center space-x-4 p-4 bg-[#0B091A] hover:bg-[#7D67FF] border border-gray-600 transition-colors duration-300 text-white rounded-lg shadow-md w-full group">
              <div className="flex flex-col space-y-2 w-1/2">
                <h3 className="text-lg font-bold">{crypto.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white text-md font-bold rounded-full">
                    {crypto.name[0]}
                  </div>
                  <div className="text-lg font-semibold">
                    ₹{crypto.price ? crypto.price.toFixed(2) : "N/A"} {/* Updated to ₹ symbol */}
                  </div>
                </div>
                <div className="text-gray-400 text-sm">{formatTimeAgo(crypto.updated)}</div>
                <div className={`text-md font-bold ${crypto.change < 0 ? "text-red-500" : "text-green-500"}`}>
                  {crypto.change < 0 ? `↓ ${crypto.change}%` : `↑ ${crypto.change}%`}
                </div>
              </div>
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={crypto.priceHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#E1DFEC" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => removeCrypto(crypto.name)}
              >
                <X size={16} />
              </button>
            </div>
          ))}

       {/* "Add More" Button with Dropdown */}
       <div className="relative">
          <button
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-400 text-gray-400 hover:text-white hover:border-white transition cursor-pointer rounded-lg w-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            + Add More <ChevronDown className="ml-2" size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-14 left-0 w-60 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-10 transition-opacity duration-200">
              <h3 className="text-lg font-semibold mb-2">Select Cryptos</h3>
              <div className="max-h-40 overflow-y-auto">
                {cryptoData.map((crypto) => (
                  <label key={crypto.name} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      value={crypto.name}
                      onChange={(e) =>
                        setNewCryptos((prev) => (e.target.checked ? [...prev, e.target.value] : prev.filter((c) => c !== e.target.value)))
                      }
                      checked={newCryptos.includes(crypto.name)}
                      className="accent-blue-500"
                    />
                    <span className="text-md">{crypto.name}</span>
                  </label>
                ))}
              </div>
              <button className="w-full mt-3 p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition" onClick={addCryptos}>
                Add Selected
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinBoard;