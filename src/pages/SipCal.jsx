import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SIPCalculator = () => {
  const navigate = useNavigate();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualReturnRate, setAnnualReturnRate] = useState(12);
  const [investmentDuration, setInvestmentDuration] = useState(10);
  const [futureValue, setFutureValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, annualReturnRate, investmentDuration]);

  const calculateSIP = () => {
    const months = investmentDuration * 12;
    const monthlyRate = annualReturnRate / 100 / 12;
    
    // Calculate future value
    const fv = monthlyInvestment * 
              ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
              (1 + monthlyRate);
    
    // Calculate totals
    const totalInvested = monthlyInvestment * months;
    const returns = fv - totalInvested;
    
    setFutureValue(fv.toFixed(0));
    setTotalInvestment(totalInvested.toFixed(0));
    setEstimatedReturns(returns.toFixed(0));
    
    // Calculate yearly breakdown
    const breakdown = [];
    let currentValue = 0;
    
    for (let year = 1; year <= investmentDuration; year++) {
      for (let month = 1; month <= 12; month++) {
        currentValue = (currentValue + monthlyInvestment) * (1 + monthlyRate);
      }
      breakdown.push({
        year,
        invested: monthlyInvestment * 12 * year,
        value: currentValue.toFixed(0),
        returns: (currentValue - monthlyInvestment * 12 * year).toFixed(0)
      });
    }
    
    setYearlyData(breakdown);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
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
            Systematic Investment Plan Calculator
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Calculate the future value of your regular investments
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Investment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Monthly Investment (₹)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expected Annual Return Rate (%)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={annualReturnRate}
                    onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={annualReturnRate}
                    onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Investment Duration (Years)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={investmentDuration}
                    onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={investmentDuration}
                    onChange={(e) => setInvestmentDuration(Number(e.target.value))}
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
                  <span className="text-gray-300">Invested Amount</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(totalInvestment)}</span>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Estimated Returns</span>
                  <span className="text-xl font-bold text-green-400">{formatCurrency(estimatedReturns)}</span>
                </div>
              </div>

              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Value</span>
                  <span className="text-2xl font-bold text-blue-400">{formatCurrency(futureValue)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition duration-200"
                >
                  {showYearlyBreakdown ? 'Hide' : 'Show'} Yearly Breakdown
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Breakdown */}
        {showYearlyBreakdown && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Yearly Investment Growth</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Invested
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Returns
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {yearlyData.map((data) => (
                    <tr key={data.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {data.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(data.invested)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                        {formatCurrency(data.returns)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                        {formatCurrency(data.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Investment Insights */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Investment Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Power of Compounding</h3>
              <p className="text-gray-300 text-sm">
                Your investment could grow to {formatCurrency(futureValue)} in {investmentDuration} years, 
                with returns of {formatCurrency(estimatedReturns)} on your total investment of {formatCurrency(totalInvestment)}.
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">SIP Benefits</h3>
              <p className="text-gray-300 text-sm">
                SIP helps in rupee cost averaging and compounding returns over time. 
                Even small regular investments can grow significantly with discipline and time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;