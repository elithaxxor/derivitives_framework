def calculate_roi(initial_investment, total_returns):
    # TODO: Implement ROI calculation logic.

    try:
        net_profit = total_returns - initial_investment
        roi = (net_profit / initial_investment) * 100
        return roi
    except ZeroDivisionError:
        return "Initial investment cannot be zero."

# Example usage
if __name__ == "__main__":
    investment = float(input("Enter the initial investment: "))
    returns = float(input("Enter the total returns: "))
    roi = calculate_roi(investment, returns)
    print(f"The Return on Investment (ROI) is: {roi:.2f}%")
