import React, { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    salary: "",
    expenditure: "",
    loan: "",
    healthInsurance: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "profile") {
      setProfileImage(e.target.files[0]);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let profileImageUrl = "";

      // ✅ Upload image to Cloudinary if selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);
        formData.append("upload_preset", "finance");
        formData.append("cloud_name", "dbcqfrkw7");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dbcqfrkw7/image/upload",
          formData
        );

        profileImageUrl = res.data.secure_url;
      }

      // ✅ Save user data to Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        ...formData,
        profileImageUrl,
        email: auth.currentUser.email,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }

    setUploading(false);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="bg-gray-700 p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-white text-lg font-semibold mb-4 text-center">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-white text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-white text-sm">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Monthly Salary"
            />
          </div>
          <div>
            <label className="text-white text-sm">Expenditure</label>
            <input
              type="number"
              name="expenditure"
              value={formData.expenditure}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Monthly Expenses"
            />
          </div>
          <div>
            <label className="text-white text-sm">Loan</label>
            <input
              type="number"
              name="loan"
              value={formData.loan}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Loan Amount"
            />
          </div>
          <div>
            <label className="text-white text-sm">Health Insurance</label>
            <input
              type="number"
              name="healthInsurance"
              value={formData.healthInsurance}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Insurance Premium"
            />
          </div>
          <div className="col-span-2">
            <label className="text-white text-sm">Profile Picture</label>
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
            >
              {uploading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
