import { processQuery } from "./market-data";

export const getMarketData = async (query) => {
  try {
    const result = await processQuery(query);

    // Handle error cases
    if (!result) {
      return {
        type: "error",
        message: "❌ No data returned from the API",
      };
    }

    if (result.error) {
      return {
        type: "error",
        message: result.error,
        suggestions: result.suggestions || [],
      };
    }

    // Check for the correct data structure
    if (!result.formattedCurrentData || !result.formattedHistoricalData) {
      return {
        type: "error",
        message: "❌ Invalid data format received from API",
      };
    }

    const { formattedCurrentData, formattedHistoricalData } = result;

    // Format summary as a table
    const summaryTable = `
    <h2>📊 Stock Summary</h2>
    <table class="summary-table">
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Ticker</td><td>${formattedCurrentData.summary.ticker} (${
      formattedCurrentData.summary.exchange
    })</td></tr>
      <tr><td>Last Price</td><td>${
        formattedCurrentData.summary.lastPrice
      }</td></tr>
      <tr><td>Change</td><td class="${
        formattedCurrentData.summary.change >= 0 ? "positive" : "negative"
      }">
        ${
          formattedCurrentData.summary.change >= 0 ? "+" : ""
        }${formattedCurrentData.summary.change.toFixed(2)} 
        (${
          formattedCurrentData.summary.changePercent >= 0 ? "+" : ""
        }${formattedCurrentData.summary.changePercent.toFixed(2)}%)
      </td></tr>
      <tr><td>Volume</td><td>
        ${(
          formattedCurrentData.summary.volume /
          (formattedCurrentData.summary.exchange === "NSE" ? 100000 : 1000000)
        ).toFixed(2)}
        ${formattedCurrentData.summary.exchange === "NSE" ? "L" : "M"}
      </td></tr>
    </table>
  `;

    // Format historical data as a table
    const historicalTable = `
    <h2>📈 Last ${formattedHistoricalData.length} Days Performance</h2>
    <table class="historical-table">
      <thead>
        <tr>
          <th>Date</th><th>Open</th><th>High</th><th>Low</th>
          <th>Close</th><th>Change</th><th>Change %</th><th>Volume</th>
        </tr>
      </thead>
      <tbody>
        ${formattedHistoricalData
          .map(
            (item) => `
          <tr>
            <td>${item.Date}</td>
            <td>${item.Open}</td>
            <td>${item.High}</td>
            <td>${item.Low}</td>
            <td>${item.Close}</td>
            <td>${item.Change}</td>
            <td>${item["Change %"]}</td>
            <td>${item.Volume}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

    const styles = `
<style>
  .market-card {
    background: linear-gradient(135deg, #6a0dad, #8e2de2);
    color: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-family: 'Segoe UI', sans-serif;
    overflow-x: auto;
    max-width: 100%;
  }

  .market-card h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #ffe600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .market-card h2::before {
    content: "📈";
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
    table-layout: fixed;
  }

  th, td {
    padding: 8px 6px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #f0f0f0;
    word-wrap: break-word;
  }

  th {
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: 600;
  }

  td.positive {
    color: #00ff90;
    font-weight: bold;
  }

  td.negative {
    color: #ff5e5e;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .market-card {
      padding: 16px;
    }

    table, thead, tbody, th, td, tr {
      display: block;
    }

    th {
      display: none;
    }

    td {
      position: relative;
      padding-left: 50%;
      text-align: left;
      font-size: 12px;
    }

    td::before {
      position: absolute;
      top: 8px;
      left: 10px;
      width: 45%;
      font-weight: bold;
      white-space: nowrap;
      content: attr(data-label);
      color: #ffe600;
    }
  }
</style>
`;

    return {
      type: "market-data",
      message: summaryTable + historicalTable + styles,
      rawData: result,
      isHTML: true,
    };
  } catch (error) {
    return {
      type: "error",
      message: `❌ Failed to fetch market data: ${error.message}`,
    };
  }
};
