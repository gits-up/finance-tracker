from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from pathlib import Path
import logging
from datetime import datetime
from typing import List, Dict, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Path configuration
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'data'

# Validate paths
if not DATA_DIR.exists():
    logger.error(f"Data directory not found at: {DATA_DIR}")
    raise FileNotFoundError(f"Data directory not found at: {DATA_DIR}")

logger.info(f"Found datasets: {os.listdir(DATA_DIR)}")

app = Flask(__name__)
CORS(app)

class MarketAnalyzer:
    @staticmethod
    def get_available_tickers() -> List[str]:
        """Get list of available tickers from data directory"""
        return [f.replace('.csv', '') for f in os.listdir(DATA_DIR) if f.endswith('.csv')]

    @staticmethod
    def load_data(ticker: str) -> pd.DataFrame:
        """Load historical data for given ticker"""
        file_path = DATA_DIR / f"{ticker}.csv"
        try:
            df = pd.read_csv(file_path)
            if len(df) < 30:
                raise ValueError(f"Insufficient data points ({len(df)}) for {ticker}")
            return df
        except Exception as e:
            logger.warning(f"Failed to load {ticker}: {str(e)}")
            raise

    @staticmethod
    def analyze_dataset(ticker: str) -> Dict[str, Union[str, float]]:
        """Analyze a single stock dataset"""
        try:
            df = MarketAnalyzer.load_data(ticker)
            
            # Calculate key metrics
            latest_close = df['Close'].iloc[-1]
            mean_close = df['Close'].mean()
            return_pct = ((latest_close - mean_close) / mean_close) * 100
            volatility = (df['High'] - df['Low']).mean() / df['Close'].mean() * 100
            
            return {
                'ticker': ticker,
                'return_percent': round(return_pct, 2),
                'volatility': round(volatility, 2),
                'last_close': round(latest_close, 2),
                'mean_close': round(mean_close, 2)
            }
        except Exception as e:
            logger.warning(f"Skipping {ticker} analysis: {str(e)}")
            raise

    @staticmethod
    def generate_market_analysis() -> Dict[str, List[Dict]]:
        """Generate comprehensive market analysis"""
        tickers = MarketAnalyzer.get_available_tickers()
        successful_analyses = []
        
        for ticker in tickers:
            try:
                analysis = MarketAnalyzer.analyze_dataset(ticker)
                successful_analyses.append(analysis)
            except:
                continue
        
        if not successful_analyses:
            raise ValueError("No datasets could be analyzed")
        
        # Sort by return percentage (descending)
        successful_analyses.sort(key=lambda x: x['return_percent'], reverse=True)
        
        return {
            'all_stocks': successful_analyses,
            'recommended': successful_analyses[:3]  # Top 3 performers
        }

@app.route('/analyze', methods=['GET'])
def analyze_market():
    """Endpoint for complete market analysis"""
    try:
        start_time = datetime.now()
        analysis = MarketAnalyzer.generate_market_analysis()
        
        logger.info(f"Analysis completed in {(datetime.now() - start_time).total_seconds():.2f}s")
        
        return jsonify({
            'status': 'success',
            'analysis': analysis,
            'analyzed_at': datetime.now().isoformat(),
            'datasets_analyzed': len(analysis['all_stocks'])
        })
        
    except Exception as e:
        logger.error(f"Market analysis failed: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': str(e),
            'available_datasets': MarketAnalyzer.get_available_tickers()
        }), 500

@app.route('/datasets', methods=['GET'])
def list_datasets():
    """Endpoint to list available datasets"""
    return jsonify({
        'status': 'success',
        'datasets': MarketAnalyzer.get_available_tickers(),
        'last_updated': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'available_datasets': MarketAnalyzer.get_available_tickers(),
        'service': 'market-analyzer'
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True, host='0.0.0.0')