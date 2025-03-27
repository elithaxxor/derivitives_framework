# src/derivatives/core/options_calculator.py
import numpy as np
from scipy.stats import norm

class OptionsCalculator:
def __init__(self, risk_free_rate=0.02):
self.risk_free_rate = risk_free_rate

def black_scholes(self, S, K, T, sigma, option_type='call'):
"""Calculate option price using Black-Scholes model

Args:
    S: Current stock price
K: Strike price
T: Time to expiration (in years)
sigma: Volatility
option_type: 'call' or 'put'
"""
d1 = (np.log(S/K) + (self.risk_free_rate + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
d2 = d1 - sigma * np.sqrt(T)

if option_type == 'call':
price = S * norm.cdf(d1) - K * np.exp(-self.risk_free_rate * T) * norm.cdf(d2)
else:
price = K * np.exp(-self.risk_free_rate * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

return price

def calculate_delta(self, S, K, T, sigma, option_type='call'):
"""Calculate Delta (Δ): sensitivity to underlying price changes"""
d1 = (np.log(S/K) + (self.risk_free_rate + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))

if option_type == 'call':
return norm.cdf(d1)
else:
return norm.cdf(d1) - 1

def calculate_gamma(self, S, K, T, sigma):
"""Calculate Gamma (Γ): rate of change of Delta"""
d1 = (np.log(S/K) + (self.risk_free_rate + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
return norm.pdf(d1) / (S * sigma * np.sqrt(T))

def calculate_vega(self, S, K, T, sigma):
"""Calculate Vega (ν): sensitivity to volatility changes"""
d1 = (np.log(S/K) + (self.risk_free_rate + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
return S * np.sqrt(T) * norm.pdf(d1) / 100  # Scaled by 100 for 1% change