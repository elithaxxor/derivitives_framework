import numpy as np
import matplotlib.pyplot as plt
import time



''' This code calculates the price of American options using the binomial model. It defines a function binomial_american_option that takes the following parameters:'''
"""
 Binomial model for American options.
 Args:
     S: Current stock price.
     K: Strike price.
     T: Time to expiration (years).
     r: Risk-free interest rate.
     sigma: Volatility.
     N: Number of time steps.
     option_type: "call" or "put".
 Returns:
     Option price.
 """



def binomial_american_option(S, K, T, r, sigma, N, option_type="call"):

    dt = T / N
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    p = (np.exp(r * dt) - d) / (u - d)

    # Initialize stock price tree
    stock_prices = np.zeros((N + 1, N + 1))
    stock_prices[0, 0] = S
    for i in range(1, N + 1):
        stock_prices[i, 0] = stock_prices[i - 1, 0] * d
        for j in range(1, i + 1):
            stock_prices[i, j] = stock_prices[i - 1, j - 1] * u

    # Initialize option value tree
    option_values = np.zeros((N + 1, N + 1))

    # Calculate option values at expiration
    for j in range(N + 1):
        if option_type == "call":
            option_values[N, j] = max(0, stock_prices[N, j] - K)
        elif option_type == "put":
            option_values[N, j] = max(0, K - stock_prices[N, j])

    # Backward induction
    for i in range(N - 1, -1, -1):
        for j in range(i + 1):
            continuation_value = np.exp(-r * dt) * (
                    p * option_values[i + 1, j + 1] + (1 - p) * option_values[i + 1, j]
            )
            if option_type == "call":
                intrinsic_value = max(0, stock_prices[i, j] - K)
            elif option_type == "put":
                intrinsic_value = max(0, K - stock_prices[i, j])
            option_values[i, j] = max(intrinsic_value, continuation_value)

    return option_values[0, 0]

# Example usage
S = 100  # Current stock price
K = 100  # Strike price
T = 1    # Time to expiration (years)
r = 0.05 # Risk-free interest rate
sigma = 0.2 # Volatility
N = 200   # Number of time steps

call_price = binomial_american_option(S, K, T, r, sigma, N, "call")
put_price = binomial_american_option(S, K, T, r, sigma, N, "put")

print(f"American Call Option Price: {call_price}")
print(f"American Put Option Price: {put_price}")
time.sleep(1)
print("\n.. starting the plotting.. \n This code generates a graphical representation of a binomial tree model for stock prices. It calculates the possible stock prices at each time step (N steps) based on the given parameters (S initial stock price, K strike price, T time to expiration, r risk-free interest rate, and sigma volatility) and plots the resulting tree structure using matplotlib.")
#graphing example of the tree.
#This is a very basic graphing example, and for larger N values, the graph will become very cluttered.
def binomial_tree_graph(S, K, T, r, sigma, N):
    dt = T / N
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    stock_prices = np.zeros((N + 1, N + 1))
    stock_prices[0, 0] = S
    for i in range(1, N + 1):
        stock_prices[i, 0] = stock_prices[i - 1, 0] * d
        for j in range(1, i + 1):
            stock_prices[i, j] = stock_prices[i - 1, j - 1] * u

    for i in range(N):
        for j in range(i + 1):
            plt.plot([i, i + 1], [stock_prices[i, j], stock_prices[i + 1, j]], 'b-')
            plt.plot([i, i + 1], [stock_prices[i, j], stock_prices[i + 1, j + 1]], 'b-')
    plt.show()

binomial_tree_graph(S, K, .25, r, sigma, 4)