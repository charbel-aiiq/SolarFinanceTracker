import { Payment } from "@shared/schema";

export function calculateIRR(payments: Payment[]): number {
  // Simple IRR calculation using Newton-Raphson method
  // This is a basic implementation - for production use a more robust library
  
  const cashFlows = payments.map(p => {
    const amount = parseFloat(p.amount);
    return p.type === "client_payment" ? amount : -amount;
  });

  if (cashFlows.length === 0) return 0;

  let rate = 0.1; // Initial guess
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let npvDerivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const discountFactor = Math.pow(1 + rate, j);
      npv += cashFlows[j] / discountFactor;
      npvDerivative -= j * cashFlows[j] / (discountFactor * (1 + rate));
    }

    if (Math.abs(npv) < tolerance) {
      return rate * 100; // Return as percentage
    }

    if (Math.abs(npvDerivative) < tolerance) {
      break; // Avoid division by zero
    }

    rate = rate - npv / npvDerivative;
  }

  return rate * 100; // Return as percentage
}

export function calculatePnL(payments: Payment[]) {
  const clientPayments = payments.filter(p => p.type === "client_payment");
  const supplierPayments = payments.filter(p => p.type === "supplier_payment");

  const totalIncome = clientPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalExpenses = supplierPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    clientPayments: clientPayments.length,
    supplierPayments: supplierPayments.length
  };
}
