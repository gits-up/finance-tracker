import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RetirementCal = () => {
  const navigate = useNavigate();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(1000000);
  const [expectedReturns, setExpectedReturns] = useState(8);
  const [retirementCorpus, setRetirementCorpus] = useState(0);
  const [monthlySIP, setMonthlySIP] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, monthlyExpenses, inflationRate, currentSavings, expectedReturns]);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const retirementYears = 90 - retirementAge; // Assuming lifespan of 90 years
    
    // Calculate future monthly expenses adjusted for inflation
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement);
    
    // Calculate retirement corpus needed (25x annual expenses as per 4% rule)
    const corpus = futureMonthlyExpenses * 12 * 25;
    setRetirementCorpus(corpus.toFixed(0));
    
    // Calculate monthly SIP needed
    const monthlyRate = expectedReturns / 100 / 12;
    const months = yearsToRetirement * 12;
    
    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, months);
    const remainingCorpus = corpus - futureValueOfCurrentSavings;
    
    const sip = remainingCorpus * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlySIP(sip > 0 ? sip.toFixed(0) : 0);
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
            Retirement Planner
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Calculate how much you need to save for a comfortable retirement
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Your Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Age: {currentAge} years
                </label>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Retirement Age: {retirementAge} years
                </label>
                <input
                  type="range"
                  min={currentAge + 1}
                  max="80"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Monthly Expenses (₹)
                </label>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expected Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Retirement Savings (₹)
                </label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expected Returns (% p.a.)
                </label>
                <input
                  type="number"
                  value={expectedReturns}
                  onChange={(e) => setExpectedReturns(Number(e.target.value))}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Retirement Plan</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Retirement Corpus Needed</span>
                  <span className="text-2xl font-bold text-blue-400">{formatCurrency(retirementCorpus)}</span>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monthly SIP Required</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(monthlySIP)}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition duration-200"
                >
                  {showDetails ? 'Hide Details' : 'Show Detailed Calculation'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Calculation */}
        {showDetails && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Retirement Plan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Assumptions</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Retirement duration: {90 - retirementAge} years (up to age 90)</li>
                  <li>• 4% safe withdrawal rate (25x annual expenses)</li>
                  <li>• Inflation-adjusted returns: {expectedReturns - inflationRate}%</li>
                </ul>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Key Metrics</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Years to retirement: {retirementAge - currentAge} years</li>
                  <li>• Future monthly expenses: {formatCurrency(monthlyExpenses * Math.pow(1 + inflationRate/100, retirementAge - currentAge))}</li>
                  <li>• Annual expenses at retirement: {formatCurrency(monthlyExpenses * 12 * Math.pow(1 + inflationRate/100, retirementAge - currentAge))}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementCal;