const CONFIG = {
  API_KEY: 'QG1YH3ZI7S4AJTRH', 
  INDIAN_EXCHANGE: 'NSE',
  FOREIGN_EXCHANGE: 'NYSE',
  CURRENCY: {
    INDIAN: '₹',
    FOREIGN: '$'
  }
};

const STOCK_DATABASE = {
  INDIAN: {
    'reliance': 'RELIANCE.BSE',
    'tata motors': 'TATAMOTORS.BSE',
    'infosys': 'INFY.BSE',
    'tcs': 'TCS.BSE',
    'hdfc bank': 'HDFCBANK.BSE',
    'icici bank': 'ICICIBANK.BSE',
    'sbi': 'SBIN.BSE',
    'itc': 'ITC.BSE',
    'asian paints': 'ASIANPAINT.BSE',
    'bajaj finance': 'BAJFINANCE.BSE',
    'hindustan unilever': 'HINDUNILVR.BSE',
    'kotak mahindra bank': 'KOTAKBANK.BSE',
    'axis bank': 'AXISBANK.BSE',
    'maruti suzuki': 'MARUTI.BSE',
    'sun pharma': 'SUNPHARMA.BSE',
    'wipro': 'WIPRO.BSE',
    'adani ports': 'ADANIPORTS.BSE',
    'bharti airtel': 'BHARTIARTL.BSE',
    'ultra tech cement': 'ULTRACEMCO.BSE',
    'nestle india': 'NESTLEIND.BSE'
  },
  FOREIGN: {
    'microsoft': 'MSFT',
    'apple': 'AAPL',
    'amazon': 'AMZN',
    'alphabet': 'GOOGL',
    'google': 'GOOGL',
    'meta': 'META',
    'facebook': 'META',
    'tesla': 'TSLA',
    'nvidia': 'NVDA',
    'netflix': 'NFLX',
    'berkshire hathaway': 'BRK-B',
    'jpmorgan': 'JPM',
    'visa': 'V',
    'walmart': 'WMT',
    'disney': 'DIS',
    'coca cola': 'KO',
    'pepsi': 'PEP',
    'mcdonalds': 'MCD',
    'starbucks': 'SBUX',
    'intel': 'INTC',
    'amd': 'AMD',
    'ibm': 'IBM',
    'oracle': 'ORCL',
    'samsung': '005930.KS',
    'sony': 'SONY',
    'toyota': 'TM',
    'ford': 'F',
    'general motors': 'GM'
  }
};

// Debug helper
function debugLog(message, data) {
  console.log(`[DEBUG] ${message}`, data);
}

function detectTicker(query) {
  if (!query || typeof query !== 'string') {
    debugLog('Invalid query:', query);
    return null;
  }

  const lowerQuery = query.toLowerCase().trim();
  debugLog('Processing query:', lowerQuery);

  // Exact match
  if (STOCK_DATABASE.INDIAN[lowerQuery]) {
    return {
      ticker: STOCK_DATABASE.INDIAN[lowerQuery],
      market: 'INDIAN'
    };
  }

  if (STOCK_DATABASE.FOREIGN[lowerQuery]) {
    return {
      ticker: STOCK_DATABASE.FOREIGN[lowerQuery],
      market: 'FOREIGN'
    };
  }

  // Partial match
  const indianMatches = Object.entries(STOCK_DATABASE.INDIAN)
    .filter(([name]) => name.includes(lowerQuery));

  const foreignMatches = Object.entries(STOCK_DATABASE.FOREIGN)
    .filter(([name]) => name.includes(lowerQuery));

  const allMatches = [...indianMatches, ...foreignMatches];
  debugLog('Partial matches found:', allMatches);

  if (allMatches.length === 1) {
    return {
      ticker: allMatches[0][1],
      market: indianMatches.length === 1 ? 'INDIAN' : 'FOREIGN'
    };
  }

  return null;
}

