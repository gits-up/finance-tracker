export const getMarketAnalysis = async () => {
    try {
        const ANALYZE_URL = 'http://localhost:5000/analyze';
        
        console.log('[Market Analysis] Starting analysis of all datasets');
        
        const response = await fetch(ANALYZE_URL);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Analysis service unavailable');
        }

        const analysisData = await response.json();
        
        if (!analysisData?.analysis?.all_stocks?.length) {
            throw new Error('No market analysis data available');
        }
        
        return {
            type: "success",
            message: formatAnalysis(analysisData.analysis),
            rawData: analysisData,
            isHTML: true
        };

    } catch (error) {
        console.error('[Analysis Error]', error);
        return {
            type: "error",
            message: formatAnalysisError(error),
            isHTML: false
        };
    }
};

function formatAnalysis(analysis) {
    const availableStocks = analysis.all_stocks || [];
    const recommendedStocks = analysis.recommended || [];

    return `
        <div class="market-analysis">
            <div class="datasets-card">
                <h2>📂 Available Datasets</h2>
                <div class="ticker-grid">
                    ${availableStocks.map(stock => `
                        <span class="ticker">
                            ${stock.ticker}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            ${recommendedStocks.length > 0 ? `
                <div class="recommendations-card">
                    <h2>⭐ Recommended Stocks</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Projected Return</th>
                                <th>Volatility</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recommendedStocks.map(stock => `
                                <tr>
                                    <td>${stock.ticker}</td>
                                    <td class="${stock.return_percent >= 0 ? 'positive' : 'negative'}">
                                        ${stock.return_percent >= 0 ? '+' : ''}${stock.return_percent.toFixed(2)}%
                                    </td>
                                    <td>${stock.volatility.toFixed(2)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        </div>
    `;
}

function formatAnalysisError(error) {
    const message = error.message || 'Unknown error occurred';
    
    if (message.includes('No market analysis')) {
        return '❌ No market analysis data available';
    }
    
    if (message.includes('timeout') || message.includes('Failed to fetch')) {
        return '❌ Analysis service unavailable. Please try again later.';
    }
    
    return `❌ Analysis error: ${message}`;
}