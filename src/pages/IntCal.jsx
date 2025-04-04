import { useState } from "react";

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [time, setTime] = useState(0);
  const [interest, setInterest] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateInterest = () => {
    const calculatedInterest = (principal * rate * time) / 100;
    setInterest(calculatedInterest);
    setTotal(parseFloat(principal) + calculatedInterest);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Simple Interest Calculator</h2>
        <div className="mb-3">
          <label className="block mb-1">Principal Amount</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Rate of Interest (%)</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Time (years)</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button
          onClick={calculateInterest}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Calculate
        </button>
        <div className="mt-4">
          <p>Interest: <span className="font-bold">${interest.toFixed(2)}</span></p>
          <p>Total Amount: <span className="font-bold">${total.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
}
