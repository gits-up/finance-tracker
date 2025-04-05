import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AssetAllocationCal = () => {
  const navigate = useNavigate();
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [equityPercent, setEquityPercent] = useState(60);
  const [debtPercent, setDebtPercent] = useState(30);
  const [goldPercent, setGoldPercent] = useState(10);
  const [otherPercent, setOtherPercent] = useState(0);
  const [showRebalance, setShowRebalance] = useState(false);

  // Ensure percentages add up to 100
  useEffect(() => {
    const total = equityPercent + debtPercent + goldPercent;
    const remaining = 100 - total;
    setOtherPercent(remaining > 0 ? remaining : 0);
  }, [equityPercent, debtPercent, goldPercent]);

  const handleRebalance = () => {
    setShowRebalance(true);
  };

  const handleReset = () => {
    setEquityPercent(60);
    setDebtPercent(30);
    setGoldPercent(10);
    setOtherPercent(0);
    setShowRebalance(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const recommendedAllocation = {
    conservative: { equity: 40, debt: 50, gold: 10 },
    moderate: { equity: 60, debt: 30, gold: 10 },
    aggressive: { equity: 80, debt: 15, gold: 5 },
  };

  const applyRecommended = (type) => {
    setEquityPercent(recommendedAllocation[type].equity);
    setDebtPercent(recommendedAllocation[type].debt);
    setGoldPercent(recommendedAllocation[type].gold);
    setOtherPercent(0);
    setShowRebalance(false);
  };

  // CSS-based pie chart
  const PieChart = () => {
    const equityDeg = (equityPercent / 100) * 360;
    const debtDeg = (debtPercent / 100) * 360;
    const goldDeg = (goldPercent / 100) * 360;
    const otherDeg = (otherPercent / 100) * 360;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 rounded-full"
             style={{
               background: `conic-gradient(
                 #3b82f6 0deg ${equityDeg}deg,
                 #10b981 ${equityDeg}deg ${equityDeg + debtDeg}deg,
                 #f59e0b ${equityDeg + debtDeg}deg ${equityDeg + debtDeg + goldDeg}deg,
                 #8b5cf6 ${equityDeg + debtDeg + goldDeg}deg 360deg
               )`
             }}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Asset Allocation Calculator
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Optimize your investment portfolio with proper asset allocation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Portfolio Details</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Total Investment Amount (₹)
              </label>
              <input
                type="number"
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Equity: {equityPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={equityPercent}
                  onChange={(e) => setEquityPercent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Debt: {debtPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={debtPercent}
                  onChange={(e) => setDebtPercent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Gold: {goldPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goldPercent}
                  onChange={(e) => setGoldPercent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Other: {otherPercent}%
                </label>
                <div className="text-gray-400 text-sm">
                  (Automatically calculated as remaining percentage)
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <button 
                onClick={() => applyRecommended("conservative")} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Conservative
              </button>
              <button 
                onClick={() => applyRecommended("moderate")} 
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Moderate
              </button>
              <button 
                onClick={() => applyRecommended("aggressive")} 
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Aggressive
              </button>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Portfolio Allocation</h2>
            
            <div className="flex justify-center mb-6">
              <PieChart />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Equity:</span>
                <span className="font-bold text-blue-400">
                  {formatCurrency((totalInvestment * equityPercent) / 100)} ({equityPercent}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Debt:</span>
                <span className="font-bold text-green-400">
                  {formatCurrency((totalInvestment * debtPercent) / 100)} ({debtPercent}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Gold:</span>
                <span className="font-bold text-yellow-400">
                  {formatCurrency((totalInvestment * goldPercent) / 100)} ({goldPercent}%)
                </span>
              </div>
              {otherPercent > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Other:</span>
                  <span className="font-bold text-purple-400">
                    {formatCurrency((totalInvestment * otherPercent) / 100)} ({otherPercent}%)
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={handleRebalance}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition duration-200"
              >
                Rebalance Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Rebalance Suggestion */}
        {showRebalance && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Rebalancing Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900 bg-opacity-20 p-4 rounded-lg border border-blue-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Equity Adjustment</h3>
                <p className="text-gray-300">
                  {equityPercent > 60 ? "Consider reducing by " + (equityPercent - 60) + "%" : "Consider increasing by " + (60 - equityPercent) + "%"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Target range: 50-70% for balanced portfolio
                </p>
              </div>
              <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-700">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Debt Adjustment</h3>
                <p className="text-gray-300">
                  {debtPercent > 30 ? "Consider reducing by " + (debtPercent - 30) + "%" : "Consider increasing by " + (30 - debtPercent) + "%"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Target range: 20-40% for stability
                </p>
              </div>
              <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg border border-yellow-700">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Gold Adjustment</h3>
                <p className="text-gray-300">
                  {goldPercent > 10 ? "Consider reducing by " + (goldPercent - 10) + "%" : "Consider increasing by " + (10 - goldPercent) + "%"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Recommended: 5-15% for diversification
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReset}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition duration-200"
              >
                Reset to Moderate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetAllocationCal;