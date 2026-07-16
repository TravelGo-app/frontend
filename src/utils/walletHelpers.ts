export interface Balance {
  currencyCode: string;
  amount: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface ChartDataPoint {
  date: string;
  closingBalance: number;
}

export interface ActivityLike {
  type: "deposit" | "transfer" | "exchange";
  direction: "in" | "out" | "exchange";
}

export const calculateTotalInARS = (
  balances: Balance[],
  rates: ExchangeRates,
): number => {
  return balances.reduce((total, balance) => {
    const amount = parseFloat(balance.amount);
    if (balance.currencyCode === "ARS") {
      return total + amount;
    }
    const rate = rates[balance.currencyCode];
    if (!rate) return total;
    return total + amount / rate;
  }, 0);
};

export const formatAmount = (value: string): string =>
  parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatSignedAmount = (value: string): string => {
  const num = parseFloat(value);
  const formatted = Math.abs(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${num >= 0 ? "+" : "-"}${formatted}`;
};

export const equivalentInARS = (
  balance: Balance,
  rates: ExchangeRates,
): string | null => {
  if (balance.currencyCode === "ARS") return null;
  const rate = rates[balance.currencyCode];
  if (!rate) return null;
  return (parseFloat(balance.amount) / rate).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const buildChartPoints = (data: ChartDataPoint[]): string => {
  if (data.length < 2) return "";
  const values = data.map((d) => d.closingBalance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = 55 - ((d.closingBalance - min) / range) * 45;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

export const getActivityIcon = (
  tx: ActivityLike,
): { icon: string; bg: string } => {
  if (tx.type === "deposit") return { icon: "+", bg: "#2391ae" };
  if (tx.type === "exchange") return { icon: "↔", bg: "#ff4242" };
  if (tx.direction === "out") return { icon: "↑", bg: "#ff7d60" };
  return { icon: "↓", bg: "#16a34a" };
};
