import React from "react";

const TransactionsTable = () => {
  return (
    <div className="bg-gradient-to-r from-black to-gray-800 bg-opacity-80 rounded-2xl p-6">
      <table className="table-auto w-full text-left text-sm text-gray-200">
        <thead className="uppercase text-gray-400">
          <tr>
            <th className="px-4 py-2">Transactions</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          <tr>
            <td className="px-4 py-3 flex items-center">
              <img
                src="path_to_ethereum_icon.png"
                alt="Ethereum"
                className="w-6 h-6 mr-2"
              />
              Ethereum Purchased
            </td>
            <td className="px-4 py-3">0.0154 ETH</td>
            <td className="px-4 py-3">$10.00</td>
            <td className="px-4 py-3 text-yellow-400">Pending</td>
            <td className="px-4 py-3">February 21, 2021</td>
          </tr>
          <tr>
            <td className="px-4 py-3 flex items-center">
              <img
                src="path_to_bitcoin_icon.png"
                alt="Bitcoin"
                className="w-6 h-6 mr-2"
              />
              Bitcoin Purchased
            </td>
            <td className="px-4 py-3">0.3 BTC</td>
            <td className="px-4 py-3">$10.00</td>
            <td className="px-4 py-3 text-green-400">Done</td>
            <td className="px-4 py-3">February 14, 2021</td>
          </tr>
          <tr>
            <td className="px-4 py-3 flex items-center">
              <img
                src="path_to_bitcoin_icon.png"
                alt="Bitcoin"
                className="w-6 h-6 mr-2"
              />
              Bitcoin Purchased
            </td>
            <td className="px-4 py-3">0.025 BTC</td>
            <td className="px-4 py-3">$10.00</td>
            <td className="px-4 py-3 text-green-400">Done</td>
            <td className="px-4 py-3">January 14, 2021</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
