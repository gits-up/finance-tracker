import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta

class StockDataProcessor:
    """Process and prepare stock data for analysis"""
    
    def __init__(self, data_path=None):
        self.data_path = data_path
        self.data = None
        
    def load_data(self, data_path=None):
        """Load stock data from CSV file"""
        if data_path:
            self.data_path = data_path
        
        if self.data_path is None:
            raise ValueError("Data path not provided")
        
        try:
            self.data = pd.read_csv(self.data_path)
            # Convert date column to datetime
            if 'Date' in self.data.columns:
                self.data['Date'] = pd.to_datetime(self.data['Date'])
            
            # Verify all required columns are present
            required_columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']
            missing_columns = set(required_columns) - set(self.data.columns)
            if missing_columns:
                print(f"Warning: Missing columns: {missing_columns}")
                
            return self.data
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def clean_data(self):
        """Clean and preprocess the data"""
        if self.data is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        # Check for missing values
        if self.data.isnull().sum().sum() > 0:
            print(f"Found {self.data.isnull().sum().sum()} missing values")
            # Fill missing values or drop rows with missing values
            self.data = self.data.dropna()
            
        # Sort by date if available
        if 'Date' in self.data.columns:
            self.data = self.data.sort_values('Date')
            
        return self.data
    
    def add_technical_indicators(self, use_adj_close=True):
        """
        Add technical indicators to the dataset
        
        Parameters:
        use_adj_close (bool): Whether to use Adjusted Close price for calculations (default: True)
        """
        if self.data is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        # Choose price column based on parameter
        price_col = 'Adj Close' if use_adj_close and 'Adj Close' in self.data.columns else 'Close'
        print(f"Using {price_col} prices for technical indicators")
        
        # Simple Moving Average (SMA)
        self.data['SMA_20'] = self.data[price_col].rolling(window=20).mean()
        self.data['SMA_50'] = self.data[price_col].rolling(window=50).mean()
        
        # Exponential Moving Average (EMA)
        self.data['EMA_20'] = self.data[price_col].ewm(span=20, adjust=False).mean()
        
        # Relative Strength Index (RSI)
        delta = self.data[price_col].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        self.data['RSI'] = 100 - (100 / (1 + rs))
        
        # Moving Average Convergence Divergence (MACD)
        exp1 = self.data[price_col].ewm(span=12, adjust=False).mean()
        exp2 = self.data[price_col].ewm(span=26, adjust=False).mean()
        self.data['MACD'] = exp1 - exp2
        self.data['MACD_Signal'] = self.data['MACD'].ewm(span=9, adjust=False).mean()
        
        # Calculate returns
        self.data['Daily_Return'] = self.data[price_col].pct_change()
        self.data['5D_Future_Return'] = self.data[price_col].pct_change(periods=5).shift(-5)
        self.data['10D_Future_Return'] = self.data[price_col].pct_change(periods=10).shift(-10)
        self.data['30D_Future_Return'] = self.data[price_col].pct_change(periods=30).shift(-30)
        
        # Add price-based indicators
        # Price Rate of Change (ROC)
        self.data['Price_ROC_5'] = self.data[price_col].pct_change(periods=5) * 100
        self.data['Price_ROC_10'] = self.data[price_col].pct_change(periods=10) * 100
        
        # Bollinger Bands
        self.data['BB_Middle'] = self.data[price_col].rolling(window=20).mean()
        self.data['BB_StdDev'] = self.data[price_col].rolling(window=20).std()
        self.data['BB_Upper'] = self.data['BB_Middle'] + (2 * self.data['BB_StdDev'])
        self.data['BB_Lower'] = self.data['BB_Middle'] - (2 * self.data['BB_StdDev'])
        
        # Percentage difference from Bollinger Bands
        self.data['BB_Position'] = (self.data[price_col] - self.data['BB_Lower']) / (self.data['BB_Upper'] - self.data['BB_Lower'])
        
        # Drop NaN values after creating indicators
        self.data = self.data.dropna()
        
        return self.data

