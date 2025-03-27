import yfinance as yf
import pandas as pd
import requests
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt

class StockDataFetcher:
    def __init__(self, ticker, start_date, end_date):
        self.ticker = ticker
        self.start_date = start_date
        self.end_date = end_date

    def fetch_stock_data(self):
        stock = yf.Ticker(self.ticker)
        return stock.history(start=self.start_date, end=self.end_date)

class ShortInterestFetcher:
    def __init__(self, ticker):
        self.ticker = ticker

    def get_finviz_short_interest(self):
        url = f"https://finviz.com/quote.ashx?t={self.ticker}"
        headers = {'User-Agent': 'Mozilla/5.0'}

        try:
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            short_interest = soup.find_all('td', class_='snapshot-td2')[9].text
            return float(short_interest.strip('%')) / 100  # Convert % to decimal
        except:
            return None

class StockAnalyzer:
    def __init__(self, ticker, start_date, end_date):
        self.stock_fetcher = StockDataFetcher(ticker, start_date, end_date)
        self.short_interest_fetcher = ShortInterestFetcher(ticker)
        self.data = self.stock_fetcher.fetch_stock_data()

    def check_high_short_interest(self, threshold=0.2):
        short_interest = self.short_interest_fetcher.get_finviz_short_interest()
        if short_interest is None:
            return False
        return short_interest > threshold

    def check_low_float(self, threshold=20_000_000):
        # Placeholder: replace with actual float data retrieval
        float_shares = 10_000_000  # Example static value
        return float_shares < threshold

    def check_unusual_volume(self, multiplier=2):
        avg_volume = self.data['Volume'].mean()
        recent_volume = self.data['Volume'].iloc[-1]
        return recent_volume > avg_volume * multiplier

    def check_price_momentum(self, days=5, change_threshold=0.1):
        price_change = (self.data['Close'].iloc[-1] - self.data['Close'].iloc[-days]) / self.data['Close'].iloc[-days]
        return price_change > change_threshold

    def analyze(self):
        analysis = {
            "High Short Interest": self.check_high_short_interest(),
            "Low Float": self.check_low_float(),
            "Unusual Volume": self.check_unusual_volume(),
            "Price Momentum": self.check_price_momentum()
        }
        return analysis

# Example usage
analyzer = StockAnalyzer("TSLA", "2025-01-01", "2025-03-22")
result = analyzer.analyze()
print(result)
# Output: {'High Short Interest': False, 'Low Float': True, 'Unusual Volume': False, 'Price Momentum': True}
