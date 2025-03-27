import matplotlib.pyplot as plt
from colorama import Fore, Style
import numpy as np

def log_message(symbol, message):
    color_codes = {
        '[+]': Fore.GREEN + '[+]' + Style.RESET_ALL,
        '[-]': Fore.RED + '[-]' + Style.RESET_ALL,
        '[!]': Fore.YELLOW + '[!]' + Style.RESET_ALL,
        '[?]': Fore.BLUE + '[?]' + Style.RESET_ALL
    }
    print(f"{color_codes.get(symbol, '')} {message}")

def calculate_roi(initial_investment, total_returns):
    try:
        net_profit = total_returns - initial_investment
        roi = (net_profit / initial_investment) * 100
        return net_profit, roi
    except ZeroDivisionError:
        log_message('[-]', "Investment was zero.")
        return None, None
    except Exception as e:
        log_message('[!]', f"Unexpected error: {e}")
        return None, None

def main():
    investments = [1000, 1500, 2000, 2500]
    returns = [1500, 1400, 3000, 2000]

    all_net_profits, all_rois = [], []
    for i, (inv, ret) in enumerate(zip(investments, returns)):
        net_profit, roi = calculate_roi(inv, ret)
        if net_profit is not None:
            log_message('[+]', f"Investment {i+1}: net profit = {net_profit}, ROI = {roi:.2f}%")
            all_net_profits.append(net_profit)
            all_rois.append(roi)
        else:
            log_message('[?]', f"Skipping investment {i+1}.")

    # Plotting
    fig, axs = plt.subplots(1, 2, figsize=(10, 4))

    # Bar chart of net profits
    axs[0].bar(range(len(all_net_profits)), all_net_profits, color='green')
    axs[0].set_title("Net Profit")
    axs[0].set_xlabel("Investment Index")
    axs[0].set_ylabel("Amount")

    # Line chart of ROI
    axs[1].plot(range(len(all_rois)), all_rois, marker='o', color='blue')
    axs[1].set_title("ROI (%)")
    axs[1].set_xlabel("Investment Index")
    axs[1].set_ylabel("ROI %")

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()