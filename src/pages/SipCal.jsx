import React, { useState } from "react";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [investmentDuration, setInvestmentDuration] = useState(10);
  const [futureValue, setFutureValue] = useState(0);

  const calculateSIP = () => {
    const n = investmentDuration * 12; // Total months
    const r = annualReturnRate / 100 / 12; // Monthly interest rate
    const fv =
      monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setFutureValue(fv.toFixed(2));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">SIP Calculator</h2>
        <div className="mb-4">
          <label className="block text-white">Monthly Investment (₹)</label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="w-full p-2 border border-white rounded mt-1 bg-transparent text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Expected Annual Return Rate (%)</label>
          <input
            type="number"
            value={annualReturnRate}
            onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
            className="w-full p-2 border border-white rounded mt-1 bg-transparent text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Investment Duration (Years)</label>
          <input
            type="number"
            value={investmentDuration}
            onChange={(e) => setInvestmentDuration(Number(e.target.value))}
            className="w-full p-2 border border-white rounded mt-1 bg-transparent text-white"
          />
        </div>
        <button
          onClick={calculateSIP}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        {futureValue > 0 && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            <h3 className="text-lg font-bold">Future Value: ₹{futureValue}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIPCalculator;