async function getStockData(ticker, market) {
  try {
    const symbol = ticker;
    debugLog('Fetching stock data for:', { symbol, market });

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${CONFIG.API_KEY}`;
    debugLog('API URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      debugLog('API response not OK:', {
        status: response.status,
        statusText: response.statusText
      });
      return null;
    }

    const data = await response.json();

    if (!data['Time Series (Daily)']) {
      debugLog('Invalid data format from API:', data);
      return null;
    }

    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));

    // Current stock data (latest day)
    const latestDate = dates[0];
    const latestData = timeSeries[latestDate];

    const currentStockData = {
      date: new Date(latestDate),
      open: parseFloat(latestData['1. open']),
      high: parseFloat(latestData['2. high']),
      low: parseFloat(latestData['3. low']),
      close: parseFloat(latestData['4. close']),
      volume: parseFloat(latestData['5. volume'])
    };

    // Last 30 days' stock data
    const historicalStockData = dates.slice(0, 30).map(date => ({
      date: new Date(date),
      open: parseFloat(timeSeries[date]['1. open']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
      close: parseFloat(timeSeries[date]['4. close']),
      volume: parseFloat(timeSeries[date]['5. volume'])
    }));

    debugLog('Successfully processed stock data', { currentStockData, historicalStockData });
    return { currentStockData, historicalStockData };
  } catch (error) {
    debugLog('Error fetching stock data:', { ticker, market, error: error.message });
    return null;
  }
}

function formatData(data, ticker, market) {
  if (!data) {
    debugLog('No data to format:', { ticker, market });
    return null;
  }

  try {
    const currency = market === 'INDIAN' ? CONFIG.CURRENCY.INDIAN : CONFIG.CURRENCY.FOREIGN;
    const volumeDivisor = market === 'INDIAN' ? 100000 : 1000000;
    const volumeUnit = market === 'INDIAN' ? 'L' : 'M';

    // Format current stock data
    const currentData = data.currentStockData;
    const formattedCurrentData = {
      summary: {
        ticker,
        exchange: market === 'INDIAN' ? CONFIG.INDIAN_EXCHANGE : CONFIG.FOREIGN_EXCHANGE,
        lastPrice: currentData.close,
        change: currentData.close - currentData.open,
        changePercent: ((currentData.close - currentData.open) / currentData.open) * 100,
        volume: currentData.volume
      },
      dailyData: {
        Date: currentData.date.toLocaleDateString('en-US'),
        Open: `${currency}${currentData.open.toFixed(2)}`,
        High: `${currency}${currentData.high.toFixed(2)}`,
        Low: `${currency}${currentData.low.toFixed(2)}`,
        Close: `${currency}${currentData.close.toFixed(2)}`,
        Change: `${(currentData.close - currentData.open).toFixed(2)}`,
        'Change %': `${(((currentData.close - currentData.open) / currentData.open) * 100).toFixed(2)}%`,
        Volume: `${(currentData.volume / volumeDivisor).toFixed(2)}${volumeUnit}`
      }
    };

    // Format historical stock data
    const formattedHistoricalData = data.historicalStockData.map(item => ({
      Date: item.date.toLocaleDateString('en-US'),
      Open: `${currency}${item.open.toFixed(2)}`,
      High: `${currency}${item.high.toFixed(2)}`,
      Low: `${currency}${item.low.toFixed(2)}`,
      Close: `${currency}${item.close.toFixed(2)}`,
      Change: `${(item.close - item.open).toFixed(2)}`,
      'Change %': `${(((item.close - item.open) / item.open) * 100).toFixed(2)}%`,
      Volume: `${(item.volume / volumeDivisor).toFixed(2)}${volumeUnit}`
    }));

    debugLog('Formatted data successfully', { formattedCurrentData, formattedHistoricalData });
    return { formattedCurrentData, formattedHistoricalData };
  } catch (error) {
    debugLog('Error formatting data:', error.message);
    return null;
  }
}

async function processQuery(query) {
  debugLog('Processing query:', query);

  const stockInfo = detectTicker(query);
  if (!stockInfo) {
    debugLog('Stock not found in database:', query);
    return {
      error: 'Type the name of the company you want to know about',
      suggestions: Object.keys(STOCK_DATABASE.INDIAN).concat(Object.keys(STOCK_DATABASE.FOREIGN))
    };
  }

  const { ticker, market } = stockInfo;
  debugLog('Stock identified:', { ticker, market });

  const stockData = await getStockData(ticker, market);

  if (!stockData) {
    debugLog('Failed to get stock data for:', { ticker, market });
    return {
      error: 'Failed to fetch stock data',
      ticker,
      market
    };
  }

  return formatData(stockData, ticker, market);
}

// Export as ES modules
export { detectTicker, getStockData, formatData, processQuery };