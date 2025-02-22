import yfinance as yf
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import networkx as nx
import matplotlib.pyplot as plt
import pickle


# with open("association_rules.pkl", "rb") as f:
#     loaded_rules = pickle.load(f)
# print(loaded_rules)

# Step 1: Fetch stock data from Yahoo Finance
tickers = ["AAPL", "TSLA", "MSFT", "GOOG"]
start_date = "2023-01-01"
end_date = "2024-01-01"

# Download data and extract only 'Close' prices
df = yf.download(tickers, start=start_date, end=end_date)
df = df["Close"]  # Fix MultiIndex issue

# Step 2: Convert into binary transactions (1 if stock price increased, 0 if decreased)
df_returns = df.pct_change().dropna()
df_binary = df_returns.map(lambda x: x > 0)  # Boolean values instead of 0/1

# Step 3: Apply Apriori Algorithm
frequent_itemsets = apriori(df_binary, min_support=0.2, use_colnames=True)
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)

# Step 4: Display Rules in Text Format
print("\n--- Association Rules ---\n")
for idx, row in rules.iterrows():
    antecedents = ', '.join(row['antecedents'])
    consequents = ', '.join(row['consequents'])
    print(f"Rule {idx+1}: If {antecedents} increases, then {consequents} is likely to increase")
    print(f"   → Support: {round(row['support'], 4)}, Confidence: {round(row['confidence'], 4)}, Lift: {round(row['lift'], 4)}\n")

# Step 5: Visualization of Stock Market Basket Analysis Network
plt.figure(figsize=(8, 6))

# Create a network graph
G = nx.DiGraph()

# Limit the number of rules to avoid graph freezing
rules = rules.sort_values(by="lift", ascending=False).head(10)

# Add edges based on association rules
for idx, row in rules.iterrows():
    G.add_edge(str(row["antecedents"]), str(row["consequents"]), weight=row["lift"])

# Draw network
pos = nx.spring_layout(G)
labels = {edge: round(G[edge[0]][edge[1]]['weight'], 2) for edge in G.edges}
# Save the association rules DataFrame as a pickle file
with open("association_rules.pkl", "wb") as f:
    pickle.dump(rules, f)

print("Pickle file 'association_rules.pkl' saved successfully!")

# To load the pickle file later:
nx.draw(G, pos, with_labels=True, node_color="lightblue", node_size=3000, edge_color="gray")
nx.draw_networkx_edge_labels(G, pos, edge_labels=labels, font_size=10)

plt.title("Stock Market Basket Analysis Network")
plt.show()
