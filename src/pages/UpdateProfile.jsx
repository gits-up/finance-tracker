import React, { useState } from "react";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    salary: "",
    expenditure: "",
    loan: "",
    healthInsurance: "",
    profile: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="bg-gray-700 p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-white text-sm">Name</label>
            <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
          </div>
          <div>
            <label className="text-white text-sm">Salary</label>
            <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
          </div>
          <div>
            <label className="text-white text-sm">Expenditure</label>
            <input type="number" name="expenditure" placeholder="Expenditure" value={formData.expenditure} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
          </div>
          <div>
            <label className="text-white text-sm">Loan</label>
            <input type="number" name="loan" placeholder="Loan" value={formData.loan} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
          </div>
          <div>
            <label className="text-white text-sm">Health Insurance</label>
            <input type="number" name="healthInsurance" placeholder="Health Insurance" value={formData.healthInsurance} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
          </div>
          <div className="col-span-2">
            <label className="text-white text-sm">Profile Picture</label>
            <input type="file" name="profile" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
