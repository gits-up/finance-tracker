import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdvancedGoalCal = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Retirement",
      targetAmount: 5000000,
      years: 30,
      priority: "High",
      inflationAdjusted: true,
      completed: false
    }
  ]);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    years: "",
    priority: "Medium",
    inflationAdjusted: true
  });
  const [currentSavings, setCurrentSavings] = useState(1000000);
  const [expectedReturns, setExpectedReturns] = useState(8);
  const [inflationRate, setInflationRate] = useState(6);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate required monthly investment for each goal
  const calculateGoalPlan = () => {
    return goals.map(goal => {
      const years = goal.years;
      const realRateOfReturn = (1 + expectedReturns/100)/(1 + inflationRate/100) - 1;
      const realRatePercent = realRateOfReturn * 100;
      const futureValue = goal.inflationAdjusted ? 
        goal.targetAmount / Math.pow(1 + inflationRate/100, years) :
        goal.targetAmount;
      
      const monthlyRate = realRatePercent / 100 / 12;
      const months = years * 12;
      
      let monthlySIP = 0;
      if (months > 0 && monthlyRate > 0) {
        monthlySIP = futureValue * monthlyRate / 
                    (Math.pow(1 + monthlyRate, months) - 1);
      }

      return {
        ...goal,
        monthlySIP: monthlySIP,
        futureValue: futureValue,
        realRateOfReturn: realRatePercent
      };
    });
  };

  const [calculatedGoals, setCalculatedGoals] = useState(calculateGoalPlan());

  useEffect(() => {
    setCalculatedGoals(calculateGoalPlan());
  }, [goals, currentSavings, expectedReturns, inflationRate]);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.years) {
      const goal = {
        id: Date.now(),
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        years: Number(newGoal.years),
        priority: newGoal.priority,
        inflationAdjusted: newGoal.inflationAdjusted,
        completed: false
      };
      setGoals([...goals, goal]);
      setNewGoal({
        name: "",
        targetAmount: "",
        years: "",
        priority: "Medium",
        inflationAdjusted: true
      });
    }
  };

  const handleRemoveGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const toggleGoalCompletion = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? {...goal, completed: !goal.completed} : goal
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const totalMonthlyInvestment = calculatedGoals.reduce(
    (sum, goal) => sum + (goal.completed ? 0 : goal.monthlySIP || 0), 0
  );

  const handleGoBack = () => {
    navigate(-1);
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
            Advanced Goal Planner
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Plan and track all your financial goals in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Goal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  placeholder="e.g. Retirement, House, Education"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  placeholder="5000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Years to Goal
                </label>
                <input
                  type="number"
                  value={newGoal.years}
                  onChange={(e) => setNewGoal({...newGoal, years: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inflationAdjusted"
                  checked={newGoal.inflationAdjusted}
                  onChange={(e) => setNewGoal({...newGoal, inflationAdjusted: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="inflationAdjusted" className="text-sm text-gray-300">
                  Inflation Adjusted
                </label>
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
              >
                Add Goal
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-white">Assumptions</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Savings (₹)
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Inflation Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Goals List */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Your Financial Goals</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition duration-200"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {calculatedGoals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No goals added yet. Add your first financial goal to get started.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 font-semibold text-gray-300 border-b border-gray-700 pb-2">
                  <div className="col-span-4">Goal</div>
                  <div className="col-span-2 text-right">Target</div>
                  <div className="col-span-2 text-right">Monthly SIP</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {calculatedGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className={`grid grid-cols-12 gap-2 items-center p-2 rounded ${goal.completed ? 'bg-gray-700 opacity-70' : 'bg-gray-800'}`}
                  >
                    <div className="col-span-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleGoalCompletion(goal.id)}
                        className="mr-2"
                      />
                      <span className={goal.completed ? 'line-through' : ''}>{goal.name}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      {formatCurrency(goal.targetAmount)}
                    </div>
                    <div className="col-span-2 text-right">
                      {goal.completed ? (
                        <span className="text-green-400">Achieved</span>
                      ) : (
                        formatCurrency(goal.monthlySIP)
                      )}
                    </div>
                    <div className="col-span-2">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-bold bg-${getPriorityColor(goal.priority)}-900 text-${getPriorityColor(goal.priority)}-300`}
                      >
                        {goal.priority}
                      </span>
                    </div>
                    <div className="col-span-2 flex space-x-2">
                      <button
                        onClick={() => handleRemoveGoal(goal.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    {showDetails && (
                      <div className="col-span-12 mt-2 p-2 bg-gray-700 rounded text-sm">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-gray-400">Years:</div>
                            <div>{goal.years}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Real Return:</div>
                            <div>{goal.realRateOfReturn.toFixed(2)}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Inflation Adjusted:</div>
                            <div>{goal.inflationAdjusted ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-white">
                      Total Monthly Investment:
                    </div>
                    <div className="text-xl font-bold text-blue-400">
                      {formatCurrency(totalMonthlyInvestment)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedGoalCal;