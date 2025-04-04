import { processQuery } from "./market-data";

export const getMarketData = async (query) => {
  try {
    const result = await processQuery(query);

    // Handle error cases
    if (!result) {
      return {
        type: "error",
        message: "❌ No data returned from the API"
      };
    }

    if (result.error) {
      return {
        type: "error",
        message: result.error,
        suggestions: result.suggestions || []
      };
    }

    // Check for the correct data structure
    if (!result.formattedCurrentData || !result.formattedHistoricalData) {
      return {
        type: "error",
        message: "❌ Invalid data format received from API"
      };
    }

    const { formattedCurrentData, formattedHistoricalData } = result;

    // Format summary as a table
    const summaryTable = `
| Metric          | Value                     |
|-----------------|--------------------------|
| Ticker          | ${formattedCurrentData.summary.ticker} (${formattedCurrentData.summary.exchange}) |
| Last Price      | ${formattedCurrentData.summary.lastPrice}      |
| Change          | ${formattedCurrentData.summary.change >= 0 ? '+' : ''}${formattedCurrentData.summary.change.toFixed(2)} (${formattedCurrentData.summary.changePercent >= 0 ? '+' : ''}${formattedCurrentData.summary.changePercent.toFixed(2)}%) |
| Volume          | ${(formattedCurrentData.summary.volume / (formattedCurrentData.summary.exchange === 'NSE' ? 100000 : 1000000)).toFixed(2)}${formattedCurrentData.summary.exchange === 'NSE' ? 'L' : 'M'} |
`;

    // Format historical data as a table
    const historicalTable = `
### Last ${formattedHistoricalData.length} Days Performance
| Date       | Open     | High     | Low      | Close    | Change   | Change % | Volume   |
|------------|----------|----------|----------|----------|----------|----------|----------|
${formattedHistoricalData.map(item => 
  `| ${item.Date} | ${item.Open} | ${item.High} | ${item.Low} | ${item.Close} | ${item.Change} | ${item['Change %']} | ${item.Volume} |`
).join('\n')}
`;

    return {
      type: "market-data",
      message: summaryTable + historicalTable,
      rawData: result
    };
  } catch (error) {
    return {
      type: "error",
      message: `❌ Failed to fetch market data: ${error.message}`
    };
  }
};