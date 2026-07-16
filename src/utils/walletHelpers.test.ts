import { describe, it, expect } from "vitest";
import {
  calculateTotalInARS,
  formatAmount,
  formatSignedAmount,
  equivalentInARS,
  buildChartPoints,
  getActivityIcon,
} from "./walletHelpers";

describe("calculateTotalInARS", () => {
  it("devuelve 0 cuando no hay balances", () => {
    expect(calculateTotalInARS([], {})).toBe(0);
  });

  it("suma el ARS directamente, sin conversión", () => {
    const balances = [{ currencyCode: "ARS", amount: "1000.00" }];
    expect(calculateTotalInARS(balances, {})).toBe(1000);
  });

  it("convierte una moneda distinta a ARS usando la tasa", () => {
    const balances = [{ currencyCode: "USD", amount: "10.00" }];
    const rates = { USD: 0.001 };
    expect(calculateTotalInARS(balances, rates)).toBe(10000);
  });

  it("ignora una moneda si no hay tasa disponible para ella", () => {
    const balances = [
      { currencyCode: "ARS", amount: "500.00" },
      { currencyCode: "EUR", amount: "20.00" },
    ];
    expect(calculateTotalInARS(balances, {})).toBe(500);
  });

  it("suma correctamente varias monedas distintas a la vez", () => {
    const balances = [
      { currencyCode: "ARS", amount: "1000.00" },
      { currencyCode: "USD", amount: "10.00" },
      { currencyCode: "EUR", amount: "5.00" },
    ];
    const rates = { USD: 0.001, EUR: 0.0005 };
    expect(calculateTotalInARS(balances, rates)).toBe(21000);
  });

  it("no rompe si el amount viene como string vacío", () => {
    const balances = [{ currencyCode: "ARS", amount: "" }];
    expect(calculateTotalInARS(balances, {})).toBeNaN();
  });
});

describe("formatAmount", () => {
  it("formatea un número entero con 2 decimales", () => {
    expect(formatAmount("100")).toBe("100.00");
  });

  it("formatea un número con miles usando coma como separador", () => {
    expect(formatAmount("1234.5")).toBe("1,234.50");
  });

  it("redondea a 2 decimales cuando el valor tiene más precisión", () => {
    expect(formatAmount("10.126")).toBe("10.13");
  });
});

describe("formatSignedAmount", () => {
  it("agrega el signo + para valores positivos", () => {
    expect(formatSignedAmount("50")).toBe("+50.00");
  });

  it("agrega el signo - para valores negativos", () => {
    expect(formatSignedAmount("-25.5")).toBe("-25.50");
  });

  it("formatea el cero con signo +", () => {
    expect(formatSignedAmount("0")).toBe("+0.00");
  });
});

describe("equivalentInARS", () => {
  it("devuelve null cuando la moneda ya es ARS", () => {
    const balance = { currencyCode: "ARS", amount: "1000" };
    expect(equivalentInARS(balance, {})).toBeNull();
  });

  it("devuelve null cuando no hay tasa para esa moneda", () => {
    const balance = { currencyCode: "USD", amount: "10" };
    expect(equivalentInARS(balance, {})).toBeNull();
  });

  it("calcula el equivalente en ARS correctamente cuando hay tasa", () => {
    const balance = { currencyCode: "USD", amount: "10" };
    const rates = { USD: 0.001 };
    expect(equivalentInARS(balance, rates)).toBe("10,000");
  });
});

describe("buildChartPoints", () => {
  it("devuelve un string vacío si hay menos de 2 puntos", () => {
    expect(buildChartPoints([{ date: "06-01", closingBalance: 100 }])).toBe("");
  });

  it("devuelve puntos válidos cuando hay 2 o más datos", () => {
    const data = [
      { date: "06-01", closingBalance: 100 },
      { date: "06-02", closingBalance: 200 },
    ];
    const result = buildChartPoints(data);
    expect(result).toContain(",");
    expect(result.split(" ")).toHaveLength(2);
  });

  it("no rompe (ni divide por cero) cuando todos los valores son iguales", () => {
    const data = [
      { date: "06-01", closingBalance: 100 },
      { date: "06-02", closingBalance: 100 },
    ];
    expect(() => buildChartPoints(data)).not.toThrow();
  });
});

describe("getActivityIcon", () => {
  it("devuelve el ícono oceano para un depósito", () => {
    expect(getActivityIcon({ type: "deposit", direction: "in" })).toEqual({
      icon: "+",
      bg: "#2391ae",
    });
  });

  it("devuelve el ícono coral para un intercambio", () => {
    expect(
      getActivityIcon({ type: "exchange", direction: "exchange" }),
    ).toEqual({
      icon: "↔",
      bg: "#ff4242",
    });
  });

  it("devuelve el ícono terracota para una transferencia enviada", () => {
    expect(getActivityIcon({ type: "transfer", direction: "out" })).toEqual({
      icon: "↑",
      bg: "#ff7d60",
    });
  });

  it("devuelve el ícono verde para una transferencia recibida", () => {
    expect(getActivityIcon({ type: "transfer", direction: "in" })).toEqual({
      icon: "↓",
      bg: "#16a34a",
    });
  });
});
