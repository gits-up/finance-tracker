import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GstCalculator = () => {
  const navigate = useNavigate();
  const [gstType, setGstType] = useState('regular');
  const [inputAmount, setInputAmount] = useState('');
  const [gstRate, setGstRate] = useState(18);
  const [calculationType, setCalculationType] = useState('exclusive');
  const [results, setResults] = useState(null);

  const gstRates = [
    { value: 0, label: '0% (Nil Rated)' },
    { value: 0.25, label: '0.25% (Rough Diamonds)' },
    { value: 3, label: '3% (Gold)' },
    { value: 5, label: '5%' },
    { value: 12, label: '12%' },
    { value: 18, label: '18%' },
    { value: 28, label: '28%' }
  ];

  const calculateGST = () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    let calculatedResults = {};
    const rate = gstRate / 100;

    if (calculationType === 'exclusive') {
      // GST is added to the base amount
      calculatedResults = {
        baseAmount: amount,
        cgst: (amount * rate) / 2,
        sgst: (amount * rate) / 2,
        igst: amount * rate,
        totalAmount: amount * (1 + rate)
      };
    } else {
      // GST is included in the amount
      calculatedResults = {
        baseAmount: amount / (1 + rate),
        cgst: (amount / (1 + rate)) * (rate / 2),
        sgst: (amount / (1 + rate)) * (rate / 2),
        igst: (amount / (1 + rate)) * rate,
        totalAmount: amount
      };
    }

    setResults(calculatedResults);
  };

  const handleReset = () => {
    setInputAmount('');
    setGstRate(18);
    setCalculationType('exclusive');
    setResults(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Indian GST Calculator
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Calculate GST amounts for your invoices
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Inputs */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">GST Registration Type</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="gstType"
                      value="regular"
                      checked={gstType === 'regular'}
                      onChange={() => setGstType('regular')}
                    />
                    <span className="ml-2">Regular (CGST + SGST)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="gstType"
                      value="composition"
                      checked={gstType === 'composition'}
                      onChange={() => setGstType('composition')}
                    />
                    <span className="ml-2">Composition Scheme</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Calculation Type</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="calculationType"
                      value="exclusive"
                      checked={calculationType === 'exclusive'}
                      onChange={() => setCalculationType('exclusive')}
                    />
                    <span className="ml-2">GST Exclusive</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-500"
                      name="calculationType"
                      value="inclusive"
                      checked={calculationType === 'inclusive'}
                      onChange={() => setCalculationType('inclusive')}
                    />
                    <span className="ml-2">GST Inclusive</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  {calculationType === 'exclusive' ? 'Base Amount (₹)' : 'Total Amount (₹)'}
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">GST Rate</label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={gstRate}
                  onChange={(e) => setGstRate(parseFloat(e.target.value))}
                >
                  {gstRates.map((rate) => (
                    <option key={rate.value} value={rate.value}>
                      {rate.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  onClick={calculateGST}
                >
                  Calculate GST
                </button>
                <button
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="bg-gray-750 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">GST Calculation Results</h3>
              
              {results ? (
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-300">Base Amount:</span>
                    <span className="font-medium">{formatCurrency(results.baseAmount)}</span>
                  </div>

                  {gstType === 'regular' ? (
                    <>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-300">CGST ({gstRate/2}%):</span>
                        <span className="font-medium">{formatCurrency(results.cgst)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-300">SGST ({gstRate/2}%):</span>
                        <span className="font-medium">{formatCurrency(results.sgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-300">IGST ({gstRate}%):</span>
                      <span className="font-medium">{formatCurrency(results.igst)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-300">Total GST:</span>
                    <span className="font-medium">
                      {formatCurrency(gstType === 'regular' ? (results.cgst + results.sgst) : results.igst)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-gray-300 font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(results.totalAmount)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Enter values and click "Calculate GST" to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GST Information Section */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">About Indian GST</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">GST Types</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <span className="font-medium">CGST</span>: Central GST (Collected by Central Govt.)</li>
                <li>• <span className="font-medium">SGST</span>: State GST (Collected by State Govt.)</li>
                <li>• <span className="font-medium">IGST</span>: Integrated GST (For inter-state transactions)</li>
                <li>• <span className="font-medium">UTGST</span>: Union Territory GST (For UTs without legislature)</li>
              </ul>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Common GST Rates</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• <span className="font-medium">0%</span>: Essential goods (food grains, milk, etc.)</li>
                <li>• <span className="font-medium">5%</span>: Household necessities (sugar, tea, edible oil)</li>
                <li>• <span className="font-medium">12%</span>: Processed foods, computers</li>
                <li>• <span className="font-medium">18%</span>: Most goods and services (standard rate)</li>
                <li>• <span className="font-medium">28%</span>: Luxury items (cars, tobacco, aerated drinks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GstCalculator;