class StockAnalyzer:
    """Analyze stock data to extract insights"""
    
    def __init__(self, data):
        self.data = data
        self.model = None
        self.use_adj_close = 'Adj Close' in data.columns
        self.price_col = 'Adj Close' if self.use_adj_close else 'Close'
        
    def calculate_performance_metrics(self, ticker=None):
        """Calculate key performance metrics"""
        metrics = {}
        
        # Return metrics
        metrics['daily_avg_return'] = self.data['Daily_Return'].mean()
        metrics['daily_return_std'] = self.data['Daily_Return'].std()
        metrics['annual_return'] = metrics['daily_avg_return'] * 252  # Approx. trading days in a year
        
        # Volatility
        metrics['annual_volatility'] = metrics['daily_return_std'] * np.sqrt(252)
        
        # Sharpe Ratio (assuming risk-free rate of 0 for simplicity)
        metrics['sharpe_ratio'] = metrics['annual_return'] / metrics['annual_volatility'] if metrics['annual_volatility'] != 0 else 0
        
        # Trend indicators
        last_price = self.data[self.price_col].iloc[-1]
        metrics['sma_20_ratio'] = last_price / self.data['SMA_20'].iloc[-1]
        metrics['sma_50_ratio'] = last_price / self.data['SMA_50'].iloc[-1]
        
        # RSI and MACD indicators
        metrics['current_rsi'] = self.data['RSI'].iloc[-1]
        metrics['macd_signal'] = self.data['MACD'].iloc[-1] - self.data['MACD_Signal'].iloc[-1]
        
        # Bollinger Band position
        metrics['bb_position'] = self.data['BB_Position'].iloc[-1]
        
        # Max drawdown
        cumulative_returns = (1 + self.data['Daily_Return']).cumprod()
        running_max = cumulative_returns.cummax()
        drawdown = (cumulative_returns / running_max) - 1
        metrics['max_drawdown'] = drawdown.min()
        
        # Recent performance
        min_periods = min(30, len(self.data))
        metrics['return_last_month'] = self.data[self.price_col].iloc[-1] / self.data[self.price_col].iloc[-min_periods] - 1
        
        min_periods = min(7, len(self.data))
        metrics['return_last_week'] = self.data[self.price_col].iloc[-1] / self.data[self.price_col].iloc[-min_periods] - 1
        
        # Print summary
        print(f"\nPerformance Metrics{' for ' + ticker if ticker else ''}:")
        for metric, value in metrics.items():
            print(f"{metric.replace('_', ' ').title()}: {value:.4f}")
            
        return metrics
    
    def build_prediction_model(self, forecast_period=10):
        """Build a model to predict future returns"""
        # Prepare features and target
        features = [
            'SMA_20', 'SMA_50', 'EMA_20', 'RSI', 'MACD', 'MACD_Signal', 
            'Daily_Return', 'Price_ROC_5', 'Price_ROC_10', 'BB_Position'
        ]
        target = f'{forecast_period}D_Future_Return'
        
        # Ensure all features are available
        missing_features = [f for f in features if f not in self.data.columns]
        if missing_features:
            print(f"Warning: Missing features: {missing_features}")
            features = [f for f in features if f in self.data.columns]
            
        if not features:
            raise ValueError("No valid features available for model training")
            
        if target not in self.data.columns:
            raise ValueError(f"Target column '{target}' not found in data")
        
        X = self.data[features]
        y = self.data[target]
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Split into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        
        # Train a Random Forest model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate the model
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
        
        print(f"\nModel R² (Training): {train_score:.4f}")
        print(f"Model R² (Testing): {test_score:.4f}")
        
        # Store the model for later use
        self.model = model
        self.forecast_period = forecast_period
        self.feature_list = features
        self.scaler = scaler
        
        return model
    
    def predict_future_return(self):
        """Predict future return using the trained model"""
        if self.model is None:
            raise ValueError("Model not trained. Call build_prediction_model() first.")
        
        # Get the latest data point
        latest_data = self.data[self.feature_list].iloc[-1:]
        
        # Scale the data
        latest_data_scaled = self.scaler.transform(latest_data)
        
        # Make prediction
        predicted_return = self.model.predict(latest_data_scaled)[0]
        
        print(f"\nPredicted {self.forecast_period}-day return: {predicted_return:.4f} ({predicted_return * 100:.2f}%)")
        
        return predicted_return
    
    def backtest_model(self, forecast_period=10):
        """Backtest the prediction model on historical data"""
        if self.model is None:
            self.build_prediction_model(forecast_period)
            
        # Prepare features and target
        features = self.feature_list
        target = f'{forecast_period}D_Future_Return'
        
        X = self.data[features]
        y = self.data[target]
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Make predictions on all data
        predictions = self.model.predict(X_scaled)
        
        # Calculate directional accuracy
        correct_direction = np.sign(predictions) == np.sign(y)
        directional_accuracy = np.mean(correct_direction) * 100
        
        # Calculate correlation between predictions and actuals
        correlation = np.corrcoef(predictions, y)[0, 1]
        
        # Calculate mean absolute error
        mae = np.mean(np.abs(predictions - y))
        
        return {
            'directional_accuracy': directional_accuracy,
            'correlation': correlation,
            'mae': mae,
            'predictions': predictions,
            'actuals': y.values
        }
    
    def plot_predictions_vs_actuals(self):
        """Plot predictions vs actual returns for visual evaluation"""
        backtest = self.backtest_model()
        plt.figure(figsize=(10, 6))
        plt.scatter(backtest['actuals'], backtest['predictions'], alpha=0.5)
        plt.plot([min(backtest['actuals']), max(backtest['actuals'])], 
                 [min(backtest['actuals']), max(backtest['actuals'])], 'r--')
        plt.xlabel('Actual Returns')
        plt.ylabel('Predicted Returns')
        plt.title('Predicted vs Actual Returns')
        plt.grid(True)
        plt.show()

