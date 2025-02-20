import React, { useState, useEffect } from "react";

// 🔹 Initial stock data with starting price
const INITIAL_STOCKS = [
  { name: "Suzlon Energy", startPrice: 210 },
  { name: "ITC", startPrice: 441.4 },
  { name: "Yes Bank", startPrice: 18.25 },
  { name: "Hindustan Aeronotics ltd.", startPrice: 234 },
  { name: "Adani Power", startPrice: 515.5 },
  { name: "RVNL", startPrice: 411 },
  { name: "Mahindra & Mahindra ltd.", startPrice: 2799 },
  { name: "Union Bank of India", startPrice: 107.22 },
  { name: "DLF", startPrice: 692.8 },
  { name: "Reliance Industries", startPrice: 1244.45 },
  { name: "Indian Oil Corporation", startPrice: 128.61 },
  { name: "Elcid Investments", startPrice: 132833.5 },
  { name: "Steel Authority of India ltd.", startPrice: 109.05 },
  { name: "Cipla", startPrice: 1425 },
  { name: "Sun Pharmaceutical Industries", startPrice: 1818 },
  { name: "L&T", startPrice: 3458.2 },
  { name: "Adani Ports and Special Economic Zone", startPrice: 1094.15 },
  { name: "Ambuja Cements", startPrice: 551.8 },
  { name: "JSW Steel", startPrice: 932.45 },
  { name: "Mazdock", startPrice: 2299.55 },
  { name: "Ola Electric", startPrice: 71.34 },
  { name: "BPCL", startPrice: 111468.05 },
  { name: "Devyani International", startPrice: 171.22 },
  { name: "Vodafone Idea", startPrice: 9.46 },
  { name: "Barflex Polyfilms Ltd", startPrice: 69.2 },
  { name: "Bank Of Maharashtra", startPrice: 49.56 },
  { name: "Mahasagar Travels", startPrice: 7.48 },
  { name: "INDIGO", startPrice: 4293.6 },
  { name: "Surana Telecom & Power", startPrice: 21.38 }
];

const sheetUrl = ""; // Replace with actual sheet URL

const CryptoTable = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Math.floor(Date.now() / 1000); 
        setLastUpdateTime(now);

        const res = await fetch(sheetUrl);
        const text = await res.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows.map((row) => {
          const cells = row.c.map((cell) => cell?.v || "N/A");
          const name = cells[0];
          const latestPrice = parseFloat(cells[1]);

          const initialStock = INITIAL_STOCKS.find(stock => stock.name === name);
          const startPrice = initialStock ? initialStock.startPrice : latestPrice;

          const change = startPrice !== 0 ? (((latestPrice - startPrice) / startPrice) * 100).toFixed(2) : "0.00";

          const timeSinceUpdate = now - lastUpdateTime;

          return { name, price: latestPrice, startPrice, change, updated: timeSinceUpdate };
        });

        setCryptoData(rows);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Retrying...");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);

    return () => clearInterval(interval);
  }, [lastUpdateTime]);

  return (
    <>
      <h2 className="text-4xl font-bold text-center mb-[1%] text-[#E1DFEC] DMSans">Stocks</h2>
      <div className="flex justify-center items-center min-h-screen">
        <table
          className=" mx-auto text-white rounded-lg shadow-lg text-center border-separate border-spacing-4"
          style={{ backgroundColor: "rgb(16,14,33)" }}
        >
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm md:text-lg">
              <th className="p-[0.5%] DMSans">Stocks</th>
              <th className="p-[0.5%] DMSans hidden md:table-cell">Updated</th>
              <th className="p-[0.5%] DMSans">Change</th>
              <th className="p-[0.5%] DMSans">Price</th>
            </tr>
          </thead>
          <tbody>
  {loading ? (
    <tr>
      <td colSpan="4" className="p-4 text-gray-400 text-center">Loading data...</td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan="4" className="p-4 text-red-500 text-center">{error}</td>
    </tr>
  ) : (
    cryptoData.map((crypto, index) => (
      <tr key={index} className="border-b border-gray-700 text-sm md:text-lg">
        {/* Stock Name and Symbol */}
        <td className="p-[4%] flex items-center text-left"> {/* Removed justify-center, added text-left */}
          <span className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[2vw] bg-orange-500 text-white rounded-full flex items-center justify-center mr-[2%]">
            {crypto.name[0]}
          </span>
          {crypto.name}
        </td>
        {/* Updated Time */}
        <td className="p-[1%] text-gray-400 hidden md:table-cell">{crypto.updated} secs ago</td>
        {/* Change Percentage */}
        <td className={`p-[1%] ${crypto.change < 0 ? "text-red-500" : "text-green-500"}`}>
          {crypto.change < 0 ? "↓" : "↑"} {crypto.change}%
        </td>
        {/* Price */}
        <td className="p-[1%]">₹{crypto.price}</td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </>
  );
};

export default CryptoTable;