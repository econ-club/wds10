import { useEffect, useState } from "react";

const FetchData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL of your public Google Sheet JSON
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1watWnb_z-P-kmFMJ902T-XvZNqNLaXqs3l_xSlVXHzA/gviz/tq?tqx=out:json";

    const fetchData = async () => {
        try {
            
            const cachedData = localStorage.getItem("stockData");
            const cacheTimestamp = localStorage.getItem("stockDataTimestamp");
            const now = new Date().getTime();

            if (cachedData && cacheTimestamp && now - cacheTimestamp < 3000) {
                
                setData(JSON.parse(cachedData));
                setLoading(false);
                return;
            }

            
            const res = await fetch(sheetUrl);
            const text = await res.text();

            
            const json = JSON.parse(text.substring(47).slice(0, -2));

           
            const rows = json.table.rows.map((row) => {
                const cells = row.c.map((cell) => cell?.v || "N/A");

                
                const name = cells[0];
                const price = parseFloat(cells[1]);
                const change = parseFloat(cells[2]);

                return { name, price, change };
            });

            
            localStorage.setItem("stockData", JSON.stringify(rows));
            localStorage.setItem("stockDataTimestamp", now.toString());

            
            setData(rows);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data. Retrying...");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); 

        
        const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId); 
    }, []);

    return (
        <div>
            <h1>Stock Data</h1>
            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {data.map((crypto, index) => (
                        <div key={index} className="relative flex items-center space-x-4 p-4 bg-[#0B091A] hover:bg-[#7D67FF] border border-gray-600 transition-colors duration-300 text-white rounded-lg shadow-md w-full group">
                            <div className="flex flex-col space-y-2 w-1/2">
                                <h3 className="text-lg font-bold">{crypto.name}</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white text-md font-bold rounded-full">
                                        {crypto.name[0]}
                                    </div>
                                    <div className="text-lg font-semibold">${crypto.price}</div>
                                </div>
                                <div className="text-gray-400 text-sm">Updated</div>
                                <div className={`text-md font-bold ${crypto.change < 0 ? "text-red-500" : "text-green-500"}`}>
                                    {crypto.change < 0 ? `↓ ${crypto.change}%` : `↑ ${crypto.change}%`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FetchData;
