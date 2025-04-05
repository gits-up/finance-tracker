import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LumpSumCal = () => {
  const navigate = useNavigate();
  const [principal, setPrincipal] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(5);
  const [futureValue, setFutureValue] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    calculateLumpsum();
  }, [principal, annualReturn, years]);

  const calculateLumpsum = () => {
    const rate = annualReturn / 100;
    const fv = principal * Math.pow(1 + rate, years);
    const returns = fv - principal;

    setFutureValue(fv.toFixed(2));
    setTotalReturns(returns.toFixed(2));

    // Calculate yearly breakdown
    const breakdown = [];
    let currentValue = principal;

    for (let year = 1; year <= years; year++) {
      currentValue = currentValue * (1 + rate);
      breakdown.push({
        year,
        value: currentValue.toFixed(2),
        returns: (currentValue - principal).toFixed(2)
      });
    }

    setYearlyBreakdown(breakdown);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
            Lumpsum Investment Calculator
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Calculate the future value of your one-time investment
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Investment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Initial Investment (₹)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expected Annual Return (%)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Investment Period (Years)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Projected Returns</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Initial Investment</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(principal)}</span>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Estimated Returns</span>
                  <span className="text-xl font-bold text-green-400">{formatCurrency(totalReturns)}</span>
                </div>
              </div>

              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Future Value</span>
                  <span className="text-2xl font-bold text-blue-400">{formatCurrency(futureValue)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition duration-200"
                >
                  {showBreakdown ? 'Hide' : 'Show'} Yearly Breakdown
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Breakdown */}
        {showBreakdown && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Yearly Growth</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Returns</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {yearlyBreakdown.map((data) => (
                    <tr key={data.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{data.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{formatCurrency(data.value)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(data.returns)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LumpSumCal;