import React, { useState } from "react";

const Account = () => {
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(20000);
  const savings = income - expenses;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💳 Account Overview</h2>
      <div style={styles.card}>
        <label style={styles.label}>Monthly Income (₹):</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          style={styles.input}
        />

        <label style={styles.label}>Expenses (₹):</label>
        <input
          type="number"
          value={expenses}
          onChange={(e) => setExpenses(Number(e.target.value))}
          style={styles.input}
        />

        <p style={styles.savings}><strong>Savings:</strong> ₹{savings}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#1a1a1a",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
    width: "350px",
    textAlign: "center",
  },
  label: {
    display: "block",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    textAlign: "center",
  },
  savings: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: "10px",
  },
};

export default Account;
