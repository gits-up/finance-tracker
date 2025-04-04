import pandas as pd
import numpy as np
import os
from pathlib import Path

# Set the correct data directory
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'

def generate_stock_data(ticker, start_price, volatility, drift, volume_range, dates):
    """Generate synthetic stock data for a single ticker"""
    close_price = start_price
    prices = []
    
    for _ in range(len(dates)):
        change = np.random.normal(drift, volatility)
        close_price *= (1 + change)
        prices.append(close_price)
    
    return pd.DataFrame({
        'Date': dates,
        'Open': [price * (1 - np.random.uniform(0, 0.01)) for price in prices],
        'High': [price * (1 + np.random.uniform(0, 0.015)) for price in prices],
        'Low': [price * (1 - np.random.uniform(0, 0.015)) for price in prices],
        'Close': prices,
        'Adj Close': [price * (1 - np.random.uniform(0, 0.002)) for price in prices],
        'Volume': [int(np.random.uniform(*volume_range)) for _ in range(len(dates))]
    })

def generate_sample_stock_data():
    """Generate sample stock data for multiple companies"""
    configs = [
        {'ticker': 'AAPL', 'start_price': 150, 'volatility': 0.015, 'drift': 0.0005, 'volume_range': (5000000, 100000000)},
        {'ticker': 'MSFT', 'start_price': 250, 'volatility': 0.013, 'drift': 0.0006, 'volume_range': (10000000, 80000000)},
        {'ticker': 'GOOGL', 'start_price': 2000, 'volatility': 0.016, 'drift': 0.0004, 'volume_range': (8000000, 90000000)},
        {'ticker': 'META', 'start_price': 300, 'volatility': 0.020, 'drift': 0.0008, 'volume_range': (7000000, 90000000)},
        {'ticker': 'NFLX', 'start_price': 350, 'volatility': 0.014, 'drift': 0.0007, 'volume_range': (8000000, 90000000)},
        {'ticker': 'AMZN', 'start_price': 750, 'volatility': 0.015, 'drift': 0.0006, 'volume_range': (9000000, 90000000)}
    ]
    
    # Create data directory if it doesn't exist
    DATA_DIR.mkdir(exist_ok=True)
    
    dates = pd.date_range(start='2023-01-01', periods=200, freq='B')
    np.random.seed(42)
    
    for config in configs:
        try:
            data = generate_stock_data(
                ticker=config['ticker'],
                start_price=config['start_price'],
                volatility=config['volatility'],
                drift=config['drift'],
                volume_range=config['volume_range'],
                dates=dates
            )
            
            file_path = DATA_DIR / f"{config['ticker']}.csv"
            data.to_csv(file_path, index=False)
            print(f"Generated: {file_path}")
            
        except Exception as e:
            print(f"Error generating {config['ticker']}: {str(e)}")

if __name__ == "__main__":
    print(f"Generating sample data in: {DATA_DIR}")
    generate_sample_stock_data()
    print("Data generation complete!")