class StockRecommender:
    """Generate stock buy recommendations based on analysis"""
    
    def __init__(self, stock_data_dict=None):
        self.stock_data = stock_data_dict or {}
        self.stock_analyzers = {}
        self.recommendations = {}
    
    def add_stock_data(self, ticker, data):
        """Add processed stock data for a ticker"""
        self.stock_data[ticker] = data
        self.stock_analyzers[ticker] = StockAnalyzer(data)
        return self.stock_analyzers[ticker]
    
    def analyze_all_stocks(self):
        """Analyze all stocks and compile metrics"""
        all_metrics = {}
        
        for ticker, analyzer in self.stock_analyzers.items():
            metrics = analyzer.calculate_performance_metrics(ticker)
            all_metrics[ticker] = metrics
            
            # Build prediction model
            analyzer.build_prediction_model(forecast_period=10)
            predicted_return = analyzer.predict_future_return()
            all_metrics[ticker]['predicted_10d_return'] = predicted_return
        
        return all_metrics
    
    def generate_recommendations(self, top_n=5):
        """Generate buy recommendations based on analysis"""
        if not self.stock_analyzers:
            raise ValueError("No stock data added. Use add_stock_data() to add stock data.")
        
        # Analyze all stocks
        metrics = self.analyze_all_stocks()
        
        # Score each stock based on key metrics
        scores = {}
        for ticker, ticker_metrics in metrics.items():
            # Enhanced scoring system with better weighting
            score = (
                ticker_metrics['predicted_10d_return'] * 5 +  # Much higher weight for predicted return
                ticker_metrics['sharpe_ratio'] * 0.5 +  # Reduced weight for Sharpe ratio
                ticker_metrics['return_last_week'] * 0.5 +  # Reduced weight for recent performance
                (1 if ticker_metrics['sma_20_ratio'] > 1 else -1) * 0.5 +
                (1 if ticker_metrics['sma_50_ratio'] > 1 else -1) * 0.5 +
                
                # Stronger RSI logic
                (-2 if ticker_metrics['current_rsi'] > 70 else  # Strong penalty for overbought
                 1 if ticker_metrics['current_rsi'] < 30 else 0) +  # Bonus for oversold
                
                (1 if ticker_metrics['macd_signal'] > 0 else -1) * 0.5 +
                (1 if 0.2 < ticker_metrics.get('bb_position', 0.5) < 0.8 else -1) * 0.3 +
                
                # Additional factors
                (1 if ticker_metrics['annual_return'] > 0 else -1) * 0.5  # Favor positive annual returns
            )
            
            # Additional penalties
            if ticker_metrics['predicted_10d_return'] < 0:
                score -= 3  # Strong penalty for negative predicted returns
            
            if ticker_metrics['current_rsi'] > 75:
                score -= 2  # Additional penalty for severely overbought
            
            scores[ticker] = score
        
        # Filter out fundamentally poor candidates
        filtered_scores = {
            ticker: score for ticker, score in scores.items()
            if (metrics[ticker]['predicted_10d_return'] > 0 and  # Only positive predictions
                metrics[ticker]['current_rsi'] < 75 and  # Not severely overbought
                metrics[ticker]['sharpe_ratio'] > 0)  # Positive risk-adjusted return
        }
        
        # Rank stocks based on filtered scores
        ranked_stocks = sorted(filtered_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Get top N recommendations
        top_recommendations = ranked_stocks[:min(top_n, len(ranked_stocks))]
        
        # Format recommendations
        recommendations = []
        for ticker, score in top_recommendations:
            ticker_data = self.stock_data[ticker]
            ticker_metrics = metrics[ticker]
            
            # Use adjusted close if available
            price_col = 'Adj Close' if 'Adj Close' in ticker_data.columns else 'Close'
            
            recommendation = {
                'ticker': ticker,
                'score': score,
                'last_price': ticker_data[price_col].iloc[-1],
                'predicted_return': ticker_metrics['predicted_10d_return'] * 100,  # Convert to percentage
                'recent_performance': ticker_metrics['return_last_month'] * 100,  # Convert to percentage
                'risk_level': self._assess_risk_level(ticker_metrics),
                'reason': self._generate_reason(ticker, ticker_metrics)
            }
            recommendations.append(recommendation)
        
        self.recommendations = recommendations
        return recommendations
    
    def _assess_risk_level(self, metrics):
        """Assess risk level based on metrics"""
        risk_score = 0
        
        # Higher volatility increases risk
        risk_score += metrics['annual_volatility'] * 0.5
        
        # Large drawdown increases risk
        risk_score += abs(metrics['max_drawdown']) * 100
        
        # Overbought conditions increase risk
        if metrics['current_rsi'] > 70:
            risk_score += 20
        
        # Negative returns increase risk
        if metrics['predicted_10d_return'] < 0:
            risk_score += 30
            
        # Normalize to 1-5 scale
        if risk_score > 80:
            return "High"
        elif risk_score > 60:
            return "Medium-High"
        elif risk_score > 40:
            return "Medium"
        elif risk_score > 20:
            return "Medium-Low"
        else:
            return "Low"
    
    def _generate_reason(self, ticker, metrics):
        """Generate a reason for the recommendation"""
        reasons = []
        
        # Positive factors
        if metrics['predicted_10d_return'] > 0.03:
            reasons.append(f"Strong predicted upside ({metrics['predicted_10d_return'] * 100:.2f}% in 10 days)")
        elif metrics['predicted_10d_return'] > 0.01:
            reasons.append(f"Positive predicted return ({metrics['predicted_10d_return'] * 100:.2f}% in 10 days)")
        
        if metrics['sharpe_ratio'] > 1.5:
            reasons.append("Excellent risk-adjusted returns")
        elif metrics['sharpe_ratio'] > 1:
            reasons.append("Good risk-adjusted returns")
        
        if metrics['sma_20_ratio'] > 1 and metrics['sma_50_ratio'] > 1:
            reasons.append("Trading above both 20-day and 50-day moving averages")
        elif metrics['sma_20_ratio'] > 1:
            reasons.append("Trading above 20-day moving average")
        
        if metrics['current_rsi'] < 30:
            reasons.append("Oversold condition (RSI < 30)")
        elif metrics['current_rsi'] < 45:
            reasons.append("Favorable RSI level")
        
        if metrics['macd_signal'] > 0:
            reasons.append("Bullish MACD crossover")
            
        if 'bb_position' in metrics and metrics['bb_position'] < 0.3:
            reasons.append("Near Bollinger Band lower bound (potential rebound)")
        elif 'bb_position' in metrics and 0.4 < metrics['bb_position'] < 0.6:
            reasons.append("Mid Bollinger Band position (stable trend)")
        
        # Risk factors (as caveats)
        if metrics['current_rsi'] > 65:
            reasons.append("Note: Approaching overbought (RSI > 65)")
        
        if metrics['annual_volatility'] > 0.3:
            reasons.append("Note: High volatility")
        
        if not reasons:
            reasons.append(f"Neutral technical indicators show potential for {ticker}")
        
        return "; ".join(reasons[:4])  # Limit to top 4 factors
    
    def display_recommendations(self):
        """Display stock recommendations in a readable format"""
        if not self.recommendations:
            print("No recommendations generated. Call generate_recommendations() first.")
            return
        
        print("\n===== STOCK BUY RECOMMENDATIONS =====")
        for i, rec in enumerate(self.recommendations, 1):
            print(f"\n{i}. {rec['ticker']}")
            print(f"   Current Price: ${rec['last_price']:.2f}")
            print(f"   Predicted 10-Day Return: {rec['predicted_return']:.2f}%")
            print(f"   Last Month Performance: {rec['recent_performance']:.2f}%")
            print(f"   Risk Level: {rec['risk_level']}")
            print(f"   Recommendation Score: {rec['score']:.2f}")
            print(f"   Reason: {rec['reason']}")
        
        print("\n===== DISCLAIMER =====")
        print("This is an educational tool only. Always perform your own research before making investment decisions.")
        print("Past performance does not guarantee future results.")
        print("Recommendations are based on technical analysis only and do not consider fundamental factors.")

    def analyze_all_stocks(self):
        """Analyze all stocks and compile metrics"""
        all_metrics = {}
        accuracy_results = {}
        
        for ticker, analyzer in self.stock_analyzers.items():
            metrics = analyzer.calculate_performance_metrics(ticker)
            all_metrics[ticker] = metrics
            
            # Build and backtest prediction model
            analyzer.build_prediction_model(forecast_period=10)
            backtest_results = analyzer.backtest_model()
            
            # Store accuracy metrics
            accuracy_results[ticker] = {
                'directional_accuracy': backtest_results['directional_accuracy'],
                'correlation': backtest_results['correlation'],
                'mae': backtest_results['mae']
            }
            
            predicted_return = analyzer.predict_future_return()
            all_metrics[ticker]['predicted_10d_return'] = predicted_return
        
        # Print accuracy summary
        print("\n===== MODEL ACCURACY SUMMARY =====")
        for ticker, acc in accuracy_results.items():
            print(f"\n{ticker}:")
            print(f"  Directional Accuracy: {acc['directional_accuracy']:.2f}%")
            print(f"  Predictions-Actuals Correlation: {acc['correlation']:.4f}")
            print(f"  Mean Absolute Error: {acc['mae']:.4f}")
        
        return all_metrics

def main():
    print("Stock Recommendation System")
    print("---------------------------")
    
    # Initialize the recommender
    recommender = StockRecommender()
    
    # Automatically detect all CSV files in the data directory
    data_dir = 'data'
    if not os.path.exists(data_dir):
        print(f"Error: Data directory '{data_dir}' not found.")
        return
    
    # Debug: List all files in directory
    print("\nFiles found in data directory:")
    for f in os.listdir(data_dir):
        print(f"- {f} ({'CSV' if f.endswith('.csv') else 'Not CSV'})")
    
    stock_files = {}
    for file in os.listdir(data_dir):
        if file.endswith('.csv'):
            try:
                ticker = os.path.splitext(file)[0].upper()
                full_path = os.path.join(data_dir, file)
                
                # Debug: Verify file can be read
                test_df = pd.read_csv(full_path)
                required_cols = ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']
                missing_cols = [col for col in required_cols if col not in test_df.columns]
                
                if missing_cols:
                    print(f"\nWarning: {file} is missing columns: {missing_cols}")
                    continue
                
                stock_files[ticker] = full_path
                print(f"Found valid stock data: {ticker} at {full_path}")
                
            except Exception as e:
                print(f"\nError reading {file}: {str(e)}")
                continue
    
    if not stock_files:
        print("\nNo valid CSV files found in the data directory.")
        print("Please ensure files have the correct format and required columns.")
        return
    
    print(f"\nFound {len(stock_files)} valid stock files to process:")
    for ticker in stock_files:
        print(f"- {ticker}")
    
    # Process each stock file found
    success_count = 0
    for ticker, file_path in stock_files.items():
        try:
            print(f"\nProcessing {ticker}...")
            processor = StockDataProcessor(file_path)
            data = processor.load_data()
            
            if data is not None:
                print(f"- Successfully loaded {len(data)} rows")
                processor.clean_data()
                processed_data = processor.add_technical_indicators(use_adj_close=True)
                
                if processed_data is not None:
                    recommender.add_stock_data(ticker, processed_data)
                    success_count += 1
                    print(f"- Successfully processed {ticker}")
                else:
                    print(f"- Failed to process indicators for {ticker}")
            else:
                print(f"- Failed to load data for {ticker}")
                
        except Exception as e:
            print(f"\nError processing {ticker}: {e}")
            continue
    
    # Generate recommendations
    if success_count > 0:
        print(f"\nSuccessfully processed {success_count} stocks:")
        for ticker in recommender.stock_data:
            print(f"- {ticker}")
        
        print("\nGenerating stock recommendations...")
        recommender.generate_recommendations(top_n=min(5, success_count))
        recommender.display_recommendations()
    else:
        print("\nNo stock data was successfully processed. Please check:")
        print("1. File permissions")
        print("2. CSV file formats")
        print("3. Required columns in each file")       
        
if __name__ == "__main__":
    main()