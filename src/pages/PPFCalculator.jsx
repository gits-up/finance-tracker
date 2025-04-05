import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PPFCalculator = () => {
  const navigate = useNavigate();
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [interestRate, setInterestRate] = useState(7.1);
  const [investmentPeriod, setInvestmentPeriod] = useState(15);
  const [results, setResults] = useState(null);

  const calculatePPF = () => {
    let totalInvestment = 0;
    let totalInterest = 0;
    let maturityValue = 0;
    const yearlyData = [];

    let balance = 0;
    for (let year = 1; year <= investmentPeriod; year++) {
      const yearlyInterest = (balance + yearlyInvestment) * (interestRate / 100);
      balance += yearlyInvestment + yearlyInterest;
      totalInvestment += yearlyInvestment;
      totalInterest += yearlyInterest;

      yearlyData.push({
        year,
        investment: yearlyInvestment,
        interest: yearlyInterest,
        balance
      });
    }

    maturityValue = balance;

    setResults({
      totalInvestment,
      totalInterest,
      maturityValue,
      yearlyData
    });
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
            PPF (Public Provident Fund) Calculator
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Calculate your PPF investment returns with compound interest
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Investment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Yearly Investment (₹)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="500"
                    max="150000"
                    step="500"
                    value={yearlyInvestment}
                    onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={yearlyInvestment}
                    onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  (Minimum ₹500, Maximum ₹1.5 lakh)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  PPF Interest Rate (% p.a.)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
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
                    max="50"
                    step="1"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                    className="mt-2 w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  (Minimum 15 years recommended for full benefit)
                </p>
              </div>

              <button
                onClick={calculatePPF}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
              >
                Calculate
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">PPF Projection</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Maturity Value</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {formatCurrency(results.maturityValue)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Investment</span>
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(results.totalInvestment)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Interest Earned</span>
                    <span className="text-xl font-bold text-green-400">
                      {formatCurrency(results.totalInterest)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Yearly Breakdown</h3>
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Investment</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Interest</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {results.yearlyData.map((data) => (
                          <tr key={data.year}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-white">{data.year}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-white">{formatCurrency(data.investment)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-green-400">{formatCurrency(data.interest)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-400">{formatCurrency(data.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Enter your investment details and click Calculate</p>
                <p>to see your PPF projection</p>
              </div>
            )}
          </div>
        </div>

        {/* PPF Information */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">About PPF</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">PPF Benefits</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Tax-free returns under Section 80C</li>
                <li>• Safe government-backed investment</li>
                <li>• Long-term wealth creation</li>
                <li>• Loan facility available from 3rd year</li>
              </ul>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Minimum investment: ₹500 per year</li>
                <li>• Maximum investment: ₹1.5 lakh per year</li>
                <li>• Lock-in period: 15 years (extendable)</li>
                <li>• Current interest rate: 7.1% (compounded annually)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPFCalculator;