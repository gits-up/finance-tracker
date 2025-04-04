import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdvancedTaxCalculator() {
  const navigate = useNavigate();
  // Income information
  const [filingStatus, setFilingStatus] = useState("single");
  const [income, setIncome] = useState(0);
  
  // Deduction information
  const [stateLocalTaxes, setStateLocalTaxes] = useState(0);
  const [mortgageInterest, setMortgageInterest] = useState(0);
  const [charitableContributions, setCharitableContributions] = useState(0);
  const [medicalExpenses, setMedicalExpenses] = useState(0);
  
  // Above-the-line deductions
  const [studentLoanInterest, setStudentLoanInterest] = useState(0);
  const [iraContributions, setIraContributions] = useState(0);
  const [educatorExpenses, setEducatorExpenses] = useState(0);
  
  // Results
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxOwed, setTaxOwed] = useState(0);
  const [recommendedDeduction, setRecommendedDeduction] = useState("");
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [totalAboveTheLine, setTotalAboveTheLine] = useState(0);

  const STANDARD_DEDUCTIONS = {
    single: 12950,
    married: 25900,
    headOfHousehold: 19400
  };

  const calculateTax = () => {
    // Calculate above-the-line deductions (always subtracted)
    const aboveTheLineDeductions = Math.min(2500, studentLoanInterest) + 
                                 iraContributions + 
                                 educatorExpenses;
    setTotalAboveTheLine(aboveTheLineDeductions);

    // Calculate itemized deductions
    const saltDeduction = Math.min(10000, stateLocalTaxes);
    const medicalDeduction = Math.max(0, medicalExpenses - (income * 0.075));
    
    const itemizedDeductions = saltDeduction + 
                             mortgageInterest + 
                             charitableContributions + 
                             medicalDeduction;

    // Determine standard vs itemized
    const standardDeduction = STANDARD_DEDUCTIONS[filingStatus];
    const deductionToUse = Math.max(standardDeduction, itemizedDeductions);
    
    setDeductionAmount(deductionToUse);
    setRecommendedDeduction(deductionToUse === standardDeduction ? "Standard" : "Itemized");

    // Calculate taxable income
    const calculatedTaxableIncome = Math.max(0, income - aboveTheLineDeductions - deductionToUse);
    setTaxableIncome(calculatedTaxableIncome);

    // Simplified tax calculation (would use tax brackets in real app)
    const taxRate = getTaxRate(filingStatus, calculatedTaxableIncome);
    const calculatedTax = calculatedTaxableIncome * (taxRate / 100);
    setTaxOwed(calculatedTax);
  };

  // Simplified tax rate lookup (would use actual tax brackets in production)
  const getTaxRate = (status, taxableIncome) => {
    if (status === "single") {
      if (taxableIncome <= 10275) return 10;
      if (taxableIncome <= 41775) return 12;
      if (taxableIncome <= 89075) return 22;
      if (taxableIncome <= 170050) return 24;
      if (taxableIncome <= 215950) return 32;
      if (taxableIncome <= 539900) return 35;
      return 37;
    } else { // married filing jointly
      if (taxableIncome <= 20550) return 10;
      if (taxableIncome <= 83550) return 12;
      if (taxableIncome <= 178150) return 22;
      if (taxableIncome <= 340100) return 24;
      if (taxableIncome <= 431900) return 32;
      if (taxableIncome <= 647850) return 35;
      return 37;
    }
  };

  const resetForm = () => {
    setIncome(0);
    setStateLocalTaxes(0);
    setMortgageInterest(0);
    setCharitableContributions(0);
    setMedicalExpenses(0);
    setStudentLoanInterest(0);
    setIraContributions(0);
    setEducatorExpenses(0);
    setTaxableIncome(0);
    setTaxOwed(0);
  };

  const handleReturn = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">Advanced Tax Return Calculator</h2>
          <button
            onClick={handleReturn}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Return
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Income Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">Income Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Filing Status</label>
              <select
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
              >
                <option value="single" className="bg-gray-800">Single</option>
                <option value="married" className="bg-gray-800">Married Filing Jointly</option>
                <option value="headOfHousehold" className="bg-gray-800">Head of Household</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Annual Income ($)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2 mt-6">Above-the-Line Deductions</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Student Loan Interest (max $2,500)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={studentLoanInterest}
                onChange={(e) => setStudentLoanInterest(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">IRA Contributions ($)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={iraContributions}
                onChange={(e) => setIraContributions(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Educator Expenses ($)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={educatorExpenses}
                onChange={(e) => setEducatorExpenses(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          {/* Right Column - Itemized Deductions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">Itemized Deductions</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">State & Local Taxes (max $10,000)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={stateLocalTaxes}
                onChange={(e) => setStateLocalTaxes(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mortgage Interest ($)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={mortgageInterest}
                onChange={(e) => setMortgageInterest(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Charitable Contributions ($)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={charitableContributions}
                onChange={(e) => setCharitableContributions(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Medical Expenses (over 7.5% of income)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                value={medicalExpenses}
                onChange={(e) => setMedicalExpenses(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex space-x-2 mt-6">
              <button
                onClick={calculateTax}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                Calculate
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {taxOwed > 0 && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-white border-b border-gray-500 pb-2 mb-3">Tax Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Recommended Deduction:</p>
                <p className="text-lg font-bold text-white">{recommendedDeduction} Deduction</p>
                
                <p className="text-sm text-gray-300 mt-2">Deduction Amount:</p>
                <p className="text-lg font-bold text-white">${deductionAmount.toLocaleString()}</p>
                
                <p className="text-sm text-gray-300 mt-2">Above-the-Line Deductions:</p>
                <p className="text-lg font-bold text-white">${totalAboveTheLine.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-300">Taxable Income:</p>
                <p className="text-lg font-bold text-white">${taxableIncome.toLocaleString()}</p>
                
                <p className="text-sm text-gray-300 mt-2">Estimated Tax Owed:</p>
                <p className="text-lg font-bold text-red-400">${taxOwed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}